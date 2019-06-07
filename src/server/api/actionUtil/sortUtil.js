import { ascend, descend, prop, propEq, path, add, reduce, propOr } from 'ramda'
import { SORT_BY_BOUNTY, SORT_BY_TIME_LEFT, SORT_BY_NEWEST, SORT_BY_CREATED_ASC, SORT_BY_ACCEPTED } from 'root/src/shared/constants/sortTypesOfProject'
import { projectAccepted } from 'root/src/shared/descriptions/endpoints/recordTypes'

export const ascendingCreated = ascend(prop('created'))
export const descendingCreated = descend(prop('created'))
export const ascendingApproved = ascend(prop('approved'))
export const descendingApproved = descend(prop('approved'))
export const descendingPledgeAmount = descend(prop('pledgeAmount'))

const isAcceptedDare = propEq('status', projectAccepted)

const diffDescending = (a, b, prp) => {
	const assigneesA = path('assingees', a)
	const assigneesB = path('assignees', b)
	const aSum = reduce(
		(accum, itemA) => add(propOr(0, prp, itemA), accum),
		0,
		assigneesA,
	)
	const bSum = reduce(
		(accum, itemB) => add(propOr(0, prp, itemB), accum),
		0,
		assigneesB,
	)

	return aSum - bSum
}

const descendingAccepted = (a, b) => {
	if (isAcceptedDare(a) && isAcceptedDare(b)) {
		return descendingCreated(a, b)
	}
	if (isAcceptedDare(a)) return -1
	if (isAcceptedDare(b)) return 1
	return descendingCreated(a, b)
}

export const sortByType = {
	[SORT_BY_BOUNTY](dareA, dareB) {
		return diffDescending(dareA, dareB, 'pledgeAmount')
	},
	[SORT_BY_ACCEPTED](dareA, dareB) {
		return descendingAccepted(dareA, dareB)
	},
	[SORT_BY_TIME_LEFT]: ascendingApproved,
	[SORT_BY_NEWEST]: descendingApproved,
	[SORT_BY_CREATED_ASC]: ascendingCreated,
}
