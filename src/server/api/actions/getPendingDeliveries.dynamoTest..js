import { map, range, reverse } from 'ramda'

import wait from 'root/src/testUtil/wait'

import { apiFn } from 'root/src/server/api'

import { GET_ACTIVE_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'

import contextMock, { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'

describe('getPendingDeliveries', () => {
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

		const auditProj = project => auditProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				audit: projectApprovedKey,
			},
		})

		// this solution sucks but i don't have idea how to prevent
		// firing all at once and having the same approval date

		const p0 = await auditProj(projectArr[0])
		await wait(700)
		const p1 = await auditProj(projectArr[1])
		await wait(700)
		const p2 = await auditProj(projectArr[2])
		await wait(700)
		const p3 = await auditProj(projectArr[3])
		await wait(700)
		const p4 = await auditProj(projectArr[4])
		await wait(700)
		const p5 = await auditProj(projectArr[5])
		await wait(700)
		const p6 = await auditProj(projectArr[6])
		await wait(700)
		const p7 = await auditProj(projectArr[7])
		await wait(700)
		const p8 = await auditProj(projectArr[8])


		const approvedProjectArr = reverse([p0, p1, p2, p3, p4, p5, p6, p7, p8])

		const event = {
			endpointId: GET_ACTIVE_PROJECTS,
			payload: { currentPage: 1 },
			// authentication: mockUserId,
		}
		const res = await apiFn(event, contextMock)


		expect(res.body.items.length).toEqual(8)
		expect(res.body.items[1].sk).toEqual(approvedProjectArr[1].sk)
		expect(res.body.items[2]).toEqual(approvedProjectArr[2])
		expect(res.body.allPage).toEqual(2)
	})
})
