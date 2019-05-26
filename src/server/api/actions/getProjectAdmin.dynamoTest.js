import { apiFn } from 'root/src/server/api'
import { GET_PROJECT_ADMIN } from 'root/src/shared/descriptions/endpoints/endpointIds'

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

describe('getProjectAdmin', () => {
	test('gets single project delivery pending with video', async () => {
		const newProjectPayload = createProjectPayload()
		const newProject = await createProject({
			userId: mockUserId,
			payload: newProjectPayload,
		})


		await auditProject({
			userId: mockUserId,
			payload: {
				projectId: newProject.id,
				audit: projectApprovedKey,
			},
		})

		const oAuthDetails = {
			tokenId: 'twitch',
			id: newProject.assignees[0].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails,
			userId: mockUserId,
		})

		await acceptProject({
			userId: mockUserId,
			payload: {
				projectId: newProject.id,
				assigneeId: `twitch|${newProject.assignees[0].platformId}`,
				amountRequested: 1000,
			},
		})

		const deliveryPayload = deliveryDareMock(newProject.id)

		const deliveryInit = await deliveryDareInit({
			userId: mockUserId,
			payload: deliveryPayload,
		})

		const { deliverySortKey } = deliveryInit

		const deliveryFinishPayload = {
			projectId: newProject.id,
			deliverySortKey,
		}

		await deliveryDare({
			userId: mockUserId,
			payload: deliveryFinishPayload,
		})

		const event = {
			endpointId: GET_PROJECT_ADMIN,
			payload: { projectId: newProject.id },
			authentication: mockUserId,
		}
		const res = await apiFn(event)

		expect(res.body.deliveries.length).toEqual(1)
	})
})
