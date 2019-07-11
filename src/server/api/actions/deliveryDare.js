import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { DELIVERY_DARE } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp, projectApprovedKey, projectDeliveryPendingKey } from 'root/src/server/api/lenses'
import { prop, head } from 'ramda'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import { videoSubmittedTitle } from 'root/src/server/email/util/emailTitles'
import videoSubmittedEmail from 'root/src/server/email/templates/videoSubmitted'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import streamVideoS3toYT from 'root/src/server/api/actionUtil/streamVideoS3toYT'

const payloadLenses = getPayloadLenses(DELIVERY_DARE)
const { viewDeliverySortKey, viewProjectId } = payloadLenses

export default async ({ payload, userId }) => {
	const deliverySortKey = viewDeliverySortKey(payload)
	const projectId = viewProjectId(payload)
	const deliveryQueryParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :projectId and ${SORT_KEY} = :deliveryDareSk`,
		ExpressionAttributeValues: {
			':projectId': projectId,
			':deliveryDareSk': deliverySortKey,
		},
	}

	const deliveryProjectDdb = await documentClient.query(deliveryQueryParams).promise()
	const [deliveryProject] = dynamoItemsProp(deliveryProjectDdb)
	const [projectDdb, assigneesDdb] = await dynamoQueryProject(null, projectId, projectApprovedKey)

	const project = projectSerializer([
		...projectDdb,
		...assigneesDdb,
	])
	const s3DataWrite = {
		PutRequest: {
			Item: {
				[PARTITION_KEY]: deliveryProject[PARTITION_KEY],
				[SORT_KEY]: deliveryProject[SORT_KEY],
				...deliveryProject,
				s3Uploaded: true,
			},
		},
	}
	const projectDataToWrite = {
		PutRequest: {
			Item: {
				[PARTITION_KEY]: prop('id', project),
				[SORT_KEY]: head(projectDdb)[SORT_KEY],
				...head(projectDdb),
				status: projectDeliveryPendingKey,
			},
		},
	}
	const writeParams = {
		RequestItems: {
			[TABLE_NAME]: [s3DataWrite, projectDataToWrite],
		},
	}
	await documentClient.batchWrite(writeParams).promise()

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

	try {
		const youtubeUpload = await streamVideoS3toYT(project, deliveryProject, payload)

		return { projectId, youtubeUpload }
	} catch ({ message }) {
		return {
			projectId,
			message,
		}
	}
}
