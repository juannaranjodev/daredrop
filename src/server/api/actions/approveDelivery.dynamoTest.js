import { apiFn } from 'root/src/server/api'

import { APPROVE_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectDeliveredKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'

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

		const event = {
			userId: mockUserId,
			endpointId: APPROVE_DELIVERY,
			payload: {
				projectId: project.id,
			},
		}

		const res = await apiFn(event)

		expect(res.body.status).toEqual(projectDeliveredKey)
	})
})
