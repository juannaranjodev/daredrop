import { reduce, pick, append, prepend, startsWith, split, prop, propEq } from 'ramda'

import { skProp, pkProp, projectDeliveryPendingKey, streamerRejectedKey } from 'root/src/server/api/lenses'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/server/api/getEndpointDesc'

const responseLenses = getResponseLenses(GET_PROJECT)
const {
	overAssignees, setMyPledge, viewPledgeAmount, overGames, setMyFavorites, viewFavoritesAmount, overDeliveries,
} = responseLenses

export default projectArr => reduce(
	(result, projectPart) => {
		const sk = skProp(projectPart)
		if (startsWith('pledge', sk)) {
			return setMyPledge(viewPledgeAmount(projectPart), result)
		}
		if (startsWith('favorites', sk)) {
			return setMyFavorites(viewFavoritesAmount(projectPart), result)
		}
		if (startsWith('assignee', sk)) {
			const [, platform, platformId] = split('|', sk)
			if (propEq('accepted', streamerRejectedKey, projectPart)) {
				return result
			}
			const assigneeObj = pick(
				['image', 'description', 'displayName', 'username', 'accepted', 'amountRequested'],
				projectPart,
			)
			return overAssignees(
				append({ platform, platformId, ...assigneeObj }),
				result,
			)
		}
		if (startsWith('game', sk)) {
			const game = pick(
				['boxArtTemplateUrl', 'name'],
				projectPart,
			)
			return overGames(prepend(game), result)
		}
		if (startsWith(`project|${projectDeliveryPendingKey}`, sk)) {
			const deliveryObj = pick(
				[
					'videoURL', 'timeStamp', 's3ObjectURL',
				],
				projectPart,
			)
			return overDeliveries(append(deliveryObj), result)
		}
		if (startsWith('project', sk)) {
			const projectObj = pick(
				[
					'title', 'image', 'description', 'pledgeAmount', 'approvedVideoUrl',
					'games', 'pledgers', 'created', 'approved', 'favoritesAmount',
				],
				projectPart,
			)

			return {
				...result,
				...projectObj,
				id: pkProp(projectPart),
				status: prop(1, split('|', skProp(projectPart))),
			}
		}
		return result
	},
	{},
	projectArr,
)
