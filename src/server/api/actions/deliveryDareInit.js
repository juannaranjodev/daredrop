import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { DELIVERY_DARE_INIT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import s3 from 'root/src/server/api/s3Client'
import uuid from 'uuid/v4'
import { extension, lookup } from 'mime-types'
import { videoBucket } from 'root/cfOutput'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { projectDeliveryPendingKey } from 'root/src/server/api/lenses'
import randomNumber from 'root/src/shared/util/randomNumber'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import { s3BaseURL } from 'root/src/shared/constants/s3Constants'

const payloadLenses = getPayloadLenses(DELIVERY_DARE_INIT)

const prnt = msg => console.log(JSON.stringify(msg, null, 2))

const { viewVideoURL, viewTimeStamp, viewVideoName, viewProjectId } = payloadLenses

export default async ({ payload, userId }) => {
	//
	// user verification needed here
	//

	//
	// get user tokens here
	//

	const videoName = viewVideoName(payload)
	const videoURL = viewVideoURL(payload)
	const projectId = viewProjectId(payload)
	const timeStamp = viewTimeStamp(payload)

	const fileName = `${uuid()}.${extension(lookup(videoName))}`

	const params = {
		Bucket: videoBucket,
		Key: fileName,
		Expires: 3000,
	}
	const url = s3.getSignedUrl('putObject', params)

	const deliverySortKey = `project|${projectDeliveryPendingKey}|${randomNumber(1, 10)}`

	const dareDeliveryObject = {
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: deliverySortKey,
		// userTokensArr
		videoURL,
		timeStamp,
		fileName,
		created: getTimestamp(),
		s3ObjectURL: `${s3BaseURL}${videoBucket}/${fileName}`,
		s3Uploaded: false,
		youTubeUploaded: false,
	}

	const deliveryParams = {
		TableName: TABLE_NAME,
		Item: dareDeliveryObject,
	}

	await documentClient.put(deliveryParams).promise()
	return { url, deliverySortKey }
}
