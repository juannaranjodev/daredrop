/* eslint-disable max-len */
import { head, replace, equals, prop, map, set, assoc, add, reduce, __, tap } from 'ramda'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import dareApprovedMail from 'root/src/server/email/templates/dareApproved'
import { dareApprovedTitle } from 'root/src/server/email/util/emailTitles'
import sendEmail from 'root/src/server/email/actions/sendEmail'

import { PAYOUT_ASSIGNEES } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError } from 'root/src/server/api/errors'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import { projectApprovedKey, projectRejectedKey } from 'root/src/server/api/lenses'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import projectStatusKeySelector from 'root/src/server/api/actionUtil/projectStatusKeySelector'
import rejectProjectByStatus from 'root/src/server/api/actionUtil/rejectProjectByStatus'
import dynamoQueryPayoutMethod from 'root/src/server/api/actionUtil/dynamoQueryPayoutMethod'
import buildUserSortKeyFromAssigneeObj from 'root/src/server/api/actionUtil/buildUserSortKeyFromAssigneeObj'
import dynamoGetUserIdFromSK from 'root/src/server/api/actionUtil/dynamoGetUserIdFromSK'
import moment from 'moment'
import calculatePayouts from 'root/src/server/api/actionUtil/calculatePayouts'

const payloadLenses = getPayloadLenses(PAYOUT_ASSIGNEES)
const { viewProjectId } = payloadLenses

export default async ({ payload }) => {
	const projectId = viewProjectId(payload)
	const payoutsWithPaypalEmails = await calculatePayouts(projectId)
	const { payoutTotal } = payoutsWithPaypalEmails
	// check paypal balance
	return payoutsWithPaypalEmails
}
