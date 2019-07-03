import { pathOr, map, prop } from 'ramda'
import fieldsPathDescriptionsSelector from 'root/src/client/logic/embedded/selectors/fieldsPathDescriptionsSelector'
// import stringFormat from 'string-format'

import ajax from 'root/src/shared/util/ajax'
import moduleDescriptions from 'root/src/shared/descriptions/modules'

import { baseUrlV5 } from 'root/src/shared/constants/twitch'

const promiseTypeMap = {
	twitchChannels: async (input) => {
		try {
			if (!input) {
				return []
			}
			const searchResults = await ajax({
				url: `${baseUrlV5}search/channels`,
				headers: { 'Client-ID': TWITCH_CLIENT_ID },
				queryParams: { query: input, type: 'suggest' },
			})
			return map(
				// eslint-disable-next-line camelcase
				({ display_name, _id, logo }) => ({
					label: display_name,
					id: _id,
					value: _id,
					image: logo,
				}),
				prop('channels', searchResults),
			)
		} catch (e) {
			return []
		}
	},
	twitchGames: async (input) => {
		try {
			if (!input) {
				return []
			}
			const searchResults = await ajax({
				url: `${baseUrlV5}search/games`,
				headers: { 'Client-ID': TWITCH_CLIENT_ID },
				queryParams: { query: input, type: 'suggest' },
			})
			return map(
				({ name, _id, box }) => ({
					label: name,
					id: _id,
					value: _id,
					image: prop('small', box),
				}),
				prop('games', searchResults),
			)
		} catch (e) {
			return []
		}
	},
}

export default (state, { moduleId }) => map(path => prop(pathOr(
	'',
	[...path, 'optionsPromiseType'],
	moduleDescriptions,
), promiseTypeMap), fieldsPathDescriptionsSelector(state, { moduleId }))
