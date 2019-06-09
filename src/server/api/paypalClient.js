import { SecretsManager } from 'aws-sdk'
import checkoutNodeJssdk from '@paypal/checkout-server-sdk'
import paypalRestSDK from 'paypal-rest-sdk'

const secretsClient = new SecretsManager()
const secretName = 'PayPal_Test'

export default new Promise((resolve, reject) => {
	secretsClient.getSecretValue({ SecretId: secretName }, (err, data) => {
		if (err) {
			reject(err)
		}
		const { PayPal_Test_ID: clientId, PayPal_Test_Secret: clientSecret } = JSON.parse(data.SecretString)
		const environment = new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
		const checkout = new checkoutNodeJssdk.core.PayPalHttpClient(environment)
		paypalRestSDK.configure({
			mode: 'sandbox',
			client_id: clientId,
			client_secret: clientSecret,
		})
		resolve({ checkout, restSDK: paypalRestSDK })
	})
})
