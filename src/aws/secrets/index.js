import lambdaAccessSecret from 'root/src/aws/secrets/resources/lambdaAccessSecret'

import outputs from 'root/src/aws/secrets/outputs'

export const secretsResources = {
	...lambdaAccessSecret,
}

export const secretsOutputs = outputs
