import { capitalize, stringLength } from 'root/src/shared/util/ramdaPlus'
import { equals } from 'ramda'

export default ({ prop, type }, payload) => {
	switch (type) {
		case 'required':
			if (equals(stringLength(payload[prop]), 0)) {
				return { [prop]: `${capitalize(prop)} is required` }
			}
			return {}
		default:
			return { [prop]: 'error' }
	}
}
