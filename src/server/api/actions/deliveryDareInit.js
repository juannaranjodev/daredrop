import { head, not, gt, length, map, filter, propEq, prop, compose, split, last, unnest, omit } from 'ramda'
import { extension, lookup } from 'mime-types'
import uuid from 'uuid/v4'
import s3 from 'root/src/server/api/s3Client'


// configurate
import { videoBucket } from 'root/cfOutput'
import { s3BaseURL } from 'root/src/shared/constants/s3Constants'

// lenses
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'

// keys
import { DELIVERY_DARE_INIT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { projectDeliveryPendingKey, projectDeliveryInitKey } from 'root/src/server/api/lenses'

// utils
import getTimestamp from 'root/src/shared/util/getTimestamp'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'
import { authorizationError, actionForbiddenError } from 'root/src/server/api/errors'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'

// query utils
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import dynamoQueryProjectDeliveries from 'root/src/server/api/actionUtil/dynamoQueryProjectDeliveries'

// serializers
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

const payloadLenses = getPayloadLenses(DELIVERY_DARE_INIT)

const { viewVideoURL, viewTimeStamp, viewVideoName, viewProjectId } = payloadLenses

const verification = async (projectId) => {
	const projectDeliveries = await dynamoQueryProjectDeliveries(projectId)
	const approvedProjectDeliveries = await dynamoQueryProjectDeliveries(projectId, true)
	const filterUploaded = filter(propEq('s3Uploaded', true))
	let deliverySortKey

	if (gt(length(approvedProjectDeliveries), 0)) {
		throw actionForbiddenError('This project have already dare approved')
	}

	if (gt(length(projectDeliveries), 0)) {
		const uploadedProjectDeliveries = filterUploaded(projectDeliveries)

		if (gt(length(uploadedProjectDeliveries), 0)) {
			throw actionForbiddenError('This project have already dare submitted')
		}
		deliverySortKey = prop('sk', head(projectDeliveries))
	}

	return deliverySortKey
}


const updateProject = async (project, projectDdb) => {
	const updateProjectParam = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					PutRequest: {
						Item: {
							[PARTITION_KEY]: prop('id', project),
							[SORT_KEY]: head(projectDdb)[SORT_KEY],
							...omit(['status', 'id'], project),
							status: projectDeliveryInitKey,
						},
					},
				},
			],
		},
	}
	await documentClient.batchWrite(updateProjectParam).promise()
}

export default async ({ payload, userId }) => {
	const userTokens = await dynamoQueryOAuth(userId)
	const videoName = viewVideoName(payload)
	const videoURL = viewVideoURL(payload)
	const projectId = viewProjectId(payload)
	const timeStamp = viewTimeStamp(payload)

	let deliverySortKey = await verification(projectId)

	const [projectDdb, assigneesDdb] = await dynamoQueryProject(null, projectId)

	const project = projectSerializer([
		...projectDdb,
		...assigneesDdb,
	])

	const userTokensInProject = userTokensInProjectSelector(userTokens, project)

	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	updateProject(project, projectDdb)
	// action
	const fileName = `${uuid()}.${extension(lookup(videoName))}`

	const params = {
		Bucket: videoBucket,
		Key: fileName,
		Expires: 3600,
	}
	const url = s3.getSignedUrl('putObject', params)

	if (!deliverySortKey) {
		deliverySortKey = await generateUniqueSortKey(projectId, `project|${projectDeliveryPendingKey}`, 1, 10)
	}

	const dareDeliveryObject = {
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: deliverySortKey,
		videoURL,
		timeStamp,
		fileName,
		created: getTimestamp(),
		s3ObjectURL: `${s3BaseURL}${videoBucket}/${fileName}`,
		s3Uploaded: false,
		uploader: userId,
	}
	const deliveryParams = {
		TableName: TABLE_NAME,
		Item: dareDeliveryObject,
	}
	await documentClient.put(deliveryParams).promise()

	return { projectId, url, deliverySortKey }
}
