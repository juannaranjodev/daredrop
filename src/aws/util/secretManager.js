// vars
import { region } from 'root/src/shared/constants/aws'
import * as AWS from 'aws-sdk'

const accessKeyId = ACCESS_KEY_ID
const secretAccessKey = SECRET_ACCESS_KEY

AWS.config.update({
	accessKeyId,
	secretAccessKey,
	region,
})

export const SecretStripeId = 'Stripe_Test_Secret'
export let secret = ''
export let decodedBinarySecret = ''
// Create Secret Manager
export const secretsManager = new AWS.SecretsManager({
	region,
})

secretsManager.getSecretValue({ SecretId: SecretStripeId, VersionStage: 'AWSPREVIOUS' }, (err, data) => {
	if (err) {
		switch (err.code) {
			case 'DecryptionFailureException':
			case 'InternalServiceErrorException':
			case 'InvalidParameterException':
			case 'InvalidRequestException':
			case 'ResourceNotFoundException':
			default: throw err
		}
	} else if ('SecretString' in data) {
		secret = data.SecretString
	} else {
		const buff = new Buffer(data.SecretBinary, 'base64')
		decodedBinarySecret = buff.toString('ascii')
	}
})
