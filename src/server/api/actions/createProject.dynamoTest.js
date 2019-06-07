import { apiFn } from 'root/src/server/api'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { CREATE_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import dynamoQueryProjectPledges from 'root/src/server/api/actionUtil/dynamoQueryProjectPledges'

const scanTable = () => {
	const params = {
		TableName: TABLE_NAME,
	}
	return documentClient.scan(params).promise()
}

const event = {
	endpointId: CREATE_PROJECT,
	payload: createProjectPayload(),
	authentication: mockUserId,
}

describe('createProject', () => {
	test('createProject', async () => {
		const res = await apiFn(event)
		// const tableScan = await scanTable()
		// This fails to create the right filter for the test
		// const card = tableScan.Items.filter(item => item.pk === res.body.id);

		expect(res.statusCode).toEqual(200)
		const projectPledges = await dynamoQueryProjectPledges(res.body.id)
		expect(projectPledges[0].paymentInfo[0]).toEqual({
			paymentAmount: res.body.pledgeAmount,
			paymentId: 'src_FBgaRgsyjOqOiz',
			paymentType: 'paypalAuthorize',
			captured: 0,
		})
	})
})
