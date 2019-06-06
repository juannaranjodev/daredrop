import { documentClient } from 'root/src/server/api/dynamoClient'
import capturePaymentsWrite from 'root/src/server/api/actionUtil/capturePaymentsWrite'
import dynamoQueryProjectToCapture from 'root/src/server/api/actionUtil/dynamoQueryProjectToCapture'
import captureProjectPledges from 'root/src/server/api/actionUtil/captureProjectPledges'

export default async ({ payload }) => {
	const { projectId } = payload
	const projectToCapture = await dynamoQueryProjectToCapture(projectId)

	await captureProjectPledges(projectId)

	const writeParams = await capturePaymentsWrite(projectToCapture)

	await documentClient.batchWrite(writeParams).promise()
	return { message: 'success' }
}
