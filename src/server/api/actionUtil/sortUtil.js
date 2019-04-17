import { ascend, descend, prop, path } from 'ramda'

export const ascendingCreated = ascend(path(['items', 'created']))
export const descendingCreated = descend(prop('created'))
