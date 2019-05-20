import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import projectDenormalizeFields from 'root/src/server/api/actionUtil/projectDenormalizeFields'

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
