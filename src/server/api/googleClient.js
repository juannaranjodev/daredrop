import { google } from 'googleapis'

const id = '499952193937-34s3haqhbg6i5bgcf9m3h34s008kilrk.apps.googleusercontent.com'
const secret = 'O311qZ6mDexzNUXrxci7Nl6-'
const refresh = '1/JApWIBxHugr-KyiiluqlBYKZI409Tlm94nJr3hSEIY-dEch8KF7m9UzlRLpTFB9f'

const oauth2Client = new google.auth.OAuth2(id, secret, 'https://developers.google.com/oauthplayground')
oauth2Client.setCredentials({
	refresh_token: refresh,
})

export default oauth2Client
export const youtube = google.youtube('v3')
