import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import getTimestamp from 'root/src/shared/util/getTimestamp'

export default recordToArchive => ({
	archivalTable: {
		PutRequest: {
			Item: {
				recordToArchive,
				modified: getTimestamp(),
			},
		},
	},
	table: {
		DeleteRequest: {
			Key: {
				[SORT_KEY]: recordToArchive[SORT_KEY],
				[PARTITION_KEY]: recordToArchive[PARTITION_KEY],
				archived: getTimestamp(),
			},
		},
	},
})
