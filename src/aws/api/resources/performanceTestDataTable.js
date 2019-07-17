import tableTemplate from 'root/src/aws/api/resources/common/apiDynamoDbCommon'

import { PERFORMANCE_TEST_DYNAMODB_DATA_TABLE } from 'root/src/aws/api/resourceIds'

export default {
	[PERFORMANCE_TEST_DYNAMODB_DATA_TABLE]: tableTemplate,
}
