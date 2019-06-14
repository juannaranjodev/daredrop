import { head, not, gt, length, map, filter, propEq, prop, compose, split, last, unnest } from 'ramda'
import { extension, lookup } from 'mime-types'
import uuid from 'uuid/v4'
import s3 from 'root/src/server/api/s3Client'


// configurate
import { videoBucket } from 'root/cfOutput'
import { s3BaseURL } from 'root/src/shared/constants/s3Constants'

// lenses
import { getPayloadLenses } from 'root/src/shared/descriptions/getEndpointDesc'

// keys
import { DELIVERY_DARE_INIT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { projectDeliveryPendingKey } from 'root/src/shared/descriptions/apiLenses'

// utils
import getTimestamp from 'root/src/shared/util/getTimestamp'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'
import { authorizationError, actionForbiddenError } from 'root/src/server/api/errors'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import setDeliveryStatus from 'root/src/server/api/actionUtil/setDeliveryStatus'

// query utils
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import dynamoQueryProjectDeliveries from 'root/src/server/api/actionUtil/dynamoQueryProjectDeliveries'

// serializers
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import { videoSubmittedTitle } from 'root/src/server/email/util/emailTitles'
import videoSubmittedEmail from 'root/src/server/email/templates/videoSubmitted'
import sendEmail from 'root/src/server/email/actions/sendEmail'

const payloadLenses = getPayloadLenses(DELIVERY_DARE_INIT)

const { viewVideoURL, viewTimeStamp, viewVideoName, viewProjectId } = payloadLenses

const verification = async (projectId, userId) => {
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
		const filterByUploader = filter(propEq('uploader', userId))
		const userDeliveries = filterByUploader(projectDeliveries)
		deliverySortKey = prop('sk', head(userDeliveries))
	}

	return deliverySortKey
}


const updateAssignessInformation = async (userTokensInProject, projectId, project, projectDdb) => {
	const userTokensStr = map(compose(last, split('-')), userTokensInProject)

	const userAssigneeArrNested = await Promise.all(map(
		token => dynamoQueryProjectAssignee(projectId, token),
		userTokensStr,
	))

	const userAssigneeArr = unnest(unnest(userAssigneeArrNested))

	const assigneesToWrite = map(assignee => ({
		PutRequest: {
			Item:
			{
				[PARTITION_KEY]: assignee[PARTITION_KEY],
				[SORT_KEY]: assignee[SORT_KEY],
				...assignee,
				deliveryVideo: projectDeliveryPendingKey,
				modified: getTimestamp(),
			},
		},
	}), userAssigneeArr)
	const updateProjectParam = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					PutRequest: {
						Item: {
							[PARTITION_KEY]: prop('id', project),
							[SORT_KEY]: head(projectDdb)[SORT_KEY],
							status: project.status,
							...setDeliveryStatus(project, projectDeliveryPendingKey, userTokensStr),
						},
					},
				},
				...assigneesToWrite,
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

	let deliverySortKey = await verification(projectId, userId)

	const [projectDdb, assigneesDdb] = await dynamoQueryProject(null, projectId)

	const project = projectSerializer([
		...projectDdb,
		...assigneesDdb,
	])

	const userTokensInProject = userTokensInProjectSelector(userTokens, project)

	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	updateAssignessInformation(userTokensInProject, projectId, project, projectDdb)

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

	try {
		const email = await getUserEmail(userId)
		const emailData = {
			title: videoSubmittedTitle,
			dareTitle: prop('title', project),
			recipients: [email],
		}
		sendEmail(emailData, videoSubmittedEmail)
	} catch (err) {
		console.log('ses error')
	}
	return { url, deliverySortKey }
}
