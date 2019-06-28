import determineAuth from 'root/src/client/logic/cognito/thunks/determineAuth'
import { setRefreshSession, getCurrentSession } from 'root/src/client/logic/cognito/util/authenticate'

export default async (state, dispatch) => {
	try {
		const session = await getCurrentSession()
		if (!session.isValid()) {
			await setRefreshSession()
			await dispatch(determineAuth())		
		}
		return true		
	} catch (error) {
		return false
	}
}