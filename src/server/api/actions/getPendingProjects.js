import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectPendingKey } from 'root/src/server/api/lenses'
import { ascendingItemsCreated } from 'root/src/server/api/actionUtil/sortUtil'
import { sort } from 'ramda'

export default async payload => sort(
	ascendingItemsCreated,
	getProjectsByStatus(projectPendingKey, payload),
)
