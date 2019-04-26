import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import addPaymentMethodSerializer from 'root/src/server/api/serializers/addPaymentMethodSerializer'
import nodeAjax from 'root/src/shared/util/nodeAjax'

const apiKey = 'Bearer ya29.Glv3BpwMK7IfkXYZQaKhCqRt3UL29OsSXu6ITJKiWaDhixCSR8LL9_bnuczHuszkYjywuPChTSIJtrQrfWCeqOHgLqcZwxS-7e6CG6jOanmpK14To0DT_vDNwy7p'


export default (async (/* { userId, payload } */) => {

 const req = {
  url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatus',
  method: 'POST',
  body: {

  },
  headers: {
   Authorization: apiKey,
   Accept: 'application/json',
   'Content-Type': 'application/json'
  }
 }
 nodeAjax(req).then(e => console.log(e)).catch(e => console.log(JSON.stringify(e)))

 // console.log(res)

 // await documentClient.put(putParams).promise()
 return {}
}
)()