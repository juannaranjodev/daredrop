import {
	MY_PROJECT_BANNER_HEADER_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import { GET_MY_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
	CREATE_PROJECT_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

import myprojects from 'root/src/client/assets/my-projects.jpg'
import { projectDeliveredKey } from 'root/src/server/api/lenses'
import { myTwitchId, myUserId } from 'root/src/shared/constants/filterConstants'

export default {
	[MY_PROJECT_BANNER_HEADER_MODULE_ID]: {
		moduleType: 'bannerHeader',
		bannerImage: myprojects,
		bannerImageText: 'Your Dares',
		bannerImageSubText: 'Keep track of your Dares, Pledges, and Videos',
		textWithBg: true,
		bannerSubText: 'Select a Dare',
		link: {
			routeId: CREATE_PROJECT_ROUTE_ID,
			label: 'Create a new Dare +',
		},
		createNewDareActive: true,
		embeddedContent: {
			moduleType: 'embeddedForm',
			fields: [
				{
					fieldId: 'filter',
					inputType: 'dropdownEmbedded',
					options: [
						{
							label: 'All',
							id: 0,
						},
						{
							label: 'Dares for Me',
							id: 1,
							payload: {
								param: 'assignee',
								value: myTwitchId,
							},
						},
						{
							label: 'Delivered',
							id: 2,
							payload: {
								param: 'project',
								value: projectDeliveredKey,
							},
						},
						{
							label: 'My Favorites',
							id: 3,
							payload: {
								param: 'favorites',
								value: myUserId,
							},
						},
						{
							label: 'My Pledges',
							id: 4,
							payload: {
								param: 'pledge',
								value: myUserId,
							},
						},
					],
					default: {
						label: 'All',
						id: 0,
						payload: {},
					},
					endpointId: GET_MY_PROJECTS,
				},
			],
		},
	},
}
