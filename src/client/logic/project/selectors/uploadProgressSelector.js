import { appStoreLenses } from 'root/src/client/logic/app/lenses'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import createRecordStoreKey from 'root/src/client/logic/api/util/createRecordStoreKey'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

const { viewUploadProgressChild } = appStoreLenses

export default (state) => {
 const recordType = project
 const projectId = currentRouteParamsRecordId(state)
 const recordStoreKey = createRecordStoreKey(recordType, projectId)
 return viewUploadProgressChild(recordStoreKey, state)
}
