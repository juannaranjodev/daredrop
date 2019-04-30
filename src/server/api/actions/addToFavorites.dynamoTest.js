import { apiFn } from 'root/src/server/api'

import { ADD_TO_FAVORITES } from 'root/src/shared/descriptions/endpoints/endpointIds'

import createProject from 'root/src/server/api/actions/createProject'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { internet } from 'faker'

describe('addToFavorites', () => {
	test('successfully added to your favorites', async () => {
		const newProject = await createProject({
			userId: internet.username,
			payload: { ...createProjectPayload(), status: projectApprovedKey },
		})

		const event = {
			endpointId: ADD_TO_FAVORITES,
			payload: {
				projectId: newProject.id,
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event)

		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newProject,
				favoritesAmount: newProject.favoritesAmount + 1,
				myFavorites: 1,
			},
		})
	})
})
