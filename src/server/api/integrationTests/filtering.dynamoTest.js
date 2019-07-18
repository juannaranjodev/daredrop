import mockdate from 'mockdate'
import moment from 'moment'
import { assoc, map, omit, range } from 'ramda'
import { apiFn } from 'root/src/server/api'
import { GET_MY_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectDeliveredKey } from 'root/src/shared/descriptions/apiLenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import auditFavorites from 'root/src/server/api/actions/auditFavorites'
import deliveryDare from 'root/src/server/api/actions/deliveryDare'
import deliveryDareInit from 'root/src/server/api/actions/deliveryDareInit'
import getActiveProjects from 'root/src/server/api/actions/getActiveProjects'
import getMyProjects from 'root/src/server/api/actions/getMyProjects'
import getPendingDeliveries from 'root/src/server/api/actions/getPendingDeliveries'
import pledgeProject from 'root/src/server/api/actions/pledgeProject'
import reviewDelivery from 'root/src/server/api/actions/reviewDelivery'
import createPledgeProjectPayload from 'root/src/server/api/mocks/createPledgeProjectPayload'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'

describe('filtering tests', async () => {
	let project
	let projectArr
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
		mockdate.reset()
	})


	test('gets only dares for me', async () => {
		const projectPayload = createProjectPayload()
		const modifiedProjectPayload = assoc('assignees', [{ id: 419843502 }], projectPayload)
		await createProject({
			userId: mockUserId,
			payload: modifiedProjectPayload,
		})
		projectArr = await Promise.all(map(() => createProject({
			userId: mockUserId,
			payload: createProjectPayload(),
		}), range(0, 3)))

		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: {
				currentPage: 1,
				filter: [{
					param: 'assignee',
					value: `twitch|${projectArr[0].assignees[0].platformId}`,
				}],
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		expect(res.body.items.length).toEqual(4)
	})

	test('gets only delivered dares', async () => {
		await auditProject({
			userId: mockUserId,
			payload: {
				projectId: projectArr[0].id,
				audit: projectApprovedKey,
			},
		})

		await acceptProject({
			userId: mockUserId,
			payload: {
				projectId: projectArr[0].id,
				assigneeId: `twitch|${projectArr[0].assignees[0].platformId}`,
				amountRequested: 1000,
			},
		})

		const deliveryPayload = deliveryDareMock(projectArr[0].id)
		const deliveryInit = await deliveryDareInit({
			userId: mockUserId,
			payload: deliveryPayload,
		})

		const { deliverySortKey } = deliveryInit

		const deliveryFinishPayload = {
			projectId: projectArr[0].id,
			deliverySortKey,
		}

		await deliveryDare({
			userId: mockUserId,
			payload: deliveryFinishPayload,
		})

		await reviewDelivery({
			userId: mockUserId,
			payload: {
				projectId: projectArr[0].id,
				audit: projectDeliveredKey,
			},
		})

		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: {
				currentPage: 1,
				filter: [{
					param: 'project',
					value: projectDeliveredKey,
				}],
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		expect(res.body.items.length).toEqual(2)
	})

	test('gets only my favorites', async () => {
		await Promise.all(map(i => auditFavorites({
			userId: mockUserId,
			payload: {
				projectId: projectArr[i].id,
			},
		}), [0, 2]))

		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: {
				currentPage: 1,
				filter: [{
					param: 'favorites',
					value: mockUserId,
				}],
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		expect(res.body.items.length).toEqual(2)
	})

	test('gets only my pledges', async () => {
		const otherProjectArr = await Promise.all(map(() => createProject({
			userId: `${mockUserId}111`,
			payload: createProjectPayload(),
		}), range(0, 3)))

		await Promise.all(map(i => auditProject({
			userId: mockUserId,
			payload: {
				projectId: otherProjectArr[i].id,
				audit: projectApprovedKey,
			},
		}), range(0, 3)))

		await Promise.all(map(i => pledgeProject({
			userId: mockUserId,
			payload: createPledgeProjectPayload(otherProjectArr[i].id),
		}), range(0, 2)))

		await Promise.all(map(i => auditFavorites({
			userId: mockUserId,
			payload: {
				projectId: otherProjectArr[i].id,
			},
		}), [0, 2]))

		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: {
				currentPage: 1,
				filter: [{
					param: 'pledge',
					value: mockUserId,
				}],
			},
			authentication: mockUserId,
		}

		const res = await apiFn(event)
		expect(res.body.items.length).toEqual(6)
	})
})
