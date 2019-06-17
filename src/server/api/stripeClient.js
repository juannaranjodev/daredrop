import Stripe from 'stripe'
import { SecretsManager } from 'aws-sdk'
import { productionStripe, developmentStripe } from 'root/src/shared/constants/secretNames'

const secretsClient = new SecretsManager()
const secretName = process.env.STAGE === 'production' ? productionStripe : developmentStripe

export default new Promise((resolve, reject) => {
	try {
		secretsClient.getSecretValue({ SecretId: secretName }, (err, data) => {
			if (err) {
				reject(err)
			}
			const { stripeSecret: clientSecret, stripeKey: clientId } = JSON.parse(data.SecretString)
			console.log('STRIPE')
			console.log({ clientId, clientSecret })
			const stripe = Stripe(clientSecret)
			resolve(stripe)
		})
	} catch (err) {
		reject(err)
	}
})
