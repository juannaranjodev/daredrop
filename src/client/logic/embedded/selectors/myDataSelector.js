import { myTwitchId, myUserId } from 'root/src/shared/constants/filterConstants'
import { appStoreLenses } from 'root/src/client/logic/app/lenses'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'
import { last, split, head } from 'ramda'

const viewCognitoUsername = appStoreLenses['viewCognito:username']
const { viewUserData } = apiStoreLenses

export default (constant, state) => {
 const userId = `user-${viewCognitoUsername(state)}`
 switch (constant) {
  case myTwitchId:
   return last(split('-', head(Object.keys(viewUserData(state)))))
  case myUserId:
   return userId
  default:
   return undefined
 }
}
