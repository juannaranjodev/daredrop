import getAtt from 'root/src/aws/util/getAtt'
import {
	AUTHENTICATION_LAYER_VERSION, AUTHENTICATION_LAYER_REQUEST_HANDLER,
} from 'root/src/aws/authenticationLayer/resourceIds'

export default {
	[AUTHENTICATION_LAYER_VERSION]: {
		Type: 'AWS::Lambda::Version',
		DependsOn: [AUTHENTICATION_LAYER_REQUEST_HANDLER],
		Properties: {
			FunctionName: getAtt(AUTHENTICATION_LAYER_REQUEST_HANDLER, 'Arn'),
		},
	},
}
