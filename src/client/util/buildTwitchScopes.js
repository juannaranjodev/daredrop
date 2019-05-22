import { map, addIndex, length, equals } from 'ramda'

export default twitchScopes => `&scope=${addIndex(map)((scope, idx) => {
	if (equals(idx, length(twitchScopes) - 1)) {
		return scope
	} return `${scope}+`
}, twitchScopes)}`
