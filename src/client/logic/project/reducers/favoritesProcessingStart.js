import { FAVORITES_PROCESSING_START } from 'root/src/client/logic/project/actionIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { setFavoritesProcessing } = apiStoreLenses

export default {
	[FAVORITES_PROCESSING_START]: (state) => {
		return setFavoritesProcessing(
			true,
			state,
		)
	},
}
