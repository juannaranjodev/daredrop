import addCognitoPolicies from 'root/src/aws/util/addCognitoPolicies'

import { cognitoResources, cognitoOutputs } from 'root/src/aws/cognito'
import { staticHostingResources, staticHostingOutputs } from 'root/src/aws/staticHosting'
import {
	apiResources, apiOutputs, apiAuthPolicies, apiUnauthPolicies,
} from 'root/src/aws/api'
import { lambdaEdgeResources } from 'root/src/aws/lambdaEdge'

const appendedCognitoResources = addCognitoPolicies(
	cognitoResources,
	[
		...apiAuthPolicies,
	],
	[
		...apiUnauthPolicies,
	],
)

export default {
	Resources: {
		...appendedCognitoResources,
		...apiResources,
		...staticHostingResources,
		...lambdaEdgeResources,
	},
	Outputs: {
		...cognitoOutputs,
		...apiOutputs,
		...staticHostingOutputs,
	},
}
