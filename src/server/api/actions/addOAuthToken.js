import { map, toLower, equals, path } from 'ramda'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import oAuthTokenSerializer from 'root/src/server/api/serializers/oAuthTokenSerializer'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { getUserByToken } from 'root/src/server/api/twitchApi'
import { authorizationError } from 'root/src/server/api/errors'

export default async ({ userId, payload }) => {
	const { displayName, login, thumbnail, id, token, tokenId } = payload

	const userData = await getUserByToken(token)

	if (!equals(path(['data', 0, 'display_name'], userData), displayName)) {
		throw (authorizationError('Wrong token'))
	}

	const oAuthToken = {
		[PARTITION_KEY]: userId,
		[SORT_KEY]: `token-${toLower(tokenId)}|${id}`,
		login,
		thumbnail,
		displayName,
		token,
	}

	const params = {
		RequestItems: {
			[TABLE_NAME]: map(
				Item => ({ PutRequest: { Item } }),
				[oAuthToken],
			),
		},
	}

	await documentClient.batchWrite(params).promise()

	return oAuthTokenSerializer(oAuthToken)
}
