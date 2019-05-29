import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import projectDenormalizeFields from 'root/src/server/api/actionUtil/projectDenormalizeFields'

export default (
	projectId, project, userId, created = false,
) => {
	const data = {
		...projectDenormalizeFields(project),
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: `pledge|${userId}`,
		paymentInfo: [],
		...(created ? { created: true } : {}),
		pledgeAmount: 0,
	}
	return data
}
