import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectPendingKey } from 'root/src/server/api/lenses'
import { ascendingCreated } from 'root/src/server/api/actionUtil/sortUtil'
import { sort, prop, assoc } from 'ramda'

export default async payload => getProjectsByStatus(projectPendingKey, payload)
	.then(projects => assoc('items', sort(ascendingCreated, prop('items', projects)), projects))
