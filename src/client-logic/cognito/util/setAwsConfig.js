import { config, CognitoIdentityCredentials } from 'aws-sdk'
import { region } from 'sls-aws/src/constants/aws'
import { identityPoolId, userPoolId } from 'sls-aws/cfOutput'

const cognitoLoginKey = `cognito-idp.${region}.amazonaws.com/${userPoolId}`

const creds = new CognitoIdentityCredentials({
	IdentityPoolId: identityPoolId,
})

config.update({
	region,
	credentials: creds,
})

export default (session) => {
	creds.params.Logins = {
		[cognitoLoginKey]: session.getIdToken().getJwtToken(),
	}
	creds.expired = true
}