import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import { SORT_BY_NEWEST } from 'root/src/shared/constants/sortTypesOfProject'

export default payload => getProjectsByStatus(
	projectApprovedKey, SORT_BY_NEWEST, payload, { isDenormalized: true },
)
