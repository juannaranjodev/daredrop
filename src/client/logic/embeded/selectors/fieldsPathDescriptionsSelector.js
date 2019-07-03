import { path, map, addIndex } from 'ramda'

import moduleDescriptions from 'root/src/shared/descriptions/modules'

export default (state, { moduleId }) => {
	const fieldsPath = [moduleId, 'embededContent', 'fields']
	const fields = path(fieldsPath, moduleDescriptions)
	return addIndex(map)((field, idx) => [...fieldsPath, idx], fields)
}
