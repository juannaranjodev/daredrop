import { apiFn } from 'root/src/server/api'
import moment from 'moment'
import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'

import createProject from 'root/src/server/api/actions/createProject'
import auditFavorites from 'root/src/server/api/actions/auditFavorites'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'

describe('getProject', () => {
	let newProject
	test('gets single project with my pledge amount appended', async () => {
		const newProjectPayload = createProjectPayload()
		newProject = await createProject({
			userId: mockUserId,
			payload: newProjectPayload,
		})
		await auditFavorites({
			userId: mockUserId,
			payload: {
				projectId: newProject.id,
			},
		})
		const event = {
			endpointId: GET_PROJECT,
			payload: { projectId: newProject.id },
			authentication: mockUserId,
		}
		const res = await apiFn(event)

		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newProject,
				myPledge: newProjectPayload.pledgeAmount,
				favoritesAmount: 1,
				myFavorites: 1,
			},
		})
	})

	test('values are displayed properly for unauthorized user', async () => {
		const event = {
			endpointId: GET_PROJECT,
			payload: { projectId: newProject.id },
		}
		const res = await apiFn(event)
		expect(res.body.myFavorites).toBe(undefined)
		expect(res.body.myPledge).toBe(undefined)
	})

	test('time diff should be 0 days', async () => {
		const newProjectPayload = createProjectPayload()
		// eslint-disable-next-line no-shadow
		const newProject = await createProject({
			userId: mockUserId,
			payload: newProjectPayload,
		})
		const event = {
			endpointId: GET_PROJECT,
			payload: { projectId: newProject.id },
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		const { created } = res.body
		const diff = moment().diff(created, 'days')
		expect(diff).toEqual(0)
	})
})
