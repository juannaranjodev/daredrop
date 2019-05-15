import { dissoc, assoc, compose, map } from 'ramda'
import { SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

export default assignees => map(assignee => compose(
	dissoc('modified'),
	dissoc('sk'),
	dissoc('pk'),
	assoc('platform', assignee[SORT_KEY].split('|')[1]),
	assoc('platformId', assignee[SORT_KEY].split('|')[2]),
)(assignee), assignees)
