import { isNil, equals } from 'ramda'
import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/server/api/getEndpointDesc'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import moment from 'moment'

const responseLenses = getResponseLenses(GET_PROJECT)
const { viewApproved } = responseLenses
const { viewStatus } = responseLenses

export default (state, props) => {
	const approved = viewApproved(
		getRecordSelector(state, props),
	)

	const status = viewStatus(
		getRecordSelector(state, props),
	)

	if (equals(status, projectApprovedKey)) {
		if (isNil(approved)) {
			return '-'
		} else {
			const diff = moment().diff(approved, 'days')
			return `${30 - diff}`
		}
	} else {
		return '-'
	}
}
