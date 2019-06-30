import { SecretsManager } from 'aws-sdk'
import { productionKeyProtected, developmentKeyProtected } from 'root/src/shared/constants/secretNames'

const secretsClient = new SecretsManager()
const secretName = process.env.STAGE === 'production' ? productionKeyProtected : developmentKeyProtected

export default async () => {
	try {
		const data = await secretsClient.getSecretValue({ SecretId: secretName }).promise()
		return JSON.parse(data.SecretString)
	} catch (err) {
		throw new Error(err)
	}
}
