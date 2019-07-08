import payoutAssignees from 'root/src/server/cloudWatchEvents/actions/payoutAssignees'
import payOutstandingPayouts from 'root/src/server/cloudWatchEvents/actions/payOutstandingPayouts'
import { PAYOUT_ASSIGNEES, PAY_OUTSTANDING_PAYOUTS } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[PAYOUT_ASSIGNEES]: payoutAssignees,
	[PAY_OUTSTANDING_PAYOUTS]: payOutstandingPayouts,
}
