import { map, prop, assoc, pick } from 'ramda'
import { projectAcceptedKey } from 'root/src/shared/descriptions/apiLenses'
import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { SORT_BY_NEWEST } from 'root/src/shared/constants/sortTypesOfProject'

export default async payload => assoc('items', map(pick(['id']), prop('items', await getProjectsByStatus(projectAcceptedKey, SORT_BY_NEWEST, payload, false, false, false, true))), {})
