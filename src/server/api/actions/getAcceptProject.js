import { reduce, prop } from 'ramda'
import { projectAcceptedKey } from 'root/src/server/api/lenses'
import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { SORT_BY_NEWEST } from 'root/src/shared/constants/sortTypesOfProject'

export default async (payload) => getProjectsByStatus(projectAcceptedKey, SORT_BY_NEWEST, payload, false, false, false)
	.then(projects => {
		const items = reduce(
			(result, project) => {
				if (project) {
					return [...result, { id: project.id, accepted: project.created }]
				}
				return result
			},
			[],
			prop('items', projects),
		)		
		return { items }		
	})
