import { SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

export default ({ email }) => ({
	[SORT_KEY]: `payoutMethod|paypal`,
	email
})
