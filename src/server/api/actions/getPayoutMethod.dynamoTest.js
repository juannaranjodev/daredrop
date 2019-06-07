import { map, range } from 'ramda'

import { apiFn } from 'root/src/server/api'

import wait from 'root/src/testUtil/wait'

import { GET_PAYOUT_METHOD } from 'root/src/shared/descriptions/endpoints/endpointIds'
import addPayoutMethodPayload from 'root/src/server/api/mocks/addPayoutMethodPayload'
import addPayoutMethod from 'root/src/server/api/actions/addPayoutMethod'

import { mockUserId } from 'root/src/server/api/mocks/contextMock'

describe('getPayoutMethod', () => {
	test('Successfully get payout method', async () => {
		const payload = addPayoutMethodPayload()
		await addPayoutMethod({
			userId: mockUserId,
			payload,
		})
		const event = {
			endpointId: GET_PAYOUT_METHOD,
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		expect(res.body.email).toEqual(payload.email)
	})
})
