import { map, range } from 'ramda'
import { apiFn } from 'root/src/server/api'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import auditProject from 'root/src/server/api/actions/auditProject'
import { projectApprovedKey } from 'root/src/shared/descriptions/apiLenses'
import createProject from 'root/src/server/api/actions/createProject'
import rejectProject from 'root/src/server/api/actions/rejectProject'
import contextMock, { mockUserId } from 'root/src/server/api/mocks/contextMock'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import { GET_MY_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import wait from 'root/src/testUtil/wait'

describe('getMyProjects', () => {
	let projectArr
	test('Successfully get my projects', async () => {
		await Promise.all(
			map(
				() => createProject({
					userId: 'user-differentuserid',
					payload: createProjectPayload(),
				}),
				range(1, 5),
			),
		)
		projectArr = await Promise.all(
			map(
				() => createProject({
					userId: mockUserId,
					payload: createProjectPayload(),
				}),
				range(1, 5),
			),
		)
		const oAuthDetails = {
			tokenId: 'twitch',
			id: projectArr[0].assignees[0].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails,
			userId: mockUserId,
		})
		// So this kinda sucks, but there is no way to ConsistenRead on a GSI.
		// This test will fail because of a race condition occasionally. Should
		// figure out a better solution to this at some point...maybe a retry?
		await wait(750)
		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: { currentPage: 1 },
			authentication: mockUserId,
		}
		const res = await apiFn(event, contextMock)

		expect(res.body.items.length).toEqual(4)
		expect(res.body.items[0].sk).toEqual(projectArr[0].sk)
		expect(res.body.items[1].sk).toEqual(projectArr[1].sk)
	})

	test('gets correct amount of assignees displayed after one rejects', async () => {
		await Promise.all(
			map(
				i => auditProject({
					userId: mockUserId,
					payload: {
						projectId: projectArr[i].id,
						audit: projectApprovedKey,
					},
				}),
				range(0, 4),
			),
		)

		await rejectProject({
			userId: mockUserId,
			payload: {
				projectId: projectArr[0].id,
				assigneeId: `twitch|${projectArr[0].assignees[0].platformId}`,
			},
		})

		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: { currentPage: 1 },
			authentication: mockUserId,
		}
		const res = await apiFn(event, contextMock)

		expect(res.body.items[0].assignees.length).toEqual(2)
	})
})
