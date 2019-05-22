import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import { ternary } from 'root/src/shared/util/ramdaPlus'

export default (
	projectId, project, userId, myFavorites, created, removingFromFavorites,
) => {
	const data = {
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: ternary(removingFromFavorites, `archival-favorites|${userId}`, `favorites|${userId}`),
		created,
		myFavorites,
	}

	return data
}
