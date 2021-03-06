import { dissocPath, compose, set, lensProp, without, view } from 'ramda'
import { outlinedButton } from 'root/src/client/web/componentTypes'

import {
	CLAIM_PROJECT_FORM_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import {
	DARE_ACCEPT_SUCCESS_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import claimProjectSchemaSelector from 'root/src/shared/util/claimProjectSchemaSelector'

export default {
	[CLAIM_PROJECT_FORM_MODULE_ID]: {
		moduleType: 'form',
		schema: compose(
			dissocPath(['properties', 'projectId']),
			dissocPath(['additionalProperties']),
			set(
				lensProp('required'),
				without(
					['projectId'],
					view(lensProp('required'), claimProjectSchemaSelector(ACCEPT_PROJECT)),
				),
			),
		)(claimProjectSchemaSelector(ACCEPT_PROJECT)),
		title: 'Accept the Dare',
		fields: [
			{
				fieldId: 'amountRequested',
				inputType: 'amountNumber',
				label: 'Enter amount',
				labelFieldText: [
					{
						text: 'Amount Requested',
						required: true,
					},
				],
				subFieldTopText: 'This is the amount your fans need to pledge in order for you to deliver. Only about 90% of charges are generally successful, take that into account when setting your goal.',
			},
		],
		successPage: DARE_ACCEPT_SUCCESS_ROUTE_ID,
		submits: [
			{
				label: 'Accept',
				endpointId: ACCEPT_PROJECT,
				onSuccessRedirect: {
					routeId: DARE_ACCEPT_SUCCESS_ROUTE_ID,
					routeParams: [
						['recordId', { $sub: ['res', 'body', 'id'] }],
					],
				},
			},
		],
		handlers: [
			{
				label: 'Reject',
				buttonType: outlinedButton,
			},
		],
	},
}
