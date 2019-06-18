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

export default new Promise((resolve, reject) => {
	const { mode, secretName } = envConf
	secretsClient.getSecretValue({ SecretId: secretName }, (err, data) => {
		if (err) {
			reject(err)
		}
		const { paypalClientId: clientId, paypalClientSecret: clientSecret } = JSON.parse(data.SecretString)

		paypalRestSDK.configure({
			mode,
			client_id: clientId,
			client_secret: clientSecret,
		})
		resolve(paypalRestSDK)
	})
})
