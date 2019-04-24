import { map, range } from 'ramda'

import wait from 'root/src/testUtil/wait'

import { apiFn } from 'root/src/server/api'

import { GET_ACCEPTED_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import contextMock, { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'

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

		await acceptProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				assigneeId: `twitch|${project.assignees[0].platformId}`,
				amountRequested: 1000,
			},
		})

		// So this kinda sucks, but there is no way to ConsistenRead on a GSI.
		// This test will fail because of a race condition occasionally. Should
		// figure out a better solution to this at some point...maybe a retry?
		await wait(750)
		const event = {
			endpointId: GET_ACCEPTED_PROJECTS,
		}
		const res = await apiFn(event, contextMock)
		expect(res.status).toEqual(200)
		expect(res.body.items.length).toEqual(1)
	})
})