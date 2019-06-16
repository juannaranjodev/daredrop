import { prop } from 'ramda'
import { region } from 'root/src/shared/constants/aws'

import Lambda from 'aws-sdk/clients/lambda'

export default (fnName, payload) => {
	const lambda = new Lambda({ region })
	return lambda.invoke({
		FunctionName: fnName.replace(/:[0-9]*$/, ''),
		Payload: JSON.stringify(payload),
	}).promise()
		.then(res => JSON.parse(prop('Payload', res)))
}
