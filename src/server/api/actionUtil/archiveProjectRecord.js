import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

export default recordToArchive => ({
	archivalTable: {
		PutRequest: {
			Item: recordToArchive,
		},
	},
	table: {
		DeleteRequest: {
			Key: {
				[SORT_KEY]: recordToArchive[SORT_KEY],
				[PARTITION_KEY]: recordToArchive[PARTITION_KEY],
			},
		},
	},
})
