import { filter, propEq, map } from 'ramda'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryShardedItems from 'root/src/server/api/actionUtil/dynamoQueryShardedItems'
import { projectApprovedKey, projectDeliveredKey, projectDeliveryPendingKey } from 'root/src/shared/descriptions/apiLenses'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import streamVideoS3toYT from 'root/src/server/api/actionUtil/streamVideoS3toYT'

export default async () => {
	const deliveredProjects = await dynamoQueryShardedItems(`project|${projectDeliveredKey}`)
	const deliveryPendingProjects = await dynamoQueryShardedItems(`project|${projectDeliveryPendingKey}`)
	const deliveries = [...deliveredProjects, ...deliveryPendingProjects]

	const youTubeURLundefinedFilter = propEq('youTubeURL', undefined)
	const deliveriesWithoutVideo = filter(youTubeURLundefinedFilter, deliveries)

	const projects = await Promise.all(map(async (delivery) => {
		const [projectDdb, assigneesDdb] = await dynamoQueryProject(null, delivery.pk, projectApprovedKey)
		return {
			project: projectSerializer([
				...projectDdb,
				...assigneesDdb,
			]),
			delivery,
		}
	}, deliveriesWithoutVideo))

	return Promise.all(map(async ({ project, delivery }) => streamVideoS3toYT(project, delivery), projects))
}
