import { map, assoc, prop, compose, unnest } from 'ramda'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

export default compose(unnest, map(project => ([
	{
		PutRequest: {
			Item: {
				...assoc('sk', `archival-${prop('sk', project)}`, project),
			},
		},
	},
	{
		DeleteRequest: {
			Key: {
				[SORT_KEY]: project[SORT_KEY],
				[PARTITION_KEY]: project[PARTITION_KEY],
			},
		},
	},
])))
