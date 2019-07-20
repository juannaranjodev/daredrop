import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import getTimestamp from 'root/src/shared/util/getTimestamp'

export default ({ payload: { email }, userId }) => ({
	[PARTITION_KEY]: userId,
	[SORT_KEY]: 'payoutMethod|paypal',
	userId,
	email,
	created: getTimestamp(),
})
