import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { descendingCreated } from 'root/src/server/api/actionUtil/sortUtil'
import { sort, prop, assoc } from 'ramda'

export default async payload => getProjectsByStatus(projectApprovedKey, payload)
	.then(projects => assoc('items', sort(descendingCreated, prop('items', projects)), projects))
