import { apiFn } from 'root/src/server/api'

import { REVIEW_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectDeliveredKey, projectDeliveryRejectedKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import deliveryDareInit from 'root/src/server/api/actions/deliveryDareInit'
import deliveryDare from 'root/src/server/api/actions/deliveryDare'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'
import getPendingDeliveries from 'root/src/server/api/actions/getPendingDeliveries'
import dynamoQueryProjectPledges from 'root/src/server/api/actionUtil/dynamoQueryProjectPledges'

describe('approveDelivery', async () => {
	let project
	test('Correctly approves delivery', async () => {
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

		const event = {
			userId: mockUserId,
			endpointId: REVIEW_DELIVERY,
			payload: {
				projectId: project.id,
				audit: projectDeliveredKey,
			},
		}
		const res = await apiFn(event)

		expect(res.body.status).toEqual(projectDeliveredKey)
	})
	let project2
	test('can\'t reject delivery without message', async () => {
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

		const event = {
			userId: mockUserId,
			endpointId: REVIEW_DELIVERY,
			payload: {
				projectId: project2.id,
				audit: projectDeliveryRejectedKey,
			},
		}

		const res = await apiFn(event)

		expect(res.statusCode).toEqual(400)
	})
	test('there is 1 pending delivery', async () => {
		const deliveries = await getPendingDeliveries({
			userId: mockUserId,
			payload: {
				currentPage: 1,
			},
		})

		expect(deliveries.items.length).toEqual(1)
	})
	test('can reject delivery', async () => {
		const event = {
			userId: mockUserId,
			endpointId: REVIEW_DELIVERY,
			payload: {
				projectId: project2.id,
				audit: projectDeliveryRejectedKey,
				message: 'asdf;lksdafikjmdsifjkm',
			},
		}

		const res = await apiFn(event)

		expect(res.body.status).toEqual(projectDeliveryRejectedKey)
	})
	test('there are no pending deliveries', async () => {
		const deliveries = await getPendingDeliveries({
			userId: mockUserId,
			payload: {
				currentPage: 1,
			},
		})
		expect(deliveries.items.length).toEqual(0)
	})

	test('paypal capture payment', async () => {
		const projectPledges = await dynamoQueryProjectPledges(project.id)
		expect(projectPledges[0].paymentInfo[0].captured).toEqual(200)
	})
})
