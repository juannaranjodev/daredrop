import { prop, unnest, equals, not, length, gt, last, split, omit, map, compose } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'


const payloadLenses = getPayloadLenses(ACCEPT_PROJECT)
const { viewProjectId, viewMessage } = payloadLenses

export default async ({ payload, userId }) =>
// const projectId = viewProjectId(payload)
// const viewMessage = viewMessage(payload)

	({})
// return omit([PARTITION_KEY, SORT_KEY],
// 	{
// 		projectId: projectToAccept[PARTITION_KEY],
// 		...projectToAccept,
// 	})
