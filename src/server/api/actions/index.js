import {
	GET_PROJECT, CREATE_PROJECT, PLEDGE_PROJECT, GET_PLEDGED_PROJECTS,
	AUDIT_PROJECT, GET_ACTIVE_PROJECTS, GET_PENDING_PROJECTS, GET_OAUTH_TOKENS, ADD_OAUTH_TOKEN,
	UPDATE_PROJECT,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import getProject from 'root/src/server/api/actions/getProject'
import createProject from 'root/src/server/api/actions/createProject'
import pledgeProject from 'root/src/server/api/actions/pledgeProject'
import getPledgedProjects from 'root/src/server/api/actions/getPledgedProjects'
import auditProject from 'root/src/server/api/actions/auditProject'
import getActiveProjects from 'root/src/server/api/actions/getActiveProjects'
import getPendingProjects from 'root/src/server/api/actions/getPendingProjects'
import getOAuthTokens from 'root/src/server/api/actions/getOAuthTokens'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import updateProject from 'root/src/server/api/actions/updateProject'

export default {
	[CREATE_PROJECT]: createProject,
	[GET_PROJECT]: getProject,
	[UPDATE_PROJECT]: updateProject,

	[PLEDGE_PROJECT]: pledgeProject,
	[GET_PLEDGED_PROJECTS]: getPledgedProjects,

	[AUDIT_PROJECT]: auditProject,

	[GET_ACTIVE_PROJECTS]: getActiveProjects,
	[GET_PENDING_PROJECTS]: getPendingProjects,

	[GET_OAUTH_TOKENS]: getOAuthTokens,
	[ADD_OAUTH_TOKEN]: addOAuthToken,
}
