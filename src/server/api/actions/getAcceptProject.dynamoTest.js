import { map, range } from 'ramda'
import wait from 'root/src/testUtil/wait'

import { apiFn } from 'root/src/server/api'

import { GET_ACCEPTED_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import contextMock, { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey } from 'root/src/shared/descriptions/apiLenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'

describe('getAcceptedProjects', () => {
	test('Successfully get accepted projects', async () => {
		const projectArr = await Promise.all(
			map(
				() => createProject({
					userId: 'user-differentuserid',
					payload: createProjectPayload(),
				}),
				range(1, 15),
			),
		)

		const authProjectArr = await Promise.all(
			map(
				project => {
					const oAuthDetails = {
						tokenId: 'twitch',
						id: project.assignees[0].platformId,
					}

					return addOAuthToken({
						payload: oAuthDetails,
						userId: mockUserId,
					})
				},
				projectArr,
			),
		)

		const auditProjectArr = await Promise.all(
			map(
				project => auditProject({
					userId: mockUserId,
					payload: {
						projectId: project.id,
						audit: projectApprovedKey,
					},
				}),
				projectArr,
			),
		)

		await Promise.all(
			map(
				project => acceptProject({
					userId: mockUserId,
					payload: {
						projectId: project.id,
						assigneeId: `twitch|${project.assignees[0].platformId}`,
						amountRequested: 1000,
					},
				}),
				projectArr,
			),
		)

		// So this kinda sucks, but there is no way to ConsistenRead on a GSI.
		// This test will fail because of a race condition occasionally. Should
		// figure out a better solution to this at some point...maybe a retry?
		await wait(1000)
		const event = {
			endpointId: GET_ACCEPTED_PROJECTS,
			payload: {
				currentPage: 1,
			},
		}

		const res = await apiFn(event, contextMock)

		expect(res.statusCode).toEqual(200)
		expect(res.body.items.length).toEqual(14)
	})
})
