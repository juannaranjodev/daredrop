import { userPoolId, clientId } from 'root/cfOutput'

import CognitoUserPool from 'amazon-cognito-identity-js/lib/CognitoUserPool'

export default new CognitoUserPool({
	UserPoolId: userPoolId,
	ClientId: clientId,
})
