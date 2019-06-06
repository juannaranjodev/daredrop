import { apiFn } from 'root/src/server/api'

import { PLEDGE_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'

import createProject from 'root/src/server/api/actions/createProject'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'
import { internet } from 'faker'
import dynamoQueryProjectPledges from 'root/src/server/api/actionUtil/dynamoQueryProjectPledges'

describe('pledgeProject', () => {
	const projectPayload = createProjectPayload()
	let newProject
	test('successfully pledge a project', async () => {
		newProject = await createProject({
			userId: internet.userName(),
			payload: { ...projectPayload, status: projectApprovedKey },
		})
		const pledgeAmount = 20

		const event = {
			endpointId: PLEDGE_PROJECT,
			payload: {
				projectId: newProject.id,
				pledgeAmount,
				paymentInfo: {
					paymentType: 'stripeCard',
					paymentId: 'src_FBgaRgsyjOqOiz',
					paymentAmount: 20,
				},
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event)
		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newProject,
				pledgeAmount: newProject.pledgeAmount + pledgeAmount,
				myPledge: pledgeAmount,
				userId: mockUserId,
				pledgers: newProject.pledgers + 1,
			},
		})
	})

	test('another pledge to the same project', async () => {
		const pledgeAmount = 20
		const event = {
			endpointId: PLEDGE_PROJECT,
			payload: {
				projectId: newProject.id,
				pledgeAmount,
				paymentInfo: {
					paymentType: 'paypalAuthorize',
					paymentId: 'paypalAuthorization',
					paymentAmount: 20,
				},
			},
			authentication: mockUserId,
		}
		const res = await apiFn(event)

		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newProject,
				// Don't like the solution below, there is a better way for sure.
				pledgeAmount: newProject.pledgeAmount + (pledgeAmount * 2),
				pledgers: newProject.pledgers + 1,
				myPledge: pledgeAmount,
				userId: mockUserId,
			},
		})
	})

	test('project pledges are displayed properly', async () => {
		const pledges = await dynamoQueryProjectPledges(newProject.id)
		expect(pledges[1].paymentInfo[0]).toEqual({
			paymentAmount: 20,
			paymentId: 'chargeId',
			paymentType: 'stripeCard',
			captured: 0,
		})
		expect(pledges[1].paymentInfo[1]).toEqual({
			paymentAmount: 20,
			paymentId: 'paypalAuthorization',
			paymentType: 'paypalAuthorize',
			captured: 0,
		})
	})
})
