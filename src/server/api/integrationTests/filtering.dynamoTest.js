import { apiFn } from 'root/src/server/api'
import { omit } from 'ramda'
import { REVIEW_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectDeliveredKey, projectDeliveryRejectedKey } from 'root/src/shared/descriptions/apiLenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import deliveryDareInit from 'root/src/server/api/actions/deliveryDareInit'
import deliveryDare from 'root/src/server/api/actions/deliveryDare'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'
import getPendingDeliveries from 'root/src/server/api/actions/getPendingDeliveries'
import getActiveProjects from 'root/src/server/api/actions/getActiveProjects'
import mockdate from 'mockdate'
import moment from 'moment'
import reviewDelivery from 'root/src/server/api/actions/reviewDelivery'
import getMyProjects from 'root/src/server/api/actions/getMyProjects'

describe('filtering tests', async () => {
	let project
	test('pending delivery is displayed on review page, but is not on marketplace', async () => {
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

		const projectsOnMarketplace = await getActiveProjects({ payload: {} })

		const pendingDeliveries = await getPendingDeliveries({ payload: {} })

		expect(pendingDeliveries.items[0].deliveries.length).toEqual(1)
		expect(omit(['created'], projectsOnMarketplace.items[0])).toEqual(omit(['deliveries', 'created'], pendingDeliveries.items[0]))
	})
	test('doesn\'t displays expired projects but deliveries are shown', async () => {
		const inTwoWeeks = moment().add(14, 'days').format()
		mockdate.set(inTwoWeeks)
		const projectsOnMarketplace = await getActiveProjects({ payload: {} })
		const pendingDeliveries = await getPendingDeliveries({ payload: {} })

		expect(projectsOnMarketplace.items.length).toEqual(0)
		expect(pendingDeliveries.items.length).toEqual(1)
	})
	test('expired but approved deliveries are shown on my-projects, but not approved are not', async () => {
		mockdate.reset()
		const project2 = await createProject({
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
		const inTwoWeeks = moment().add(14, 'days').format()
		mockdate.set(inTwoWeeks)
		await reviewDelivery({
			payload: {
				audit: projectDeliveredKey,
				projectId: project.id,
			},
		})
		const oAuthDetails = {
			tokenId: 'twitch',
			id: project2.assignees[0].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails,
			userId: mockUserId,
		})

		const projectsOnMarketplace = await getActiveProjects({ payload: {} })
		const pendingDeliveries = await getPendingDeliveries({ payload: {} })
		const myProjects = await getMyProjects({ userId: 'user-differentuserid', payload: { currentPage: 1 } })
		expect(projectsOnMarketplace.items.length).toEqual(0)
		expect(pendingDeliveries.items.length).toEqual(0)
		expect(myProjects.items.length).toEqual(1)
	})

	mockdate.reset()
})
