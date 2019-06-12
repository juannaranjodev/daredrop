import { prop, propEq, map, filter, equals, and, not, startsWith } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { REVIEW_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import {
	streamerAcceptedKey, streamerDeliveryApprovedKey,
	projectDeliveredKey, projectDeliveryPendingKey,
	projectApprovedKey, projectToCaptureKey,
} from 'root/src/server/api/lenses'
import assigneeDynamoObj from 'root/src/server/api/actionUtil/assigneeDynamoObj'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import { ternary } from 'root/src/shared/util/ramdaPlus'
import { payloadSchemaError, generalError } from 'root/src/server/api/errors'
import archiveProjectRecord from 'root/src/server/api/actionUtil/archiveProjectRecord'
import capturePaymentsWrite from 'root/src/server/api/actionUtil/capturePaymentsWrite'
import dynamoQueryProjectToCapture from 'root/src/server/api/actionUtil/dynamoQueryProjectToCapture'
import captureProjectPledges from 'root/src/server/api/actionUtil/captureProjectPledges'
import generateCrontab from 'root/src/shared/util/generateCrontab'
import moment from 'moment'
import { CloudWatchEvents } from 'aws-sdk'
import { apiLongTaskFunctionArn, apiCloudWatchEventsIamRole, apiLambdaExecutionRoleArn } from 'root/cfOutput'

const payloadLenses = getPayloadLenses(REVIEW_DELIVERY)
const { viewProjectId, viewAudit, viewMessage } = payloadLenses

export default async ({ payload }) => {
	const projectId = viewProjectId(payload)
	const audit = viewAudit(payload)
	const message = viewMessage(payload)

	if (and(not(equals(audit, projectDeliveredKey)), not(message))) {
		throw payloadSchemaError('Message is required')
	}

	const [projectToApproveDdb, assigneesDdb] = await dynamoQueryProject(null, projectId)

	const projectSerialized = projectSerializer([...projectToApproveDdb, ...assigneesDdb], true)

	const projectAssignees = prop('assignees', projectSerializer([
		...assigneesDdb,
	]))

	const projectAcceptedAssignees = filter(propEq('accepted', streamerAcceptedKey), projectAssignees)

	const assigneesToWrite = ternary(equals(audit, projectDeliveredKey), map(assignee => ({
		PutRequest: {
			Item: {
				...assigneeDynamoObj({
					...assignee,
					accepted: ternary(equals(audit, projectDeliveredKey),
						streamerDeliveryApprovedKey, prop('accepted', assignee)),
				},
				projectId),
			},
		},
	}), projectAcceptedAssignees), [])

	const [recordToArchive] = filter(project => startsWith(`project|${projectDeliveryPendingKey}`, prop('sk', project)), projectToApproveDdb)
	const [recordToUpdate] = filter(project => startsWith(`project|${projectApprovedKey}`, prop('sk', project)), projectToApproveDdb)

	const projectDataToWrite = [
		...ternary(equals(audit, projectDeliveredKey),
			[{
				PutRequest: {
					Item: {
						...recordToArchive,
						[PARTITION_KEY]: prop('id', projectSerialized),
						[SORT_KEY]: await generateUniqueSortKey(prop('id', projectSerialized), `project|${audit}`, 1, 10),
						created: getTimestamp(),
					},
				},
			},
			{
				PutRequest: {
					Item: {
						...recordToUpdate,
						status: projectDeliveredKey,
						deliveries: prop('deliveries', projectSerialized),
					},
				},
			},
			{
				PutRequest: {
					Item: {
						[PARTITION_KEY]: recordToArchive[PARTITION_KEY],
						[SORT_KEY]: await generateUniqueSortKey(prop('id', projectSerialized), `${projectToCaptureKey}`, 1, 10),
					},
				},
			}], []),
		...archiveProjectRecord(recordToArchive),
	]

	const writeParams = {
		RequestItems: {
			[TABLE_NAME]: [...assigneesToWrite, ...projectDataToWrite],
		},
	}

	await documentClient.batchWrite(writeParams).promise()

	if (equals(audit, projectDeliveredKey)) {
		const capturesAmount = await captureProjectPledges(projectId)

		if (!capturesAmount) {
			throw generalError('captures processing error')
		}
		const projectToCapture = await dynamoQueryProjectToCapture(projectId)
		const captureToWrite = await capturePaymentsWrite(projectToCapture, capturesAmount)

		await documentClient.batchWrite({
			RequestItems: {
				[TABLE_NAME]: captureToWrite,
			},
		}).promise()

		// const eventDate = moment().add(5, 'days')
		const eventDate = moment().add(1, 'minutes').subtract(2, 'hours')
		const crontab = generateCrontab(eventDate)

		const cloudWatchEvents = new CloudWatchEvents()

		const ruleParams = {
			Name: projectId,
			ScheduleExpression: crontab,
			EventPattern: JSON.stringify({
				source: ['review.delivery.lambda'],
			}),
			State: 'ENABLED',
			RoleArn: apiCloudWatchEventsIamRole,
		}

		const targetParams = {
			Rule: projectId,
			Targets: [
				{
					Arn: apiLongTaskFunctionArn,
					Id: 'lambdaCloudWatch',
					// InputPath: JSON.stringify({ endpointId: '$.detail.endpointId', payload: '$.detail.payload' }),
				},
			],
		}


		cloudWatchEvents.putRule(ruleParams, (err, rule) => {
			if (err) {
				console.log(err)
				return err
			}
			cloudWatchEvents.putTargets(targetParams, (err, data) => {
				if (err) {
					console.log(err)
					return (err)
				}
				const eventParams = {
					Entries: [
						{
							Detail: JSON.stringify({ endpointId: 'PAYOUT_ASSIGNEES', payload: { projectId } }),
							DetailType: 'Scheduled Event',
							Resources: [
								rule.RuleArn,
							],
							Source: 'review.delivery.lambda',
						},
					],
				}
				cloudWatchEvents.putEvents(eventParams, (err, data) => {
					if (err) {
						console.log(err)
						return (err)
					}
					console.log(data)
					return data
					return {
						...projectSerialized,
						status: audit,
					}
				})
			})
		})
	}


	return {
		...projectSerialized,
		status: audit,
	}
}
