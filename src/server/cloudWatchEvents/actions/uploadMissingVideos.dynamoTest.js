/* eslint-disable comma-spacing */
/* eslint-disable max-len */
import { map, omit, prop, range } from 'ramda'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import auditProject from 'root/src/server/api/actions/auditProject'
import createProject from 'root/src/server/api/actions/createProject'
import deliveryDare from 'root/src/server/api/actions/deliveryDare'
import deliveryDareInit from 'root/src/server/api/actions/deliveryDareInit'
import reviewDelivery from 'root/src/server/api/actions/reviewDelivery'
import dynamoQueryShardedItems from 'root/src/server/api/actionUtil/dynamoQueryShardedItems'
import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'
import { projectApprovedKey, projectDeliveredKey, projectDeliveryPendingKey } from 'root/src/shared/descriptions/apiLenses'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import deliveryDareMock from 'root/src/server/api/mocks/deliveryDare'
import { apiFn } from 'root/src/server/cloudWatchEvents'
import { UPLOAD_MISSING_VIDEOS } from 'root/src/shared/descriptions/endpoints/endpointIds'

describe('uploadMissingVideos', async () => {
	let projectArr
	test('succesfuly uploaded missing videos to youtube', async () => {
		projectArr = await Promise.all(map(i => createProject({
			userId: 'user-differentuserid',
			payload: createProjectPayload(),
		}), range(0, 2)))

		await Promise.all(map(project => auditProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				audit: projectApprovedKey,
			},
		}), projectArr))

		const oAuthDetails = {
			tokenId: 'twitch',
			id: projectArr[0].assignees[0].platformId,
		}

		await addOAuthToken({
			payload: oAuthDetails,
			userId: mockUserId,
		})

		await Promise.all(map(project => acceptProject({
			userId: mockUserId,
			payload: {
				projectId: project.id,
				assigneeId: `twitch|${project.assignees[0].platformId}`,
				amountRequested: 1000,
			},
		}), projectArr))

		const deliveryPayloads = map(project => deliveryDareMock(project.id), projectArr)

		const deliveryInits = await Promise.all(map(i => deliveryDareInit({
			userId: mockUserId,
			payload: deliveryPayloads[i],
		}), range(0, 2)))

		const deliverySortKeys = map(prop('deliverySortKey'), deliveryInits)

		const deliveryFinishPayloads = map(i => ({
			projectId: projectArr[i].id,
			deliverySortKey: deliverySortKeys[i],
		}), range(0, 2))

		await Promise.all(map(deliveryPayload => deliveryDare({
			userId: mockUserId,
			payload: deliveryPayload,
		}), deliveryFinishPayloads))

		await reviewDelivery({
			payload: {
				projectId: projectArr[0].id,
				audit: projectDeliveredKey,
			},
		})

		const deliveredProjects = await dynamoQueryShardedItems(`project|${projectDeliveredKey}`)
		const deliveryPendingProjects = await dynamoQueryShardedItems(`project|${projectDeliveryPendingKey}`)

		const deliveries = [...deliveredProjects, ...deliveryPendingProjects]

		const dbWrite = {
			RequestItems: {
				[TABLE_NAME]: map(delivery => ({
					PutRequest: { Item: omit(['youTubeURL'], delivery) },
				}), deliveries),
			},
		}

		await documentClient.batchWrite(dbWrite).promise()

		const event = {
			endpointId: UPLOAD_MISSING_VIDEOS,
			payload: {},
		}

		const res = await apiFn(event)
		expect(res.body.length).toEqual(2)
		expect(res.statusCode).toEqual(200)
	})
})
