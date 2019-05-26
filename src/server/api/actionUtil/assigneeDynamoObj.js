import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { compose, dissoc, prop } from 'ramda'

export default (
	assignee, projectId,
) => compose(
	dissoc('platform'),
	dissoc('platformId'),
)({
	...assignee,
	[PARTITION_KEY]: projectId,
	[SORT_KEY]: `assignee|${prop('platform', assignee)}|${prop('platformId', assignee)}`,
})
