import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { descendingCreated, ascendingCreated } from 'root/src/server/api/actionUtil/sortUtil'
import { sort, prop } from 'ramda'

// const payload = {
// 	status: 'approved',
// 	payload: { currentPage: 1 },
// }

export default async payload => getProjectsByStatus(projectApprovedKey, payload)
	.then(projects => sort(ascendingCreated, projects))
