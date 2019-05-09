import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { descendingApproved } from 'root/src/server/api/actionUtil/sortUtil'
import getFilteredProjects from 'root/src/server/api/actions/getFilteredProjects'

export default async (payload) =>{
	const filteredProjects = await getFilteredProjects(payload)

	return await getProjectsByStatus(projectApprovedKey, descendingApproved, payload, filteredProjects)
}