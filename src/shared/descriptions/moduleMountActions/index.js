import { __, pathOr, compose, prepend } from 'ramda'

import viewProject from 'root/src/shared/descriptions/moduleMountActions/viewProject'
import getPledgedProject from 'root/src/shared/descriptions/moduleMountActions/getPledgedProject'

const allModules = {
	...viewProject,
	...getPledgedProject,
}

export default allModules
