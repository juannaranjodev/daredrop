import { capitalize } from 'root/src/shared/util/ramdaPlus'
import { prop } from 'ramda'

export default (prefix, suffix, type, lenses) => prop(`${prefix}${capitalize(type)}${capitalize(suffix)}`, lenses)
