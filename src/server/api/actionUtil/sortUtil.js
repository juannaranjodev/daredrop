import { ascend, descend, prop } from 'ramda'
import {SORT_BY_BOUNTY,SORT_BY_TIME_LEFT,SORT_BY_NEWEST,SORT_BY_ACCEPTED} from 'root/src/shared/constants/sortTypesOfProject'

export const ascendingCreated = ascend(prop('created'))
export const descendingCreated = descend(prop('created'))
export const ascendingApproved = ascend(prop('approved'))
export const descendingApproved = descend(prop('approved'))
export const sortByType = {
    [SORT_BY_BOUNTY] : descend(prop('pledgeAmount')),
}