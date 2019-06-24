import { SecretsManager } from 'aws-sdk'
import { productionKeyProtected, developmentKeyProtected } from 'root/src/shared/constants/secretNames'

const secretsClient = new SecretsManager()
const secretName = process.env.STAGE === 'production' ? productionKeyProtected : developmentKeyProtected

export default new Promise((resolve, reject) => {
	try {
		secretsClient.getSecretValue({ SecretId: secretName }, (err, data) => {
			if (err) {
				reject(err)
			}
			const keyProtectedClient = JSON.parse(data.SecretString)

			resolve(keyProtectedClient)
		})
	} catch (err) {
		reject(err)
	}
})
