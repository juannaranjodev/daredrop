import { prop } from 'ramda'
import { region } from 'root/src/shared/constants/aws'

// as this one is imported from minified AWS SDK, then it's not usable on /server/*
const { Lambda } = AWS

export default (fnName, payload) => {
	const lambda = new Lambda({ region })
	return lambda.invoke({
		FunctionName: fnName.replace(/:[0-9]*$/, ''),
		Payload: JSON.stringify(payload),
	}).promise()
		.then(res => JSON.parse(prop('Payload', res)))
}
