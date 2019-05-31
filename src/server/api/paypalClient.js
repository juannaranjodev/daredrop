import { SecretsManager } from 'aws-sdk'
import checkoutNodeJssdk from '@paypal/checkout-server-sdk'

const secretsClient = new SecretsManager()
const secretName = process.env.stage === 'production' ? 'productionPaypalSecret' : 'PayPal_Test'
// PROD
export default new Promise((resolve) => {
	secretsClient.getSecretValue({ SecretId: secretName }, (err, data) => {
		const { PayPal_Test_ID: clientId, PayPal_Test_Secret: clientSecret } = JSON.parse(data.SecretString)
		const environment = process.env.stage === 'production'
			? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
			: new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
		const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment)
		resolve(client)
	})
})
