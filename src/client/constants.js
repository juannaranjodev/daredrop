const twitchUrl = () => {
 if (window.location.host === 'localhost:8585') {
  return `https://id.twitch.tv/oauth2/authorize?client_id=jl2c2hlcyimcmg466n0jscmlmpcb8j&response_type=token&redirect_uri=http://${window.location.host}/twitch-oauth`
 } else {
  return `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&response_type=token&redirect_uri=http://${window.location.host}/twitch-oauth`
 }
}

export const twitchOauthUrl = twitchUrl()