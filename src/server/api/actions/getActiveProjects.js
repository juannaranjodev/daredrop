import {prop,sort,descend,ascend} from 'ramda'
import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import getFilteredProjects from 'root/src/server/api/actions/getFilteredProjects'

import {SORT_BY_NEWEST} from 'root/src/shared/constants/sortTypesOfProject'

export default async (payload) =>{
	const filteredProjects = await getFilteredProjects(payload)
	let sortType = prop("sortType",payload.payload)
	sortType = sortType ? sortType : SORT_BY_NEWEST
	return await getProjectsByStatus(projectApprovedKey, sortType, payload, filteredProjects)
}