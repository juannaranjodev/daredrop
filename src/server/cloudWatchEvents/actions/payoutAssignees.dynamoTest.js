/* eslint-disable comma-spacing */
import { apiFn } from 'root/src/server/cloudWatchEvents'
import { apiFn as serverApiFn } from 'root/src/server/api'

import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectDeliveredKey } from 'root/src/shared/descriptions/apiLenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import deliveryDareInit from 'root/src/server/api/actions/deliveryDareInit'
import deliveryDare from 'root/src/server/api/actions/deliveryDare'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'
import reviewDelivery from 'root/src/server/api/actions/reviewDelivery'
import addPayoutMethod from 'root/src/server/api/actions/addPayoutMethod'
import { PAYOUT_ASSIGNEES, PAY_OUTSTANDING_PAYOUTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import calculatePayouts from 'root/src/server/api/actionUtil/calculatePayouts'
/* eslint-disable max-len */
import { prop, add, reduce } from 'ramda'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'


describe('payoutAssignees', async () => {
	let project
	let project2
	test('can\'t make payouts when assignee has no payout method set', async () => {
		project = await createProject({
			userId: 'user-differentuserid',
			payload: createProjectPayload(),
		})

		await auditProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				audit: projectApprovedKey,
			},
		})

		const oAuthDetails = {
			tokenId: 'twitch',
			id: project.assignees[0].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails,
			userId: mockUserId,
		})

		await acceptProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				assigneeId: `twitch|${project.assignees[0].platformId}`,
				amountRequested: 1000,
			},
		})

		const oAuthDetails2 = {
			tokenId: 'twitch',
			id: project.assignees[1].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails2,
			userId: `${mockUserId}1`,
		})

		await acceptProject({
			userId: `${mockUserId}1`,
			payload: {
				projectId: project.id,
				assigneeId: `twitch|${project.assignees[1].platformId}`,
				amountRequested: 1350,
			},
		})

		const deliveryPayload = deliveryDareMock(project.id)

		const deliveryInit = await deliveryDareInit({
			userId: mockUserId,
			payload: deliveryPayload,
		})

		const { deliverySortKey } = deliveryInit

		const deliveryFinishPayload = {
			projectId: project.id,
			deliverySortKey,
		}

		await deliveryDare({
			userId: mockUserId,
			payload: deliveryFinishPayload,
		})

		await reviewDelivery({
			payload: {
				projectId: project.id,
				audit: projectDeliveredKey,
			},
		})

		const event = {
			endpointId: PAYOUT_ASSIGNEES,
			payload: {
				projectId: project.id,
			},
			apiKey: 'asdsadas',
		}

		const res = await apiFn(event)
		expect(res.body.paypalPayout.httpStatusCode).toEqual(404)
	})

	test('payouts are calculated properly', async () => {
		project2 = await createProject({
			userId: 'user-differentuserid',
			payload: createProjectPayload(),
		})

		await auditProject({
			userId: mockUserId,
			payload: {
				projectId: project2.id,
				audit: projectApprovedKey,
			},
		})

		await acceptProject({
			userId: mockUserId,
			payload: {
				projectId: project2.id,
				assigneeId: `twitch|${project2.assignees[0].platformId}`,
				amountRequested: 1000,
			},
		})

		await acceptProject({
			userId: `${mockUserId}1`,
			payload: {
				projectId: project2.id,
				assigneeId: `twitch|${project2.assignees[1].platformId}`,
				amountRequested: 1350,
			},
		})

		const deliveryPayload = deliveryDareMock(project2.id)

		const deliveryInit = await deliveryDareInit({
			userId: mockUserId,
			payload: deliveryPayload,
		})

		const { deliverySortKey } = deliveryInit

		const deliveryFinishPayload = {
			projectId: project2.id,
			deliverySortKey,
		}

		await deliveryDare({
			userId: mockUserId,
			payload: deliveryFinishPayload,
		})

		await reviewDelivery({
			payload: {
				projectId: project2.id,
				audit: projectDeliveredKey,
			},
		})

		await addPayoutMethod({
			userId: mockUserId,
			payload: {
				email: 'email@dot.com',
			},
		})

		const [, , projectPledgesDdb, ,] = await dynamoQueryProject(null, project2.id, projectApprovedKey)

		const dareDropFee = reduce((acc, item) => add(acc, prop('pledgeAmount', item)), 0, projectPledgesDdb) * 0.1

		const payoutsCalculated = await calculatePayouts(project2.id)
		expect(payoutsCalculated.usersWithPaypalMail[0].payout + payoutsCalculated.usersWithoutPaypalMail[0].payout).toBeCloseTo((479960 - dareDropFee), 7)
	})

	test('can\'t make payout from normal apiLambda (protection for cron invoked actions)', async () => {
		const event = {
			endpointId: PAYOUT_ASSIGNEES,
			payload: {
				projectId: project2.id,
			},
		}

		const res = await serverApiFn(event)
		expect(res.statusCode).toEqual(500)
	})

	test('can make payout and haves still one pending payout for user without email', async () => {
		const event = {
			endpointId: PAYOUT_ASSIGNEES,
			payload: {
				projectId: project2.id,
			},
			apiKey: 'asdsadas',
		}

		const res = await apiFn(event)
		expect(res.statusCode).toEqual(200)
		expect(res.body.usersNotPaid.length).toEqual(1)
	})

	test('pays outstanding payouts but leaves next outstanding', async () => {
		const event = {
			endpointId: PAY_OUTSTANDING_PAYOUTS,
			payload: {},
			apiKey: 'asdsadas',
		}

		const res = await apiFn(event)
		const statusCodeArrSorted = [res.body[0].httpStatusCode, res.body[1].httpStatusCode].sort()
		expect(statusCodeArrSorted[0]).toEqual(200)
		expect(statusCodeArrSorted[1]).toEqual(404)
	})

	test('pays all the outstanding payouts', async () => {
		await addPayoutMethod({
			userId: `${mockUserId}1`,
			payload: {
				email: 'email1@dot.com',
			},
		})

		const event = {
			endpointId: PAY_OUTSTANDING_PAYOUTS,
			payload: {},
			apiKey: 'asdsadas',
		}

		const res = await apiFn(event)
		expect(res.body[0].httpStatusCode).toEqual(200)
		expect(res.body[1].httpStatusCode).toEqual(200)
	})

	test('there are no outstanding payouts', async () => {
		const event = {
			endpointId: PAY_OUTSTANDING_PAYOUTS,
			payload: {},
			apiKey: 'asdsadas',
		}

		const res = await apiFn(event)
		expect(res.body.length).toEqual(0)
	})
})
