import { head } from 'ramda'
import listResults from 'root/src/server/api/actionUtil/listResults'
import payoutMethodSerializer from 'root/src/server/api/serializers/payoutMethodSerializer'
import dynamoQueryPayoutMethod from 'root/src/server/api/actionUtil/dynamoQueryPayoutMethod'

export default async ({ userId }) => {
  const dynamoResult = await dynamoQueryPayoutMethod(userId)
  return {
    userId,
    ...head(dynamoResult)
  }
}
