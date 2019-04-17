import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { viewFavoritesProcessing } = apiStoreLenses

export default (state) => {
	return viewFavoritesProcessing(state) || false
}
