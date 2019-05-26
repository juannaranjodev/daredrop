import { assoc, prop } from 'ramda'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

export default recordToArchive => [
	{
		PutRequest: {
			Item: assoc('sk', `archival-${prop('sk', recordToArchive)}`, recordToArchive),
		},
	},
	{
		DeleteRequest: {
			Key: {
				[SORT_KEY]: recordToArchive[SORT_KEY],
				[PARTITION_KEY]: recordToArchive[PARTITION_KEY],
			},
		},
	},
]
