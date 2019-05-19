import { apiFn } from 'root/src/server/api'

import { AUDIT_FAVORITES } from 'root/src/shared/descriptions/endpoints/endpointIds'

import createProject from 'root/src/server/api/actions/createProject'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { internet } from 'faker'
import { addIndex, map, range } from 'ramda'

describe('addToFavorites', () => {
	let newProject
	test('successfully added to your favorites', async () => {
		newProject = await createProject({
			userId: internet.username,
			payload: { ...createProjectPayload(), status: projectApprovedKey },
		})

		const event = {
			endpointId: AUDIT_FAVORITES,
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
	test('successfully removed from favorites', async () => {
		const event = {
			endpointId: AUDIT_FAVORITES,
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
				favoritesAmount: newProject.favoritesAmount,
				myFavorites: 0,
			},
		})
	})
	test('favorites test with multiple users', async () => {
		const mapIndexed = addIndex(map)
		const events = mapIndexed((obj, idx) => ({
			endpointId: AUDIT_FAVORITES,
			payload: {
				projectId: newProject.id,
			},
			authentication: `${mockUserId}${idx}`,
		}), range(0, 5))
		// can't use Promise.All because it fires all the events at
		//  the same time and favorites amount doesn't works with that
		await apiFn(events[0])
		await apiFn(events[1])
		await apiFn(events[2])
		await apiFn(events[3])
		const res4 = await apiFn(events[4])
		expect(res4.body.favoritesAmount).toEqual(5)
		await apiFn(events[0])
		const res5 = await apiFn(events[1])
		expect(res5.body.favoritesAmount).toEqual(3)
	})
})
