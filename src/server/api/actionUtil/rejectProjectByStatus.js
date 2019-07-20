import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { map, prop, assoc, unnest } from 'ramda'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'
import getTimestamp from 'root/src/shared/util/getTimestamp'

// @TODO
// this one we could just rewrite to get use of archival table
export default async (projectId, statusArr) => {
	const paramsArr = await Promise.all(map(async (status) => {
		const queryParams = {
			TableName: TABLE_NAME,
			KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :sk)`,
			ExpressionAttributeValues: {
				':pk': projectId,
				':sk': status,
			},
		}

		const queriedProjectsDdb = await documentClient.query(queryParams).promise()
		const queriedProjects = dynamoItemsProp(queriedProjectsDdb)

		const replaceStatusForRejected = project => (
			assoc('archived', getTimestamp(), assoc('sk', `rejected-${prop('sk', project)}`, project)))

		const updatedProjects = map(replaceStatusForRejected, queriedProjects)

		const queriedProjectsDelete = map(
			projectToUpdate => ({
				DeleteRequest: {
					Key: {
						[PARTITION_KEY]: projectToUpdate[PARTITION_KEY],
						[SORT_KEY]: projectToUpdate[SORT_KEY],
					},
				},
			}),
			queriedProjects,
		)

		const updatedProjectsPut = map(
			Item => ({ PutRequest: { Item } }),
			updatedProjects,
		)

		return [...queriedProjectsDelete, ...updatedProjectsPut]
	}, statusArr))

	const requestItems = unnest(paramsArr)

	const params = {
		RequestItems: {
			[TABLE_NAME]: [...requestItems],
		},
	}
	await documentClient.batchWrite(params).promise()
}
