import wait from 'root/src/testUtil/wait'

import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'
import { map , range } from 'ramda'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import getFilteredProjectIds from 'root/src/server/api/actionUtil/getFilteredProjectIds'

describe('getFilteredProjectIds', () => {
	test('Successfully get filtered project Ids', async () => {
		// this won't work with actual implementation. there is a need to change acceptProject.js
		// and getAcceptProject.js
		const projectArr = await Promise.all(
			map(
				() => createProject({
					userId: 'user-differentuserid',
					payload: createProjectPayload(),
				}),
				range(1, 10),
			),
		)
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

		// So this kinda sucks, but there is no way to ConsistenRead on a GSI.
		// This test will fail because of a race condition occasionally. Should
		// figure out a better solution to this at some point...maybe a retry?
		await wait(750)
		const filters0 = [{ param: 'game', value: '138585' }, {param:"assignee|twitch",value:"19571641"}]
		const res0 = await getFilteredProjectIds(filters0)
		expect(res0.length).toBe(9)

		const filters1 = [{ param: 'game', value: '1385815' }, {param:"assignee|twitch",value:"19571641"}]
		const res1 = await getFilteredProjectIds(filters1)
		expect(res1.length).toBe(0)
	})
})
