import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { projectToPayoutKey } from 'root/src/shared/descriptions/apiLenses'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getTimestamp from 'root/src/shared/util/getTimestamp'

export default async (projectToCapture, capturesAmount) => {
	const projectId = projectToCapture[PARTITION_KEY]

	const captureToWrite = [{
		PutRequest: {
			Item: {
				[PARTITION_KEY]: projectId,
				[SORT_KEY]: await generateUniqueSortKey(projectId, projectToPayoutKey, 1, 10),
				created: getTimestamp(),
				capturesAmount,
			},
		},
	},
	{
		DeleteRequest: {
			Key: {
				[PARTITION_KEY]: projectToCapture[PARTITION_KEY],
				[SORT_KEY]: projectToCapture[SORT_KEY],
			},
		},
	}]
	return captureToWrite
}
