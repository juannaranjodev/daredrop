import { userPoolId, clientId } from 'root/cfOutput'
import { CognitoUserPool } from 'amazon-cognito-identity-js-node'

export default new CognitoUserPool({
	UserPoolId: userPoolId,
	ClientId: clientId,
})
