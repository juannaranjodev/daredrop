import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectDeliveryPendingKey } from 'root/src/shared/descriptions/apiLenses'
import { SORT_BY_CREATED_ASC } from 'root/src/shared/constants/sortTypesOfProject'

export default async payload => getProjectsByStatus(
	projectDeliveryPendingKey,
	SORT_BY_CREATED_ASC,
	payload,
	{
		isAdminEndpoint: true,
		noExpirationFilter: true,
	},
)
