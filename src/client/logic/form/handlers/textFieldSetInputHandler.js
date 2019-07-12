import { toLower } from 'ramda'

const number = 'number'
const email = 'email'

export default (moduleKey, fieldPath, action, fieldType) => async (e) => {
	e.preventDefault()
	let { value } = e.target
	if (fieldType === number) {
		const re = /\D/
		const input = value[value.length - 1]
		if (input !== undefined && input.match(re)) {
			value = value.slice(0, value.length - 1)
		}
		value = parseInt(value, 10)
		if (value > 999999) value = 999999
	}
	if (fieldType === email) {
		value = toLower(value)
	}
	action(moduleKey, fieldPath, value)
}
