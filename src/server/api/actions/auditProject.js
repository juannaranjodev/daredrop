import { head, replace, equals, prop, compose, map, set, lensProp } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import dareApprovedMail from 'root/src/server/email/templates/dareApproved'
import { dareApprovedTitle } from 'root/src/server/email/util/emailTitles'
import sendEmail from 'root/src/server/email/actions/sendEmail'

import { AUDIT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError } from 'root/src/server/api/errors'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import { projectApprovedKey, projectRejectedKey } from 'root/src/server/api/lenses'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import projectStatusKeySelector from 'root/src/server/api/actionUtil/projectStatusKeySelector'

import moment from 'moment'

const payloadLenses = getPayloadLenses(AUDIT_PROJECT)
const { viewAudit } = payloadLenses

export default async ({ userId, payload }) => {
	const { projectId } = payload
	const [
		projectToPledgeDdb, myPledgeDdb,
	] = await dynamoQueryProject(
		userId, projectId,
	)
	const projectToPledge = head(projectToPledgeDdb)
	if (!projectToPledge) {
		throw generalError('Project doesn\'t exist')
	}

	let auditedProject = projectToPledge

	// if current audit action is 'approve', create or update approved date of project. (key: 'approved')
	if (equals(viewAudit(payload), projectApprovedKey)) {
		const currentDateTime = moment().format()
		auditedProject = set(lensProp(projectApprovedKey), currentDateTime, projectToPledge)
	}

	if (equals(viewAudit(payload), projectRejectedKey)) {
		const currentDateTime = moment().format()
		auditedProject = set(lensProp(projectApprovedKey), currentDateTime, projectToPledge)
	}

	const auditedProjectToPledge = {
		...auditedProject,
		[SORT_KEY]: replace(
			projectStatusKeySelector(prop('sk', auditedProject)),
			viewAudit(payload),
			auditedProject[SORT_KEY],
		),
	}

	const auditParams = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					DeleteRequest: {
						Key: {
							[PARTITION_KEY]: auditedProject[PARTITION_KEY],
							[SORT_KEY]: auditedProject[SORT_KEY],
						},
					},
				},
				{
					PutRequest: {
						Item: auditedProjectToPledge,
					},
				},
			],
		},
	}

	await documentClient.batchWrite(auditParams).promise()

	const newProject = projectSerializer([
		...projectToPledgeDdb,
		...myPledgeDdb,
	])

	try {
		const email = await getUserEmail(userId)

		if (equals(viewAudit(payload), projectApprovedKey)) {
			const emailData = {
				title: dareApprovedTitle,
				dareTitle: prop('title', newProject),
				recipients: [email],
				streamers: compose(map(prop('username')), prop('assignees'))(newProject),
			}
			sendEmail(emailData, dareApprovedMail)
		}
	} catch (err) { }

	return {
		userId,
		...newProject,
		status: viewAudit(payload),
	}
}
