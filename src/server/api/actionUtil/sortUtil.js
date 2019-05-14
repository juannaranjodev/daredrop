import { ascend, descend, prop } from 'ramda'
import {SORT_BY_BOUNTY,SORT_BY_TIME_LEFT,SORT_BY_NEWEST, SORT_BY_CREATED_ASC} from 'root/src/shared/constants/sortTypesOfProject'

export const ascendingCreated = ascend(prop('created'))
export const descendingCreated = descend(prop('created'))
export const ascendingApproved = ascend(prop('approved'))
export const descendingApproved = descend(prop('approved'))
export const descendingPledgeAmount = descend(prop('pledgeAmount'))

const diffDescending = function(a,b,prp){
    const aV = prop(prp,a) ? prop(prp,a) : 0
    const bV = prop(prp,b) ? prop(prp,b) : 0
    return parseInt(bV) - parseInt(aV)
}
const diffAscending = function(a,b,prp){
    const aV = prop(prp,a) ? prop(prp,a) : 0
    const bV = prop(prp,b) ? prop(prp,b) : 0
    return parseInt(aV) - parseInt(bV)
}



export const sortByType = {
    [SORT_BY_BOUNTY] : function(dareA, dareB){
        return diffDescending(dareA,dareB,'pledgeAmount')
    },
    [SORT_BY_TIME_LEFT] : ascendingApproved,
    [SORT_BY_NEWEST] : descendingApproved,
    [SORT_BY_CREATED_ASC] : ascendingCreated,
}