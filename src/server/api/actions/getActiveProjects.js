import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { descendingApproved } from 'root/src/server/api/actionUtil/sortUtil'
import getFilteredProjects from 'root/src/server/api/actions/getFilteredProjects'
// export default async payload => getProjectsByStatus(projectApprovedKey, descendingApproved, payload)
// 	.then(projects => projects)
export default async (payload) =>{
	const filteredProjects = await getFilteredProjects(payload)
	const projects = await getProjectsByStatus(projectApprovedKey, descendingApproved, payload, filteredProjects)
	return projects
}