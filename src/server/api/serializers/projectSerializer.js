/* eslint-disable no-param-reassign */
import { reduce, pick, append, prepend, startsWith, split, prop, propEq, and, hasPath, propOr } from 'ramda'

import { skProp, pkProp, projectDeliveredKey, streamerRejectedKey, projectDeliveryPendingKey } from 'root/src/server/api/lenses'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/server/api/getEndpointDesc'
import getActiveAssignees from 'root/src/server/api/actionUtil/getActiveAssignees'

const responseLenses = getResponseLenses(GET_PROJECT)
const {
	overAssignees, setMyPledge, viewPledgeAmount, overGames,
	setMyFavorites, viewMyFavorites, overDeliveries,
} = responseLenses

export default (projectArr, isAdminEndpoint, isDenormalized) => reduce(
	(result, projectPart) => {
		const sk = skProp(projectPart)
		if (hasPath(['creator'], projectPart)) {
			result = {
				...result, creator: prop('creator', projectPart),
			}
		}
		if (startsWith('pledge', sk)) {
			return setMyPledge(viewPledgeAmount(projectPart), result)
		}
		if (startsWith('favorites', sk)) {
			return setMyFavorites(viewMyFavorites(projectPart), result)
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
		if (and(startsWith(`project|${projectDeliveryPendingKey}`, sk), isAdminEndpoint)) {
			const deliveryObj = pick(
				[
					'videoURL', 'timeStamp', 's3ObjectURL',
				],
				projectPart,
			)
			return {
				...overDeliveries(append(deliveryObj), result),
				status: prop(1, split('|', skProp(projectPart))),
			}
		}
		if (startsWith(`project|${projectDeliveredKey}`, sk)) {
			const deliveryObj = pick(
				[
					'videoURL', 'timeStamp', 's3ObjectURL', 'status',
				],
				projectPart,
			)
			return {
				...overDeliveries(append(deliveryObj), result),
				status: prop(1, split('|', skProp(projectPart))),
				deliveryApproved: prop('approved', projectPart),
			}
		}
		if (startsWith('project', sk)) {
			const projectObj = pick(
				[
					'title', 'image', 'description', 'pledgeAmount', 'approvedVideoUrl', 'status',
					'games', 'pledgers', 'created', 'approved', 'favoritesAmount', 'deliveries',
					isDenormalized ? 'assignees' : '',
				],
				projectPart,
			)

			if (isDenormalized) {
				return {
					...result,
					...projectObj,
					id: pkProp(projectPart),
					status: propOr(prop(1, split('|', skProp(projectPart))), 'status', projectPart),
					assignees: getActiveAssignees(prop('assignees', projectPart)),
				}
			}
			return {
				...result,
				...projectObj,
				id: pkProp(projectPart),
				status: propOr(prop(1, split('|', skProp(projectPart))), 'status', projectPart),
			}
		}
		return result
	},
	{},
	projectArr,
)
