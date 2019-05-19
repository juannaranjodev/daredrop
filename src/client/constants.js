import buildTwitchScopes from 'root/src/client/util/buildTwitchScopes'
import { twitchScopes } from 'root/src/shared/constants/twitch'

const twitchUrl = () => {
	const responseType = 'token'
	const redirectUri = `http://${window.location.host}/twitch-oauth`
	const scopes = buildTwitchScopes(twitchScopes)
	let clientId

	if (window.location.host === 'localhost:8585') {
		clientId = 'jl2c2hlcyimcmg466n0jscmlmpcb8j'
	} else {
		clientId = TWITCH_CLIENT_ID
	}
	return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}${scopes}`
}

export const twitchOauthUrl = twitchUrl()
