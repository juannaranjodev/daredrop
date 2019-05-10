import { DELIVERY_DARE, DELIVERY_DARE_INIT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { apiFn } from 'root/src/server/api'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import createProject from 'root/src/server/api/actions/createProject'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { projectApprovedKey, projectDeliveryPendingKey } from 'root/src/server/api/lenses'
import auditProject from 'root/src/server/api/actions/auditProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'
import { insertVideoMock } from 'root/src/server/api/mocks/youtubeMock'

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
})
