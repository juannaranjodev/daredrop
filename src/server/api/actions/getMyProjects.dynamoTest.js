import { assoc, map, range } from 'ramda'
import { apiFn } from 'root/src/server/api'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import auditProject from 'root/src/server/api/actions/auditProject'
import createProject from 'root/src/server/api/actions/createProject'
import deliveryDare from 'root/src/server/api/actions/deliveryDare'
import deliveryDareInit from 'root/src/server/api/actions/deliveryDareInit'
import rejectProject from 'root/src/server/api/actions/rejectProject'
import reviewDelivery from 'root/src/server/api/actions/reviewDelivery'
import { projectApprovedKey, projectDeliveredKey } from 'root/src/server/api/lenses'
import contextMock, { mockUserId } from 'root/src/server/api/mocks/contextMock'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'
import { GET_MY_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import wait from 'root/src/testUtil/wait'
import auditFavorites from 'root/src/server/api/actions/auditFavorites'
import pledgeProject from 'root/src/server/api/actions/pledgeProject'
import createPledgeProjectPayload from 'root/src/server/api/mocks/createPledgeProjectPayload'

describe('getMyProjects', () => {
	let projectArr
	let otherProjectArr
	test('Successfully get my projects', async () => {
		otherProjectArr = await Promise.all(
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

	test('gets only dares for me', async () => {
		const projectPayload = createProjectPayload()
		const modifiedProjectPayload = assoc('assignees', [{ id: 419843502 }], projectPayload)
		await createProject({
			userId: mockUserId,
			payload: modifiedProjectPayload,
		})
		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: {
				currentPage: 1,
				filter: [{
					param: 'assignee|twitch',
					value: projectArr[0].assignees[0].platformId,
				}],
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event, contextMock)
		expect(res.body.items.length).toEqual(2)
	})

	test('gets only delivered dares', async () => {
		await acceptProject({
			userId: mockUserId,
			payload: {
				projectId: projectArr[1].id,
				assigneeId: `twitch|${projectArr[1].assignees[0].platformId}`,
				amountRequested: 1000,
			},
		})

		const deliveryPayload = deliveryDareMock(projectArr[1].id)
		const deliveryInit = await deliveryDareInit({
			userId: mockUserId,
			payload: deliveryPayload,
		})

		const { deliverySortKey } = deliveryInit

		const deliveryFinishPayload = {
			projectId: projectArr[1].id,
			deliverySortKey,
		}
		await deliveryDare({
			userId: mockUserId,
			payload: deliveryFinishPayload,
		})
		await reviewDelivery({
			userId: mockUserId,
			payload: {
				projectId: projectArr[1].id,
				audit: projectDeliveredKey,
			},
		})
		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: {
				currentPage: 1,
				filter: [{
					param: 'projectStatus',
					value: projectDeliveredKey,
				}],
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event, contextMock)
		expect(res.body.items.length).toEqual(1)
	})

	test('gets only my favorites', async () => {
		await Promise.all(map(i => auditFavorites({
			userId: mockUserId,
			payload: {
				projectId: projectArr[i].id,
			},
		}), [0, 2]))

		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: {
				currentPage: 1,
				filter: [{
					param: 'projectRecord',
					value: 'favorites',
				}],
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event, contextMock)
		expect(res.body.items.length).toEqual(2)
	})

	test('gets only my pledges', async () => {
		await Promise.all(map(i => pledgeProject({
			userId: mockUserId,
			payload: createPledgeProjectPayload(otherProjectArr[i].id),
		}), range(0, 1)))

		const event = {
			endpointId: GET_MY_PROJECTS,
			payload: {
				currentPage: 1,
				filter: [{
					param: 'projectRecord',
					value: 'pledges',
				}],
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event, contextMock)
		expect(res.body.items.length).toEqual(5)
	})
})
