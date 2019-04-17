import { FAVORITES_PROCESSING_END } from 'root/src/client/logic/project/actionIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { setFavoritesProcessing } = apiStoreLenses

export default {
	[FAVORITES_PROCESSING_END]: (state) => {
		return setFavoritesProcessing(
			false,
			state,
		)
	},
}
