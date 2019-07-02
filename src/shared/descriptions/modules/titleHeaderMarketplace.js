import {
	TITLE_HEADER_MARKETPLACE_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import { GET_ACTIVE_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { SORT_BY_BOUNTY, SORT_BY_NEWEST, SORT_BY_TIME_LEFT } from 'root/src/shared/constants/sortTypesOfProject'
import {
	CREATE_PROJECT_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

export default {
	[TITLE_HEADER_MARKETPLACE_MODULE_ID]: {
		moduleType: 'bannerHeader',
		bannerSubText: 'Active Dares',
		createNewDareActive: true,
		link: {
			routeId: CREATE_PROJECT_ROUTE_ID,
			label: 'Create a New Dare +',
		},
		embededContent: {
			moduleType: 'embededForm',
			fields: [
				{
					fieldId: 'sort',
					fieldCaption: 'Sort By:',
					inputType: 'dropdownEmbeded',
					options: [
						{
							label: 'Newest',
							id: 0,
							value: SORT_BY_NEWEST,
						},
						{
							label: 'Bounty Amount',
							id: 1,
							value: SORT_BY_BOUNTY,
						},
						{
							label: 'Time Left',
							id: 2,
							value: SORT_BY_TIME_LEFT,
						},
					],
					default: {
						label: 'Newest',
						id: 0,
						value: SORT_BY_NEWEST,
					},
					endpointId: GET_ACTIVE_PROJECTS,
				},
				{
					fieldId: 'game|twitch',
					fieldCaption: 'Filter By:',
					inputType: 'autoCompleteEmbeded',
					optionsPromiseType: 'twitchGames',
					placeholder: 'Game',
					endpointId: GET_ACTIVE_PROJECTS,
				},
				{
					fieldId: 'assignee|twitch',
					inputType: 'autoCompleteEmbeded',
					optionsPromiseType: 'twitchChannels',
					placeholder: 'Streamer',
					endpointId: GET_ACTIVE_PROJECTS,
				},
			],
		},
	},
}
