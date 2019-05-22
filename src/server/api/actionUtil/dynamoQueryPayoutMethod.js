import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/server/api/lenses'

export default async (userId) => {
  const paymentMethodParams = {
    TableName: TABLE_NAME,
    KeyConditionExpression: `${PARTITION_KEY} = :pk and  ${SORT_KEY} = :paypal`,
    ExpressionAttributeValues: {
      ':pk': userId,
      ':paypal': `payoutMethod|paypal`,
    },
    ConsistentRead: true,
  }

  const dynamoResult = await documentClient.query(paymentMethodParams).promise()
  return dynamoItemsProp(dynamoResult)
}
