import { head, omit } from 'ramda'

import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'

import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import { generalError } from 'root/src/server/api/errors'
import dynamoQueryPayoutMethod from 'root/src/server/api/actionUtil/dynamoQueryPayoutMethod'
import getTimestamp from 'root/src//shared/util/getTimestamp'

/**
 * Updates the payout email
 * @param userId
 * @param payload
 * @returns {Promise<void>}
 */
export default async ({ userId, payload }) => {
	const { email } = payload

	const dynamoResult = await dynamoQueryPayoutMethod(userId)
	const payout = head(dynamoResult)

	if (!payout) {
		throw generalError('Payout doesn\'t exist')
	}

	const updateProjectParams = {
		TableName: TABLE_NAME,
		Key: {
			[PARTITION_KEY]: payout[PARTITION_KEY],
			[SORT_KEY]: payout[SORT_KEY],
		},
		UpdateExpression: 'SET #email = :email, #modified = :modified',
		ExpressionAttributeValues: {
			':email': email,
			':modified': getTimestamp(),
		},
		ExpressionAttributeNames: {
			'#email': 'email',
			'#modified': 'modified',
		},
	}

	await documentClient.update(updateProjectParams).promise()

	const newPayout = {
		...payout,
		email,
	}

	return omit(['pk'], newPayout)
}
