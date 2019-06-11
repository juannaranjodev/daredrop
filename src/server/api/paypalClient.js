import { SecretsManager } from 'aws-sdk'
import checkoutNodeJssdk from '@paypal/checkout-server-sdk'

const secretsClient = new SecretsManager()
const secretName = 'PayPal_Test'

// export default new Promise((resolve, reject) => {
// 	secretsClient.getSecretValue({ SecretId: secretName }, (err, data) => {
// 		if (err) {
// 			reject(err)
// 		}
// 		const { PayPal_Test_ID: clientId, PayPal_Test_Secret: clientSecret } = JSON.parse(data.SecretString)
// 		const environment = new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
// 		const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment)
// 		resolve(client)
// 	})
// })
