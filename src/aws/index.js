import addCognitoPolicies from 'root/src/aws/util/addCognitoPolicies'

import { cognitoResources, cognitoOutputs } from 'root/src/aws/cognito'
import { staticHostingResources, staticHostingOutputs } from 'root/src/aws/staticHosting'
import { secretsResources, secretsOutputs } from 'root/src/aws/secrets'
import { cloudWatchEventsResources, cloudWatchEventsOutputs } from 'root/src/aws/cloudWatchEvents'
import { emailResources, emailOutputs } from 'root/src/aws/email'
import {
	apiResources, apiOutputs, apiAuthPolicies, apiUnauthPolicies,
} from 'root/src/aws/api'

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
		...secretsResources,
		...cloudWatchEventsResources,
		...emailResources,
	},
	Outputs: {
		...cognitoOutputs,
		...apiOutputs,
		...staticHostingOutputs,
		...secretsOutputs,
		...cloudWatchEventsOutputs,
		...emailOutputs,
	},
}
