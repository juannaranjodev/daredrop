import { path } from 'ramda'
import moduleIdFromKey from 'root/src/client/logic/route/util/moduleIdFromKey'
import formHandlers from 'root/src/shared/descriptions/formHandlers'

import moduleDescriptions from 'root/src/shared/descriptions/modules'


export const handleActionHof = (moduleDescriptionsObj, formHandlersObj) => (moduleKey, handlerIndex) => async (dispatch, getState) => {
  const moduleId = moduleIdFromKey(moduleKey)
  const action = path([moduleId, handlerIndex, 'action'], formHandlersObj)
  const args = path([moduleId, handlerIndex, 'args'], formHandlersObj)
  action(moduleId, ...args)(dispatch, getState)
}
export default handleActionHof(
  moduleDescriptions, formHandlers,
) 