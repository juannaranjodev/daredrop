import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import projectDenormalizeFields from 'root/src/server/api/actionUtil/projectDenormalizeFields'

// @TODO here do something with this created, for now it's
// indicator that this the user who have created this dare

export default (
	projectId, project, userId, description, stripeCardId, created = false, title,
) => {
	const data = {
		...projectDenormalizeFields(project),
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: `description|${userId}`,
		stripeCardId,
		...(created ? { created: true } : {}),
		description,
		title,
	}
	return data
}
