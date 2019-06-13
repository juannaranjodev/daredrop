import { SecretsManager } from 'aws-sdk'
import paypalRestSDK from 'paypal-rest-sdk'

const secretsClient = new SecretsManager()

const envConf = process.env.stage === 'production'
	? {
		mode: 'live',
		secretName: 'productionPaypalSecret',
	}
	: {
		mode: 'sandbox',
		secretName: 'PayPal_Test',
	}

export default new Promise((resolve, reject) => {
	const { mode, secretName } = envConf
	secretsClient.getSecretValue({ SecretId: secretName }, (err, data) => {
		if (err) {
			reject(err)
		}
		const { PayPal_Test_ID: clientId, PayPal_Test_Secret: clientSecret } = JSON.parse(data.SecretString)

		paypalRestSDK.configure({
			mode,
			client_id: clientId,
			client_secret: clientSecret,
		})
		resolve(paypalRestSDK)
	})
})
