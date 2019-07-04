import determineAuth from 'root/src/client/logic/cognito/thunks/determineAuth'
import { setRefreshSession, getCurrentSession } from 'root/src/client/logic/cognito/util/authenticate'
import { appStoreLenses } from 'root/src/client/logic/app/lenses'
import { equals, path } from 'ramda'

const { viewJwtToken } = appStoreLenses

export default async (state, dispatch) => {
	try {
		const session = await getCurrentSession()
		const sessionJwtToken = path(['idToken', 'jwtToken'], session)
		const jwtToken = viewJwtToken(state)
		if (!session.isValid() || !equals(jwtToken, sessionJwtToken)) {
			await dispatch(determineAuth())
		}
		return true
	} catch (error) {
		return false
	}
}
