import { reduce, prop } from 'ramda'
import { dynamoItemsProp, projectAcceptedKey } from 'root/src/server/api/lenses'
import { SORT_BY_NEWEST } from 'root/src/shared/constants/sortTypesOfProject'

export default async payload => getProjectsByStatus(projectAcceptedKey, SORT_BY_NEWEST, payload, false, false, true)
	.then(projects => {
		console.log(projects)
		const items = reduce(
			(result, projectDdb) => {
				const [project] = dynamoItemsProp(projectDdb)
				if (project) {
					return [...result, { id: project.pk, accepted: project.created }]
				}
				return result
			},
			[],
			prop('items', projects),
		)
		return { items }		
	})