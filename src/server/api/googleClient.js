import { google } from 'googleapis'

const id = '820043552365-hg50v27lo2031so6o39prt9nvnvi8clg.apps.googleusercontent.com'
const secret = 'ybVEUucv4FH-beF1hhE2kHpq'
const refresh = '1/8OF0JV4QmU-a5jnvpclqGqg_OonXmFdazdZOEQZd2xM'
const redirectURI = 'https://developers.google.com/oauthplayground'

const oauth2Client = new google.auth.OAuth2(id, secret, redirectURI)
oauth2Client.setCredentials({
	refresh_token: refresh,
})

export default oauth2Client
export const youtube = google.youtube('v3')
