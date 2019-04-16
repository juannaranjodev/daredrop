import { FAVORITES_BUTTON_CLICK } from 'root/src/client/logic/project/actionIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { setFavoritesProcessing } = apiStoreLenses

export default {
	[FAVORITES_BUTTON_CLICK]: (state) => {
		return setFavoritesProcessing(
			true,
			state,
		)
	},
}
