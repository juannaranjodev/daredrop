import { apiFn } from 'root/src/server/api'

import { AUDIT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'

import createProject from 'root/src/server/api/actions/createProject'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'

import {
	projectApprovedKey,
	projectPendingKey,
	projectDeliveryPendingKey,
	projectVideoAcceptedKey,
	projectVideoRejectedKey,
	projectRejectedKey,
} from 'root/src/server/api/lenses'

describe('auditProject', () => {
	test('successfully approves a project', async () => {
		const newProject = await createProject({
			userId: mockUserId,
			payload: createProjectPayload(),
		})
		expect(newProject.status).toEqual(projectPendingKey)

		const event = {
			endpointId: AUDIT_PROJECT,
			payload: {
				projectId: newProject.id,
				audit: projectApprovedKey,
			},
		}
		const res = await apiFn(event)
		res.body.userId = mockUserId

		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newProject,
				status: projectApprovedKey,
			},
		})
	})
	test('successfully rejects a project', async () => {
		const newProject = await createProject({
			userId: mockUserId,
			payload: createProjectPayload(),
		})
		expect(newProject.status).toEqual(projectPendingKey)

		const event = {
			endpointId: AUDIT_PROJECT,
			payload: {
				projectId: newProject.id,
				audit: projectRejectedKey,
			},
		}
		const res = await apiFn(event)
		res.body.userId = mockUserId

		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newProject,
				status: projectRejectedKey,
			},
		})
	})
	test('successfully approves a project video', async () => {
		const newProject = await createProject({
			userId: mockUserId,
			payload: createProjectPayload(),
		})
		expect(newProject.status).toEqual(projectPendingKey)

		// for now mocking status because of lack of addVideo endpoint
		newProject.status = projectDeliveryPendingKey

		expect(newProject.status).toEqual(projectDeliveryPendingKey)
		const event = {
			endpointId: AUDIT_PROJECT,
			payload: {
				projectId: newProject.id,
				audit: projectVideoAcceptedKey,
			},
		}
		const res = await apiFn(event)
		res.body.userId = mockUserId

		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newProject,
				status: projectVideoAcceptedKey,
			},
		})
	})
	test('successfully rejects a project video', async () => {
		const newProject = await createProject({
			userId: mockUserId,
			payload: createProjectPayload(),
		})
		expect(newProject.status).toEqual(projectPendingKey)

		// for now mocking status because of lack of addVideo endpoint
		newProject.status = projectVideoPendingKey

		expect(newProject.status).toEqual(projectVideoPendingKey)
		const event = {
			endpointId: AUDIT_PROJECT,
			payload: {
				projectId: newProject.id,
				audit: projectVideoRejectedKey,
			},
		}
		const res = await apiFn(event)
		res.body.userId = mockUserId

		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newProject,
				status: projectVideoRejectedKey,
			},
		})
	})
})
