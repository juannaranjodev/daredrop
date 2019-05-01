import { projectAcceptedKey } from 'root/src/server/api/lenses'
import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { map, prop } from 'ramda'
import getActiveProjectsByIds from 'root/src/server/api/actionUtil/getActiveProjectsByIds'

export default async (payload) => {
	const acceptedProjects = await getProjectsByStatus(projectAcceptedKey, payload)
	const projectIds = map(prop('id'), prop('items', acceptedProjects))

	const activeProjects = await getActiveProjectsByIds(projectIds)
	return { items: activeProjects }
}
