import { SecretsManager } from 'aws-sdk'
import { lambdaAccessSecretArn } from 'root/cfOutput'

const secretsClient = new SecretsManager()

export default async () => {
	try {
		const data = await secretsClient.getSecretValue({ SecretId: lambdaAccessSecretArn }).promise()
		return JSON.parse(data.SecretString)
	} catch (err) {
		throw new Error(err)
	}
}
