import { CLEAR_LIST } from 'root/src/client/logic/api/actionIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { setLists } = apiStoreLenses

const clearList = state => setLists({}, state)

export default {
	[CLEAR_LIST]: clearList,
}
