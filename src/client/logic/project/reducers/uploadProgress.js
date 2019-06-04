import { UPLOAD_PROGRESS } from 'root/src/client/logic/project/actionIds'
import { appStoreLenses } from 'root/src/client/logic/app/lenses'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import { compose, path } from 'ramda'
import createRecordStoreKey from 'root/src/client/logic/api/util/createRecordStoreKey'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

const { setCurrentProgress, setTargetProgress } = appStoreLenses

export default {
	[UPLOAD_PROGRESS]: (state, progressEvent) => {
		const recordType = project
		const projectId = currentRouteParamsRecordId(state)
		const recordStoreKey = createRecordStoreKey(recordType, projectId)
		const currentProgress = path(['progressEvent', 'loaded'], progressEvent)
		const targetProgress = path(['progressEvent', 'total'], progressEvent)
		return compose(
			setCurrentProgress(recordStoreKey, currentProgress),
			setTargetProgress(recordStoreKey, targetProgress),
		)(state)
	},
}
