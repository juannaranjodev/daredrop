import { head, not } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { projectAcceptedKey } from 'root/src/server/api/lenses'

import isOneOfAssigneesSelector from 'root/src/server/api/actionUtil/isOneOfAssigneesSelector'

import getTimestamp from 'root/src/shared/util/getTimestamp'
import { DELIVERY_DARE_INIT } from 'root/src/shared/descriptions/endpoints/endpointIds'

const payloadLenses = getPayloadLenses(DELIVERY_DARE_INIT)
const { viewProjectId, viewAmountRequested, viewAssigneeId } = payloadLenses

const prnt = msg => console.log(JSON.stringify(msg, null, 2))


export default async ({ payload, userId }) => prnt({ payload, userId })
