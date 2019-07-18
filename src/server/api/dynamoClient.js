import { DynamoDB } from 'aws-sdk'

export const TABLE_NAME = process.env.STAGE === 'testing' ? process.env.PERFORMANCE_TEST_DYNAMODB_TABLE : process.env.API_DYNAMO_DB_TABLE
export const ARCHIVAL_TABLE_NAME = process.env.STAGE === 'testing' ? process.env.PERFORMANCE_TEST_DYNAMODB_ARCHIVAL_TABLE : process.env.API_DYNAMO_DB_ARCHIVAL_TABLE

export const dynamoDb = new DynamoDB()
export const documentClient = new DynamoDB.DocumentClient()
