import { documentClient } from 'root/src/server/api/dynamoClient'
import capturePaymentsWrite from 'root/src/server/api/actionUtil/capturePaymentsWrite'
import dynamoQueryProjectToCapture from 'root/src/server/api/actionUtil/dynamoQueryProjectToCapture'
import captureProjectPledges from 'root/src/server/api/actionUtil/captureProjectPledges'
import { generalError } from 'root/src/server/api/errors'

export default async ({ payload }) => {
	const { projectId } = payload
	const projectToCapture = await dynamoQueryProjectToCapture(projectId)

	const isCaptured = await captureProjectPledges(projectId)

	if (!isCaptured) {
		throw generalError('something gone wrong...')
	}
	const writeParams = await capturePaymentsWrite(projectToCapture)

	await documentClient.batchWrite(writeParams).promise()
	return { message: 'success' }
}
