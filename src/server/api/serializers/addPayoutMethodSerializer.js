import { SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import getTimestamp from 'root/src/shared/util/getTimestamp'

export default ({ email }) => ({
	[SORT_KEY]: 'payoutMethod|paypal',
	email,
	created: getTimestamp(),
})
