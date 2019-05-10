import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectDeliveryPendingKey } from 'root/src/server/api/lenses'
import { ascendingApproved } from 'root/src/server/api/actionUtil/sortUtil'

export default async payload => getProjectsByStatus(projectDeliveryPendingKey, ascendingApproved, payload)
