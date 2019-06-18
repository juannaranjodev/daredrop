import { DELIVERY_DARE, DELIVERY_DARE_INIT, GET_PENDING_DELIVERIES } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { apiFn } from 'root/src/server/api'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectDeliveryPendingKey, projectDeliveryRejectedKey, projectDeliveredKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'
import { insertVideoMock } from 'root/src/server/api/mocks/youtubeMock'
import incrementDateCreatedInDb from 'root/src/testUtil/incrementDateCreatedInDb'
import reviewDelivery from 'root/src/server/api/actions/reviewDelivery'

describe('deliveryDare flow', async () => {
	let project
	let deliverySortKey

	test('inits dare delivery flow', async () => {
		project = await createProject({
			userId: 'user-differentuserid',
			payload: createProjectPayload(),
		})

		const oAuthDetails = {
			tokenId: 'twitch',
			id: project.assignees[0].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails,
			userId: mockUserId,
		})

		await auditProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				audit: projectApprovedKey,
			},
		})

		await acceptProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				assigneeId: `twitch|${project.assignees[0].platformId}`,
				amountRequested: 1000,
			},
		})

		const payload = deliveryDareMock(project.id)

		const event = {
			endpointId: DELIVERY_DARE_INIT,
			payload,
			authentication: mockUserId,
		}
		const res = await apiFn(event)

		// eslint-disable-next-line no-useless-escape
		const sortKeyRe = new RegExp(`project\|${projectDeliveryPendingKey}\|[1-9]|[10]`)
		expect(res.statusCode).toEqual(200)
		expect(res.body.url).toEqual('https://s3.aws.amazon.com/somepresignedUrl')
		expect(res.body.deliverySortKey).toMatch(sortKeyRe)
		// eslint-disable-next-line prefer-destructuring
		deliverySortKey = res.body.deliverySortKey
	})

	test('finishes whole flow', async () => {
		const payload = {
			projectId: project.id,
			deliverySortKey,
		}
		const event = {
			endpointId: DELIVERY_DARE,
			payload,
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		expect(res.body.youtubeUpload).toBe(insertVideoMock)
	})

	test('another user can\'t deliver to the same dare', async () => {
		const oAuthDetails = {
			tokenId: 'twitch',
			id: project.assignees[1].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails,
			userId: `${mockUserId}2`,
		})

		await acceptProject({
			userId: `${mockUserId}2`,
			payload: {
				projectId: project.id,
				assigneeId: `twitch|${project.assignees[1].platformId}`,
				amountRequested: 1000,
			},
		})

		const payload = deliveryDareMock(project.id)

		const event = {
			endpointId: DELIVERY_DARE_INIT,
			payload,
			authentication: `${mockUserId}2`,
		}
		const res = await apiFn(event)
		expect(res.statusCode).toEqual(403)
	})


	test("can't submit video again after succesful submission", async () => {
		const payload = deliveryDareMock(project.id)
		const event = {
			endpointId: DELIVERY_DARE_INIT,
			payload,
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		expect(res.statusCode).toEqual(403)
	})

	test('can submit video after rejection', async () => {
		await reviewDelivery({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				audit: projectDeliveryRejectedKey,
				message: 'asdasda',
			},
		})
		const payload = deliveryDareMock(project.id)
		const event = {
			endpointId: DELIVERY_DARE_INIT,
			payload,
			authentication: mockUserId,
		}
		const res = await apiFn(event)

		expect(res.statusCode).toEqual(200)
	})

	test("can't submit video after succesful review", async () => {
		await reviewDelivery({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				audit: projectDeliveredKey,
			},
		})
		const payload = deliveryDareMock(project.id)
		const event = {
			endpointId: DELIVERY_DARE_INIT,
			payload,
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		expect(res.statusCode).toEqual(403)
	})

	test('gets list of pending deliveries', async () => {
		const event = {
			endpointId: GET_PENDING_DELIVERIES,
			payload: { currentPage: 1 },
			authentication: mockUserId,
		}

		const project2 = await createProject({
			userId: 'user-differentuserid',
			payload: createProjectPayload(),
		})
		await auditProject({
			userId: mockUserId,
			payload: {
				projectId: project2.id,
				audit: projectApprovedKey,
			},
		})

		await acceptProject({
			userId: mockUserId,
			payload: {
				projectId: project2.id,
				assigneeId: `twitch|${project2.assignees[0].platformId}`,
				amountRequested: 1000,
			},
		})
		const deliveryPayload = deliveryDareMock(project2.id)

		const deliveryEvent = {
			endpointId: DELIVERY_DARE_INIT,
			payload: deliveryPayload,
			authentication: mockUserId,
		}
		await apiFn(deliveryEvent)
		await incrementDateCreatedInDb([project.id, project2.id])

		const res = await apiFn(event)

		expect(res.body.items.length).toEqual(1)
		expect(res.body.items[0].id).toEqual(project2.id)
	})
})
