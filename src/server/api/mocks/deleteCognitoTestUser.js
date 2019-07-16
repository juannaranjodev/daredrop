import { CognitoIdentityServiceProvider } from 'aws-sdk'
import outputs from 'root/cfOutput'

const { userPoolId } = outputs

export default async (email) => {
	const provider = new CognitoIdentityServiceProvider()
	try {
		await provider.adminDeleteUser({ Username: email, UserPoolId: userPoolId }).promise()
		return { status: 200 }
	} catch (err) {
		return { status: err.status }
	}
}
