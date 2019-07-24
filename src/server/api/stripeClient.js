import Stripe from 'stripe'
import { SecretsManager } from 'aws-sdk'
import { productionStripe, developmentStripe } from 'root/src/shared/constants/secretNames'

const secretsClient = new SecretsManager()
const secretName = process.env.STAGE === 'production' ? productionStripe : developmentStripe

export default async () => {
	try {
		const data = await secretsClient.getSecretValue({ SecretId: secretName }).promise()
		const { stripeSecret: clientSecret, stripeKey: clientId } = JSON.parse(data.SecretString)
		const stripe = Stripe(clientSecret)
		return stripe
	} catch (err) {
		throw err
	}
}
