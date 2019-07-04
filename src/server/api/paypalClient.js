import { SecretsManager } from 'aws-sdk'
import paypalRestSDK from 'paypal-rest-sdk'
import { productionPaypal, developmentPaypal } from 'root/src/shared/constants/secretNames'

const secretsClient = new SecretsManager()
const envConf = process.env.STAGE === 'production'
	? {
		mode: 'live',
		secretName: productionPaypal,
	}
	: {
		mode: 'sandbox',
		secretName: developmentPaypal,
	}

export default async () => {
	try {
		const { mode, secretName } = envConf
		const data = await secretsClient.getSecretValue({ SecretId: secretName }).promise()
		const { paypalClientId: clientId, paypalClientSecret: clientSecret } = JSON.parse(data.SecretString)
		paypalRestSDK.configure({
			mode,
			client_id: clientId,
			client_secret: clientSecret,
		})
		return paypalRestSDK
	} catch (err) {
		throw new Error(err)
	}
}
