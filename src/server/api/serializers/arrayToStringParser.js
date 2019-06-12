import { join, length, equals, lte, slice, last } from 'ramda'

export default (array) => {
	if (lte(length(array), 1)) return join('', array)
	if (equals(length(array), 2)) return join(' or ', array)
	return `${join(', ', slice(0, -1, array))}, or ${last(array)}`
}
