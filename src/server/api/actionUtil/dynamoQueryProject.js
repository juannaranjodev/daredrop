import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp, projectToPayoutKey } from 'root/src/server/api/lenses'
import { ternary } from 'root/src/shared/util/ramdaPlus'

export default async (userId, projectId, projectStatus) => {
	const projectParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :project)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':project': `project|${projectStatus ? `${projectStatus}` : ''}`,
		},
		ConsistentRead: true,
	}
	// Don't have to grab these anymore cause they are de-normalized on project
	// ...may have to make a toggle for this fn though
	const assigneeParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :assignee)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':assignee': 'assignee',
		},
		ConsistentRead: true,
	}
	// const gameParams = {
	// 	TableName: TABLE_NAME,
	// 	KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :game)`,
	// 	ExpressionAttributeValues: {
	// 		':pk': projectId,
	// 		':game': 'game',
	// 	},
	// 	ConsistentRead: true,
	// }
	const pledgeParamsExpression = ternary(userId,
		`${PARTITION_KEY} = :pk and ${SORT_KEY} = :pledgeUserId`,
		`${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :pledgeUserId)`)

	const myPledgeParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: pledgeParamsExpression,
		ExpressionAttributeValues: {
			':pk': projectId,
			':pledgeUserId': `pledge|${ternary(userId, userId, '')}`,
		},
		ConsistentRead: true,
	}

	const myFavoritesParamsExpression = ternary(userId,
		`${PARTITION_KEY} = :pk and ${SORT_KEY} = :favoritesUserId`,
		`${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :favoritesUserId)`)

	const myFavoritesParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: myFavoritesParamsExpression,
		ExpressionAttributeValues: {
			':pk': projectId,
			':favoritesUserId': `favorites|${ternary(userId, userId, '')}`,
		},
		ConsistentRead: true,
	}

	const payoutParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :payout)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':payout': projectToPayoutKey,
		},
		ConsistentRead: true,
	}

	const [projectDdb, assigneesDdb, /* gamesDdb, */ myPledgeDdb, myFavoritesDdb, payoutParamsDdb] = await Promise.all([
		documentClient.query(projectParams).promise(),
		documentClient.query(assigneeParams).promise(),
		// documentClient.query(gameParams).promise(),
		documentClient.query(myPledgeParams).promise(),
		documentClient.query(myFavoritesParams).promise(),
		documentClient.query(payoutParams).promise(),
	])

	return [
		dynamoItemsProp(projectDdb),
		dynamoItemsProp(assigneesDdb),
		// dynamoItemsProp(gamesDdb),
		dynamoItemsProp(myPledgeDdb),
		dynamoItemsProp(myFavoritesDdb),
		dynamoItemsProp(payoutParamsDdb),
	]
}