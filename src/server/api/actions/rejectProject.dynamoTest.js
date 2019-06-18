import { apiFn } from 'root/src/server/api'

import { GET_PROJECT, GET_ACTIVE_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectAllStreamersRejectedKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'
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

		await addOAuthToken({
			payload: oAuthDetails,
			userId: mockUserId,
		})

		const oAuthDetails2 = {
			tokenId: 'twitch',
			id: project.assignees[1].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails2,
			userId: `${mockUserId}2`,
		})

		await rejectProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				message: 'asdasdas',
			},
		})
		
		const event = {
			endpointId: GET_PROJECT,
			payload: {
				projectId: project.id,
			},
		}

		const res1 = await apiFn(event)
		expect(res1.body.status).toBe(projectApprovedKey)

		await rejectProject({
			userId: `${mockUserId}2`,
			payload: {
				projectId: project.id,
				message: 'asdasdas',
			},
		})

		const res2 = await apiFn(event)

		expect(res2.body.status).toBe(projectAllStreamersRejectedKey)


		const event3 = {
			endpointId: GET_ACTIVE_PROJECTS,
			payload: { currentPage: 1 },
			// authentication: mockUserId,
		}
		const res3 = await apiFn(event3)
		expect(res3.body.items.length).toBe(0)
	})
})
