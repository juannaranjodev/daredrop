import {
	API_RECORD_CLICK_ACTION_REQUEST_ERROR,
} from 'root/src/client/logic/api/actionIds'
import { compose } from 'ramda'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { setRecordClickActionProcessingChild, setRecordClickActionErrorsChild } = apiStoreLenses

export const apiRecordClickActionRequestError = (
	state,
	{ recordClickActionStoreKey, errors },
) => compose(
	setRecordClickActionErrorsChild(recordClickActionStoreKey, errors),
	setRecordClickActionProcessingChild(recordClickActionStoreKey, false),
)(state)


export default {
	[API_RECORD_CLICK_ACTION_REQUEST_ERROR]: apiRecordClickActionRequestError,
}
