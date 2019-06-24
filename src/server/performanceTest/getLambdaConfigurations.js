import { map, assoc, compose, dissoc, dissocPath } from 'ramda'
import { Lambda } from 'aws-sdk'

const lambda = new Lambda()


export default functionNames => new Promise(async (resolve) => {
	const functionObjects = map(FunctionName => assoc('FunctionName', FunctionName, {}), functionNames)
	const configurations = await Promise.all(map(confRequest => lambda.getFunctionConfiguration(confRequest).promise(), functionObjects))
	const configurationsToReturn = map(compose(
		dissoc('FunctionArn'),
		dissoc('CodeSize'),
		dissoc('LastModified'),
		dissoc('CodeSha256'),
		dissoc('Version'),
		dissocPath(['VpcConfig', 'VpcId']),
		dissoc('MasterArn'),
		dissoc('Role'),
		dissoc('RevisionId'),
	), configurations)
	resolve(configurationsToReturn)
})
