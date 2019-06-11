import { compose, length, gt, head, prop, __, slice, toLower } from 'ramda'
import { capitalize } from 'root/src/shared/util/ramdaPlus'

export default (value) => {
	const label = compose(capitalize, toLower, prop('label'), head)(value)
	const isNeedTriming = compose(gt(__, 8), length)(label)
	if (isNeedTriming) {
		return `${compose(slice(0, 8))(label)}...`
	}
	return label
}
