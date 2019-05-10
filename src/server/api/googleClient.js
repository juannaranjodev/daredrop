import { google } from 'googleapis'
import { redirectURI } from 'root/src/shared/constants/googleOAuth'
import { SecretsManager } from 'aws-sdk'

const secretsClient = new SecretsManager()
const secretName = 'google_OAuth'

export default new Promise((resolve) => {
	secretsClient.getSecretValue({ SecretId: secretName }, (err, data) => {
		const { clientSecret, refreshToken, clientId } = JSON.parse(data.SecretString)
		const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectURI)

		oauth2Client.setCredentials({
			refresh_token: refreshToken,
		})
		resolve(oauth2Client)
	})
})

export const youtube = google.youtube('v3')
