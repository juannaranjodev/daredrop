import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { projectCapturedKey } from 'root/src/server/api/lenses'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'

export default async (projectToCapture) => {
	const projectId = projectToCapture[PARTITION_KEY]
	const captureToWrite = [{
		PutRequest: {
			Item: {
				[PARTITION_KEY]: projectId,
				[SORT_KEY]: await generateUniqueSortKey(projectId, projectCapturedKey, 1, 10),
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
