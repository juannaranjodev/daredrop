import {
	REJECT_DARE_SUCCESS_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import bannerFooterImage from 'root/src/client/assets/Dare-reject-confirmation-page.jpg'
import { ACTIVE_PROJECTS_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'

export default {
	[REJECT_DARE_SUCCESS_MODULE_ID]: {
		moduleType: 'static',
		staticPageType: 'successPage',
		pageContent: {
			title: 'Dare Rejected',
			paragraphs: [
				`This Dare has been removed from the marketplace. 
				The Dare author and all pledgers will be notified.`
			],
			link: ACTIVE_PROJECTS_ROUTE_ID,
			linkLabel: 'Go to Marketplace',
			bannerFooterImage,
		},
	},
}
