import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import {
	projectApprovedKey, projectDeliveredKey, projectDeliveryRejectedKey, projectPendingKey,
	projectAcceptedKey, projectDeliveryInitKey, projectDeliveryPendingKey,
} from 'root/src/shared/descriptions/apiLenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import deliveryDareInit from 'root/src/server/api/actions/deliveryDareInit'
import deliveryDare from 'root/src/server/api/actions/deliveryDare'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'

import getPendingProjects from 'root/src/server/api/actions/getPendingProjects'
import getActiveProjects from 'root/src/server/api/actions/getActiveProjects'
import getProject from 'root/src/server/api/actions/getProject'
import reviewDelivery from 'root/src/server/api/actions/reviewDelivery'

describe('statuses are displayed properly on cards or on detail page', async () => {
	let project
	test('Correctly displays pending projects', async () => {
		project = await createProject({
			userId: 'user-differentuserid',
			payload: createProjectPayload(),
		})

		const pendingProjects = await getPendingProjects({ payload: {} })
		const pendingProject = await getProject({ payload: { projectId: project.id } })

		expect(pendingProjects.items[0].status).toEqual(projectPendingKey)
		expect(pendingProject.status).toEqual(projectPendingKey)
	})
	test('Correctly displays approved projects', async () => {
		await auditProject({ payload: { projectId: project.id, audit: projectApprovedKey } })

		const activeProjects = await getActiveProjects({ payload: { currentPage: 1 } })
		const activeProject = await getProject({ payload: { projectId: project.id } })

		expect(activeProjects.items[0].status).toEqual(projectApprovedKey)
		expect(activeProject.status).toEqual(projectApprovedKey)
	})
	test('Correctly displays accepted projects', async () => {
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

		const acceptedProjects = await getActiveProjects({ payload: { currentPage: 1 } })
		const acceptedProject = await getProject({ payload: { projectId: project.id } })

		expect(acceptedProjects.items[0].status).toEqual(projectAcceptedKey)
		expect(acceptedProject.status).toEqual(projectAcceptedKey)
	})
	test('Correctly displays pending deliveries (no status change)', async () => {
		const deliveryPayload = deliveryDareMock(project.id)

		const deliveryInit = await deliveryDareInit({
			userId: mockUserId,
			payload: deliveryPayload,
		})
		let activeProjects = await getActiveProjects({ payload: { currentPage: 1 } })
		let activeProject = await getProject({ payload: { projectId: project.id } })
		expect(activeProjects.items[0].status).toEqual(projectDeliveryInitKey)
		expect(activeProject.status).toEqual(projectDeliveryInitKey)

		const { deliverySortKey } = deliveryInit

		const deliveryFinishPayload = {
			projectId: project.id,
			deliverySortKey,
		}

		await deliveryDare({
			userId: mockUserId,
			payload: deliveryFinishPayload,
		})

		activeProjects = await getActiveProjects({ payload: { currentPage: 1 } })
		activeProject = await getProject({ payload: { projectId: project.id } })

		expect(activeProjects.items[0].status).toEqual(projectDeliveryPendingKey)
		expect(activeProject.status).toEqual(projectDeliveryPendingKey)
	})
	test('Correctly displays rejected deliveries (again no change)', async () => {
		await reviewDelivery({ payload: { projectId: project.id, audit: projectDeliveryRejectedKey, message: 'asdsad' } })

		const activeProjects = await getActiveProjects({ payload: { currentPage: 1 } })
		const activeProject = await getProject({ payload: { projectId: project.id } })

		expect(activeProjects.items[0].status).toEqual(projectDeliveryInitKey)
		expect(activeProject.status).toEqual(projectDeliveryInitKey)
	})
	test('Correctly displays approved deliveries', async () => {
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

		await reviewDelivery({ payload: { projectId: project.id, audit: projectDeliveredKey } })

		const deliveredProjects = await getActiveProjects({ payload: { currentPage: 1 } })
		const deliveredProject = await getProject({ payload: { projectId: project.id } })

		expect(deliveredProjects.items[0].status).toEqual(projectDeliveredKey)
		expect(deliveredProject.status).toEqual(projectDeliveredKey)
	})
})
