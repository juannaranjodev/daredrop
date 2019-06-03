import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { SORT_BY_NEWEST } from 'root/src/shared/constants/sortTypesOfProject'

export default async payload => getProjectsByStatus(projectApprovedKey, SORT_BY_NEWEST, payload, false, false, true)
	.then(projects => projects)
