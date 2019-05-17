import { dissoc, assoc, compose, map, split, prop } from 'ramda'
import { SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

export default assignees => map(assignee => compose(
	dissoc('modified'),
	dissoc('sk'),
	dissoc('pk'),
	assoc('platform', prop(1, split('|', assignee[SORT_KEY]))),
	assoc('platformId', prop(2, split('|', assignee[SORT_KEY]))),
)(assignee), assignees)
