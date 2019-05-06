import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { descendingApproved } from 'root/src/server/api/actionUtil/sortUtil'

export default async payload => getProjectsByStatus(projectApprovedKey, descendingApproved, payload)
	.then(projects => projects)
