import getProjectsByStatus from 'root/src/server/api/actionUtil/getProjectsByStatus'
import { projectVideoPendingKey } from 'root/src/server/api/lenses'

export default async payload => getProjectsByStatus(projectVideoPendingKey, payload)
