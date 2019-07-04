import { head, prop } from 'ramda'
import buildUserSortKeyFromAssigneeObj from 'root/src/server/api/actionUtil/buildUserSortKeyFromAssigneeObj'
import dynamoGetUserIdFromSK from 'root/src/server/api/actionUtil/dynamoGetUserIdFromSK'
import dynamoQueryPayoutMethod from 'root/src/server/api/actionUtil/dynamoQueryPayoutMethod'
import { composeE } from 'root/src/shared/util/ramdaPlus'

export default composeE(
	prop('email'), head, dynamoQueryPayoutMethod, dynamoGetUserIdFromSK, buildUserSortKeyFromAssigneeObj,
)
