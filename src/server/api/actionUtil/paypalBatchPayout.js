import paypalClient from 'root/src/server/api/paypalClient'
import { map, path, prop, head } from 'ramda'
import { generalError } from 'root/src/server/api/errors'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import { projectApprovedKey } from 'root/src/shared/descriptions/apiLenses'

export default async (payoutObj, payoutsArr) => new Promise(async (resolve, reject) => {
	const ppClientAuthorized = await paypalClient

	const projectId = prop('pk', payoutObj)
	const [projectDdb] = await dynamoQueryProject(null, projectId, projectApprovedKey)
	const project = head(projectDdb)

	const createPayout = {
		sender_batch_header: {
			sender_batch_id: projectId,
			email_subject: prop('title', project),
		},
		items: map(({ payout, email }) => ({
			recipient_type: 'EMAIL',
			amount: {
				value: payout,
				currency: 'USD',
			},
			receiver: email,
		}), payoutsArr),
	}

	ppClientAuthorized.payout.create(createPayout, true, async (error, payout) => {
		if (error) {
			const errMessage = path(['response', 'message'], error)
			const statusCode = path(['response', 'httpStatusCode'], error)
			const errDetails = path(['response', 'details'], error)

			await documentClient.put({
				TableName: TABLE_NAME,
				Item: {
					...payoutObj,
					errMessage,
					statusCode,
					errDetails,
				},
			}).promise()

			reject(generalError({ errMessage, statusCode }))
		}
		resolve(payout)
	})
})
