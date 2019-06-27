import nodeAjax from 'root/src/shared/util/nodeAjax'

import { baseUrlNewApi } from 'root/src/shared/constants/twitch'

export const getUserData = loginArray => nodeAjax({
	url: `${baseUrlNewApi}users`,
	headers: { 'Client-ID': TWITCH_CLIENT_ID },
	queryParams: { id: loginArray },
})

export const getGameData = gameIds => nodeAjax({
	url: `${baseUrlNewApi}games`,
	headers: { 'Client-ID': TWITCH_CLIENT_ID },
	queryParams: { id: gameIds },
})

export const getUserByToken = token => nodeAjax({
	url: `${baseUrlNewApi}users`,
	headers: { 'Client-ID': TWITCH_CLIENT_ID, Authorization: token },
})
