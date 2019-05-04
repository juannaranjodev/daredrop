import getEndpointIdFromModules from 'root/src/client/logic/route/util/getEndpointIdFromModules'
import {
	PENDING_PROJECTS_LIST_MODULE_ID,
	ACTIVE_PROJECTS_LIST_MODULE_ID,
	FAVORITES_PROJECTS_LIST_MODULE_ID,
	MY_PROJECTS_LIST_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import {
	GET_ACTIVE_PROJECTS,
	GET_PENDING_PROJECTS,
	GET_FAVORITES_LIST,
	GET_MY_PROJECTS,
	GET_PLEDGED_PROJECTS,
	GET_ACCEPTED_PROJECTS,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

test('returns correct endpointId from module', () => {
	// currently if this test fails look into implementation of root/src/client/logic/route/util/getCurrentModuleId.js
	// which takes last element of an array and sets it as an endpoint id for current module
	expect(getEndpointIdFromModules(PENDING_PROJECTS_LIST_MODULE_ID)).toEqual([GET_PENDING_PROJECTS, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS])
	expect(getEndpointIdFromModules(ACTIVE_PROJECTS_LIST_MODULE_ID)).toEqual([GET_ACTIVE_PROJECTS, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS])
	expect(getEndpointIdFromModules(FAVORITES_PROJECTS_LIST_MODULE_ID)).toEqual([GET_FAVORITES_LIST, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS])
	expect(getEndpointIdFromModules(MY_PROJECTS_LIST_MODULE_ID)).toEqual([GET_MY_PROJECTS, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS])
})
