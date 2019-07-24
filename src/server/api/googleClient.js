import { google } from 'googleapis'
import { redirectURI } from 'root/src/shared/constants/googleOAuth'
import { SecretsManager } from 'aws-sdk'
import { productionGoogle, developmentGoogle } from 'root/src/shared/constants/secretNames'

const secretsClient = new SecretsManager()
const secretName = process.env.STAGE === 'production' ? productionGoogle : developmentGoogle

export default async () => {
	try {
		const data = await secretsClient.getSecretValue({ SecretId: secretName }).promise()
		const { clientSecret, refreshToken, clientId } = JSON.parse(data.SecretString)
		const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectURI)
		oauth2Client.setCredentials({
			refresh_token: refreshToken,
		})
		return oauth2Client
	} catch (err) {
		throw err
	}
}

export const youtube = google.youtube('v3')
