// docker run --name dynamodb -p 9000:8000 amazon/dynamodb-local
import {
	merge, propOr, prop, head, values, compose, set, lensPath, map, dissoc,
} from 'ramda'

import apiTableConfig from 'root/src/aws/api/resources/apiDynamoDbTable'

jest.mock('root/src/server/api/dynamoClient', () => {
	/* eslint-disable global-require */
	const uuid = require('uuid/v1')
	const { DynamoDB } = require('aws-sdk')
	/* eslint-enable */
	const tableName = `TEST_TABLE_${uuid()}`
	const mockConfig = {
		endpoint: 'http://localhost:9000',
		accessKeyId: 'dynamo',
		secretAccessKey: 'devDummyKey',
		region: 'dev',
	}
	return {
		TABLE_NAME: tableName,
		dynamoDb: new DynamoDB(mockConfig),
		documentClient: new DynamoDB.DocumentClient(mockConfig),
	}
})

jest.mock('root/src/server/api/stripeClient', () => Promise.resolve({
	charges: {
		create: jest.fn(() => Promise.resolve({ id: 'chargeId' })),
	},
	customers: {
		list: jest.fn(() => Promise.resolve({
			data: [{
				id: 'customerId',
			}],
		})),
		create: jest.fn(() => Promise.resolve({
			id: 'customerId',
		})),
		createSource: jest.fn(() => Promise.resolve()),
	},
}))

jest.mock('root/src/server/api/actionUtil/validatePaypalAuthorize', () => () => true)

jest.mock('root/src/server/api/actionUtil/validateStripeSourceId', () => () => true)

jest.mock('root/src/server/api/twitchApi', () => {
	/* eslint-disable global-require */
	const { userData, gameData } = require('root/src/server/api/mocks/twitchApiMock')
	return {
		getUserData: jest.fn(() => Promise.resolve(userData)),
		getGameData: jest.fn(() => Promise.resolve(gameData)),
	}
})

jest.mock('root/src/server/api/s3Client', () => ({
	getSignedUrl: jest.fn(() => ('https://s3.aws.amazon.com/somepresignedUrl')),
	getObject: jest.fn(() => ({
		createReadStream: jest.fn(() => ('someReadStream')),
	})),
}))

jest.mock('root/src/server/api/googleClient', () => {
	/* eslint-disable global-require */
	const { insertVideoMock } = require('root/src/server/api/mocks/youtubeMock')
	return {
		__esModule: true,
		default: 'googleAuthMock',
		youtube: {
			videos: {
				insert: jest.fn(() => Promise.resolve(insertVideoMock)),
			},
		},
	}
})

jest.mock('root/src/server/api/paypalClient', () => ({
	execute: jest.fn(() => Promise.resolve({ statusCode: 200 })),
}))

jest.mock('root/src/server/api/actionUtil/getUserEmail', () => ({
	__esModule: true,
	default: jest.fn(() => Promise.resolve({ id: 'user@mail.com' })),
}))

jest.mock('root/src/server/email/actions/sendEmail', () => Promise.resolve('resolve'))

// Normally authentication is a JWT that gets decoded and returns a user id.
// For tests I'm mocking the authorizeRequest which does the jwt decoding and
// just returning whatever you put for authentication as the userId
jest.mock('root/src/server/api/authorizeRequest', () => (
	endpointId, authentication,
) => Promise.resolve(authentication))

const tableParams = tableName => merge(
	{ TableName: tableName },
	// Can't use BillingMode in the aws-sdk yet
	compose(
		dissoc('BillingMode'),
		set(lensPath(['GlobalSecondaryIndexes', 0, 'ProvisionedThroughput', 'ReadCapacityUnits']), 1),
		set(lensPath(['GlobalSecondaryIndexes', 0, 'ProvisionedThroughput', 'WriteCapacityUnits']), 1),
		set(lensPath(['ProvisionedThroughput', 'ReadCapacityUnits']), 1),
		set(lensPath(['ProvisionedThroughput', 'WriteCapacityUnits']), 1),
	)(prop('Properties', head(values(apiTableConfig)))),
)

const {
	TABLE_NAME, dynamoDb,
} = require('root/src/server/api/dynamoClient')

beforeAll(async () => {
	await dynamoDb.createTable(tableParams(TABLE_NAME)).promise()
})

const getTables = () => dynamoDb.listTables({}).promise().then(
	propOr([], 'TableNames'),
)

const deleteAllTables = tables => Promise.all(
	map(
		TableName => dynamoDb.deleteTable({ TableName }).promise(),
		tables,
	),
)

afterAll(async () => {
	// const tables = await getTables()
	// console.info(tables)
	// await deleteAllTables(tables)
	// const tablesGone = await getTables()
	// console.info(tablesGone)
	await dynamoDb.deleteTable({ TableName: TABLE_NAME }).promise()
})

jest.setTimeout(500000)
