import { SecretsManager } from 'aws-sdk'
import { lambdaAccessSecretArn } from 'root/cfOutput'

const secretsClient = new SecretsManager()

export default new Promise((resolve, reject) => {
	try {
		secretsClient.getSecretValue({ SecretId: lambdaAccessSecretArn }, (err, data) => {
			if (err) {
				reject(err)
			}
			resolve(data.SecretString)
		})
	} catch (err) {
		reject(err)
	}
})
