import { isEmpty, not, equals } from 'ramda'

import validateSchema from 'root/src/shared/util/validateSchema'

import ajvErrors from 'root/src/shared/util/ajvErrors'

export default (moduleId, formSchema, formData) => new Promise((resolve, reject) => {
	const formDataCp = { ...formData }
	Object.keys(formData).forEach((key) => {
		if (isEmpty(formData[key]) && not(equals(formData[key], 0))) {
			delete formDataCp[key]
		}
	})

	return validateSchema(moduleId, formSchema, formDataCp).then(
		({ valid, errors }) => {
			if (valid) {
				resolve(formDataCp)
			} else {
				reject(ajvErrors(formSchema, errors))
			}
		},
	)
})
