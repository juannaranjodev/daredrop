import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import projectDenormalizeFields from 'root/src/server/api/actionUtil/projectDenormalizeFields'

export default (
	projectId, project, userId, pledgeAmount, stripeCardId, created = false,
) => {
	const data = {
		...projectDenormalizeFields(project),
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: `pledge|${userId}`,
		stripeCardId,
		...(created ? { created: true } : {}),
		pledgeAmount,
	}
	return data
}
