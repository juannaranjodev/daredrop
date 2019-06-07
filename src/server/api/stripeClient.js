import Stripe from 'stripe'
import { SecretsManager } from 'aws-sdk'

const secretsClient = new SecretsManager()
const secretName = 'Stripe_Test_0'

export default new Promise((resolve, reject) => {
	try {
		secretsClient.getSecretValue({ SecretId: secretName }, (err, data) => {
			if (err) {
				reject(err)
			}
			const { stripeSecret: clientSecret, stripeKey: clientId } = JSON.parse(data.SecretString)
			console.log(clientSecret)
			console.log(clientId)
			const stripe = Stripe(clientSecret)
			resolve(stripe)
		})
	} catch (err) {
		reject(err)
	}
})
