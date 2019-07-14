import { apiFn } from 'root/src/server/api'

import { GET_PROJECT, GET_ACTIVE_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectAcceptedKey } from 'root/src/shared/descriptions/apiLenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import rejectProject from 'root/src/server/api/actions/rejectProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'

describe('getAcceptedProjects', () => {
	test('Successfully get accepted projects', async () => {
		const project = await createProject({
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

		const oAuthDetails2 = {
			tokenId: 'twitch',
			id: project.assignees[1].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails,
			userId: mockUserId,
		})

		await addOAuthToken({
			payload: oAuthDetails2,
			userId: `${mockUserId}2`,
		})

		await acceptProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				amountRequested: 1000,
			},
		})

		await rejectProject({
			userId: `${mockUserId}2`,
			payload: {
				projectId: project.id,
				amountRequested: 1000,
			},
		})

		const event = {
			endpointId: GET_PROJECT,
			payload: {
				projectId: project.id,
			},
		}
		const res = await apiFn(event)
		expect(res.body.status).toBe(projectAcceptedKey)
		const event2 = {
			endpointId: GET_ACTIVE_PROJECTS,
			payload: { currentPage: 1 },
			// authentication: mockUserId,
		}
		const res2 = await apiFn(event2)
		expect(res2.body.items.length).toBe(1)
	})
})
