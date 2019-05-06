import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectPendingKey } from 'root/src/server/api/lenses'
import { ascendingCreated } from 'root/src/server/api/actionUtil/sortUtil'
import { sort, prop, assoc } from 'ramda'

export default async payload => getProjectsByStatus(projectPendingKey,ascendingCreated, payload)
	.then(projects => projects)
