import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import projectDenormalizeFields from 'root/src/server/api/actionUtil/projectDenormalizeFields'
import getTimestamp from 'root/src/shared/util/getTimestamp'

export default (
	projectId, project, userId, createdBy = false,
) => {
	const data = {
		...projectDenormalizeFields(project),
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: `pledge|${userId}`,
		paymentInfo: [],
		...(createdBy ? { createdBy: true } : {}),
		created: getTimestamp(),
		pledgeAmount: 0,
	}
	return data
}
