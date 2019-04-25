import { ascend, descend, prop } from 'ramda'

export const ascendingCreated = ascend(prop('created'))
export const descendingCreated = descend(prop('created'))
