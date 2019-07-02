import { PERFORMANCE_TEST_DYNAMODB_TABLE } from 'root/src/aws/api/resourceIds'

export default {
	[PERFORMANCE_TEST_DYNAMODB_TABLE]: {
		Type: 'AWS::DynamoDB::Table',
		Properties: {
			AttributeDefinitions: [
				{
					AttributeName: 'testId',
					AttributeType: 'S',
				},
				{
					AttributeName: 'iteration',
					AttributeType: 'N',
				},
			],
			KeySchema: [
				{
					AttributeName: 'testId',
					KeyType: 'HASH',
				},
				{
					AttributeName: 'iteration',
					KeyType: 'RANGE',
				},
			],
			BillingMode: 'PAY_PER_REQUEST',
		},
	},
}
