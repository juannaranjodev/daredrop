import { compose, length, gt, head, prop, __, slice } from 'ramda'

export default (value) => {
	const label = compose(prop('label'), head)(value)
	const isNeedTriming = compose(gt(__, 12), length)(label)
	if (isNeedTriming) {
		return `${compose(slice(0, 11))(label)}...`
	}
	return label
}
