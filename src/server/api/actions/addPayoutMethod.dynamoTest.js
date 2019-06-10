import { apiFn } from 'root/src/server/api'

import { ADD_PAYOUT_METHOD } from 'root/src/shared/descriptions/endpoints/endpointIds'

import addPayoutMethodPayload from 'root/src/server/api/mocks/addPayoutMethodPayload'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'

const payload = addPayoutMethodPayload()
const event = {
	endpointId: ADD_PAYOUT_METHOD,
	payload,
	authentication: mockUserId,
}

describe('addToPayout', () => {
	test('successfully add a payout method', async () => {
		const res = await apiFn(event)
		expect(res.statusCode).toEqual(200)
	})
})
