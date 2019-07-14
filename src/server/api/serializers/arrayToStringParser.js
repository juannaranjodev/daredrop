import { join, length, equals, lte, slice, last } from 'ramda'

export default (array, verb) => {
	let ret = ''
	if (lte(length(array), 1)) ret = join('', array)
	else if (equals(length(array), 2)) ret = join(' and ', array)
	else ret = `${join(', ', slice(0, -1, array))}, and ${last(array)}`
	switch (verb) {
		case 'is':
			return (length(array) > 1) ? `${ret} are` : `${ret} is`
		default:
			return ret
	}
}
