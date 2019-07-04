import {
	LAMBDA_ACCESS_SECRET,
} from 'root/src/aws/secrets/resourceIds'

export default {
	[LAMBDA_ACCESS_SECRET]: {
		Type: 'AWS::SecretsManager::Secret',
		Properties: {
			GenerateSecretString: {},
		},
	},
}
