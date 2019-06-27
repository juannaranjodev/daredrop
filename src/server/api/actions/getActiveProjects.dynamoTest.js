import { map, range, reverse, prop } from 'ramda'

import { apiFn } from 'root/src/server/api'

import { GET_ACTIVE_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import contextMock, { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import incrementDateCreatedInDb from 'root/src/testUtil/incrementDateCreatedInDb'
import expectOmitDate from 'root/src/testUtil/expectOmitDate'

describe('getActiveProjects', () => {
	test('Successfully get active projects', async () => {
		const projectArr = await Promise.all(
			map(
				() => createProject({
					userId: 'user-differentuserid',
					payload: createProjectPayload(),
				}),
				range(1, 10),
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

		await incrementDateCreatedInDb(map(prop('id'), projectArr))

		const approvedProjectArr = reverse(auditProjectArr)

		const event = {
			endpointId: GET_ACTIVE_PROJECTS,
			payload: { currentPage: 1 },
			// authentication: mockUserId,
		}

		const res = await apiFn(event, contextMock)

		expect(res.body.items.length).toEqual(8)
		expectOmitDate(res.body.items[0], approvedProjectArr[0])
		expectOmitDate(res.body.items[1], approvedProjectArr[1])
		expectOmitDate(res.body.items[2], approvedProjectArr[2])
		expectOmitDate(res.body.items[3], approvedProjectArr[3])
		expect(res.body.allPage).toEqual(2)

		const event0 = {
			endpointId: GET_ACTIVE_PROJECTS,
			payload: { currentPage: 1, filter: [{ param: 'game', value: '138585' }, { param: 'assignee|twitch', value: '19571641' }] },
			// authentication: mockUserId,
		}
		const res0 = await apiFn(event0, contextMock)

		expect(res0.body.items.length).toEqual(8)
		const event1 = {
			endpointId: GET_ACTIVE_PROJECTS,
			payload: { currentPage: 1, filter: [{ param: 'game', value: '1385851' }, { param: 'assignee|twitch', value: '19571641' }] },
			// authentication: mockUserId,
		}
		const res1 = await apiFn(event1, contextMock)
		expect(res1.body.items.length).toEqual(0)
	})
})
