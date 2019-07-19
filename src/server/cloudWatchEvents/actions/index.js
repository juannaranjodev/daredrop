import {
	PAYOUT_ASSIGNEES, PAY_OUTSTANDING_PAYOUTS, UPLOAD_MISSING_VIDEOS,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import payoutAssignees from 'root/src/server/cloudWatchEvents/actions/payoutAssignees'
import payOutstandingPayouts from 'root/src/server/cloudWatchEvents/actions/payOutstandingPayouts'
import uploadMissingVideos from 'root/src/server/cloudWatchEvents/actions/uploadMissingVideos'

export default {
	[PAYOUT_ASSIGNEES]: payoutAssignees,
	[PAY_OUTSTANDING_PAYOUTS]: payOutstandingPayouts,
	[UPLOAD_MISSING_VIDEOS]: uploadMissingVideos,
}
