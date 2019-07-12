import { map, range } from 'ramda'

import wait from 'root/src/testUtil/wait'

import { apiFn } from 'root/src/server/api'

import { GET_FAVORITES_LIST } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import contextMock, { mockUserId } from 'root/src/server/api/mocks/contextMock'
import auditFavorites from 'root/src/server/api/actions/auditFavorites'
import auditProject from 'root/src/server/api/actions/auditProject'
import { projectApprovedKey } from 'root/src/shared/descriptions/apiLenses'

describe('getListOfFavorites', () => {
	test('Successfully get list of favorites', async () => {
		// create projects
		const projectArr = await Promise.all(
			map(
				() => createProject({
					userId: 'user-differentuserid',
					payload: createProjectPayload(),
				}),
				range(1, 5),
			),
		)
		// approve all the projects
		await Promise.all(
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
		// add to favorites
		await Promise.all(
			map(
				project => auditFavorites({
					userId: mockUserId,
					payload: {
						projectId: project.id,
					},
				}),
				projectArr,
			),
		)
		// So this kinda sucks, but there is no way to ConsistenRead on a GSI.
		// This test will fail because of a race condition occasionally. Should
		// figure out a better solution to this at some point...maybe a retry?
		await wait(750)
		const event = {
			endpointId: GET_FAVORITES_LIST,
			payload: { currentPage: 1 },
			authentication: mockUserId,
		}
		const res = await apiFn(event, contextMock)

		expect(res.body.items.length).toEqual(4)
		expect(res.body.items[0].sk).toEqual(projectArr[0].sk)
		expect(res.body.items[1].sk).toEqual(projectArr[1].sk)
		expect(res.body.items[2].sk).toEqual(projectArr[2].sk)
		expect(res.body.items[3].sk).toEqual(projectArr[3].sk)
	})
})
