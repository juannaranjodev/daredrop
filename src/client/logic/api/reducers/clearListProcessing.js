import { CLEAR_LIST_PROCESSING } from 'root/src/client/logic/api/actionIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { setListProcessing } = apiStoreLenses

const clearListProcessing = state => setListProcessing({}, state)

export default {
	[CLEAR_LIST_PROCESSING]: clearListProcessing,
}
