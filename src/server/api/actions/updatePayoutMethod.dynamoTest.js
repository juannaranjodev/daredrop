import { apiFn } from 'root/src/server/api'

import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'

import addPayoutMethodPayload from 'root/src/server/api/mocks/addPayoutMethodPayload'
import addPayoutMethod from 'root/src/server/api/actions/addPayoutMethod'

import { UPDATE_PAYOUT_METHOD } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'


describe('Update payout', () => {
	test('Updates newly added payout method', async () => {
		const payload = addPayoutMethodPayload()
		const newPayout = await addPayoutMethod({
			userId: mockUserId,
			payload,
		})

		const email = 'update@payout.com'
		const event = {
			endpointId: UPDATE_PAYOUT_METHOD,
			payload: {
				email,
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newPayout,
				email
			},
		})
	})
})
