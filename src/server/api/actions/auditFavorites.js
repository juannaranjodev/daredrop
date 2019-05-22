import { head, add } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import favoritesDynamoObj from 'root/src/server/api/actionUtil/favoritesDynamoObj'
import { generalError } from 'root/src/server/api/errors'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryFavorites from 'root/src/server/api/actionUtil/dynamoQueryFavorites'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import moment from 'moment'

export default async ({ userId, payload }) => {
	const { projectId } = payload
	const [
		projectToFavoritesDdb, assigneesDdb,
	] = await dynamoQueryProject(
		userId, projectId,
	)

	const projectToFavorites = head(projectToFavoritesDdb)
	if (!projectToFavorites) {
		throw generalError('Project doesn\'t exist')
	}

	const myFavoritesObj = await dynamoQueryFavorites(projectId, userId)

	const favoritesCreatedAt = moment().format()

	let { favoritesAmount } = projectToFavorites
	let newFavorites
	let newFavoritesToRemove
	let myFavorites

	if (myFavoritesObj) {
		myFavorites = 0
		newFavorites = favoritesDynamoObj(
			projectId, projectToFavorites, userId, myFavorites, favoritesCreatedAt, true,
		)
		newFavoritesToRemove = favoritesDynamoObj(
			projectId, projectToFavorites, userId, myFavorites, favoritesCreatedAt,
		)
		favoritesAmount = add(favoritesAmount, -1)
	} else {
		myFavorites = 1
		newFavoritesToRemove = favoritesDynamoObj(
			projectId, projectToFavorites, userId, myFavorites, favoritesCreatedAt, true,
		)
		newFavorites = favoritesDynamoObj(
			projectId, projectToFavorites, userId, myFavorites, favoritesCreatedAt,
		)
		favoritesAmount = add(favoritesAmount, 1)
	}

	const updateProjectParams = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					PutRequest: {
						Item: {
							...projectToFavorites,
							favoritesAmount,
						},
					},
				},
				{
					PutRequest: {
						Item: newFavorites,
					},
				},
				{
					DeleteRequest: {
						Key: {
							[PARTITION_KEY]: newFavoritesToRemove[PARTITION_KEY],
							[SORT_KEY]: newFavoritesToRemove[SORT_KEY],
						},
					},
				},
			],
		},
	}

	await documentClient.batchWrite(updateProjectParams).promise()

	const newProject = projectSerializer([
		...projectToFavoritesDdb,
		...assigneesDdb,
	])

	return {
		...newProject,
		favoritesAmount,
		myFavorites,
	}
}
