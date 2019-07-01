import { PAY_OUTSTANDING_PAYOUTS } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[PAY_OUTSTANDING_PAYOUTS]: {
		isLongRunningTask: true,
		isInvokedInternal: true,
	},
}
