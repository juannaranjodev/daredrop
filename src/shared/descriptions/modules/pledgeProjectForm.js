import { dissocPath, compose, set, lensProp, without, view } from 'ramda'

import {
	PLEDGE_PROJECT_FORM_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import { paymentMethod } from 'root/src/shared/descriptions/endpoints/recordTypes'
import pledgeProjectPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/pledgeProjectPayloadSchema'
import { PLEDGE_PROJECT, GET_PAYMENT_METHODS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
	PLEDGE_SUCCESS_PAGE_ROUTE_ID, CREATE_PROJECT_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

export const formCommon = {
	schema: compose(
		dissocPath(['properties', 'projectId']),
		dissocPath(['properties', 'paymentInfo', 'paymentType']),
		dissocPath(['additionalProperties']),
		set(
			lensProp('required'),
			without(
				['paymentInfo', 'projectId'],
				view(lensProp('required'), pledgeProjectPayloadSchema),
			),
		),
	)(pledgeProjectPayloadSchema),
	title: 'Payment Information',
	fields: [
		{
			fieldId: 'pledgeAmount',
			inputType: 'amountNumber',
			label: '$1',
			labelFieldText: [
				{
					text: 'Amount to Contribute (min. $1)',
				},
			],
		},
		{
			fieldId: 'stripeCardId',
			inputType: 'stripeCard',
			label: 'Credit Card',
		},
	],
}

export default {
	[PLEDGE_PROJECT_FORM_MODULE_ID]: {
		moduleType: 'form',
		...formCommon,
		recordType: paymentMethod,
		endpointId: GET_PAYMENT_METHODS,
		preSubmitCaption: '*This is just a pledge and you’ll only be charged if the streamer delivers. If they don’t deliver, you won’t pay a thing!',
		successPage: PLEDGE_SUCCESS_PAGE_ROUTE_ID,
		submits: [
			{
				label: 'Confirm',
				endpointId: PLEDGE_PROJECT,
				onSuccessRecordUpdates: [{
					modification: 'set',
					path: [':recordStoreKey', 'myPledge'],
					valuePath: ['formData', 'pledgeAmount'],
				}],
				onSuccessRedirect: {
					routeId: PLEDGE_SUCCESS_PAGE_ROUTE_ID,
					routeParams: [
						['recordId', { $sub: ['res', 'body', 'id'] }],
					],
				},
				customSubmit: 'payPalButton',
			},
		],
		backButton: {
			label: 'Go back',
			routeId: CREATE_PROJECT_ROUTE_ID,
		},
	},
}
