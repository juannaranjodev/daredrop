import ref from 'root/src/aws/util/ref'

import {
	LAMBDA_ACCESS_SECRET,
} from 'root/src/aws/secrets/resourceIds'

import {
	LAMBDA_ACCESS_SECRET_ARN,
} from 'root/src/aws/secrets/outputIds'

export default {
	[LAMBDA_ACCESS_SECRET_ARN]: {
		Description: 'Arn for lambda access secret',
		Value: ref(LAMBDA_ACCESS_SECRET),
	},
}
