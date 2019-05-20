import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import projectDenormalizeFields from 'root/src/server/api/actionUtil/projectDenormalizeFields'

export default (
	projectId, project, userId, favoritesAmount, favoritesCreatedAt,
) => {
	const data = {
		...projectDenormalizeFields(project),
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: `favorites|${userId}`,
		favoritesCreatedAt,
		favoritesAmount,
	}

	return data
}
