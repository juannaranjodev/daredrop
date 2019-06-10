/* eslint-disable comma-spacing */
import { apiFn } from 'root/src/server/api'

import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectDeliveredKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import deliveryDareInit from 'root/src/server/api/actions/deliveryDareInit'
import deliveryDare from 'root/src/server/api/actions/deliveryDare'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'
import reviewDelivery from 'root/src/server/api/actions/reviewDelivery'
import addPayoutMethod from 'root/src/server/api/actions/addPayoutMethod'
import { PAYOUT_ASSIGNEES } from 'root/src/shared/descriptions/endpoints/endpointIds'
import calculatePayouts from 'root/src/server/api/actionUtil/calculatePayouts'
/* eslint-disable max-len */
import { prop, add, reduce } from 'ramda'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'


describe('payoutAssignees', async () => {
	let project
	test('can\'t make payouts when assignee has no payout method set', async () => {
		// TODO test suites for admin verification
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
		}

		const res = await apiFn(event)
		expect(res.statusCode).toEqual(404)
	})
	test('payouts are calculated properly', async () => {
		await addPayoutMethod({
			userId: mockUserId,
			payload: {
				email: 'email@dot.com',
			},
		})

		await addPayoutMethod({
			userId: `${mockUserId}1`,
			payload: {
				email: 'email1@dot.com',
			},
		})
		const [, , projectPledgesDdb, ,] = await dynamoQueryProject(null, project.id, projectApprovedKey)

		const dareDropFee = reduce((acc, item) => add(acc, prop('pledgeAmount', item)), 0, projectPledgesDdb) * 0.1

		const payoutsCalculated = await calculatePayouts(project.id)
		expect(payoutsCalculated.payouts[0].payout + payoutsCalculated.payouts[1].payout).toBeCloseTo((480000 - dareDropFee), 20)
	})
	test('can make payout', async () => {
		await addPayoutMethod({
			userId: mockUserId,
			payload: {
				email: 'email@dot.com',
			},
		})

		await addPayoutMethod({
			userId: `${mockUserId}1`,
			payload: {
				email: 'email1@dot.com',
			},
		})

		const event = {
			endpointId: PAYOUT_ASSIGNEES,
			payload: {
				projectId: project.id,
			},
		}

		const res = await apiFn(event)
		expect(res.statusCode).toEqual(200)
	})
})
