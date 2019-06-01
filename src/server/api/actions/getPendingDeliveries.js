import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectDeliveryPendingKey } from 'root/src/server/api/lenses'
import { SORT_BY_CREATED_ASC } from 'root/src/shared/constants/sortTypesOfProject'

export default async payload => getProjectsByStatus(projectDeliveryPendingKey, SORT_BY_CREATED_ASC, payload, true, true)
