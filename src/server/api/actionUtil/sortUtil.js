import { ascend, descend, prop } from 'ramda'

export const ascendingCreated = ascend(prop('created'))
export const descendingCreated = descend(prop('created'))
export const ascendingApproved = ascend(prop('approved'))
export const descendingApproved = descend(prop('approved'))
