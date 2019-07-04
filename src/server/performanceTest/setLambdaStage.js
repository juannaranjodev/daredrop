import { map, assocPath } from 'ramda'
import { Lambda } from 'aws-sdk'

const lambda = new Lambda()


export default (configurations, stage) => new Promise(async (resolve) => {
	const configObjects = map(assocPath(['Environment', 'Variables', 'STAGE'], stage), configurations)
	await Promise.all(map(confObject => lambda.updateFunctionConfiguration(confObject).promise(), configObjects))

	resolve(true)
})
