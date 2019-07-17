import {
	ACCEPT_DARE_SUCCESS_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import bannerFooterImage from 'root/src/client/assets/Dare-accepted-3.jpg'
import { ACTIVE_PROJECTS_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'

export default {
	[ACCEPT_DARE_SUCCESS_MODULE_ID]: {
		moduleType: 'static',
		staticPageType: 'successPage',
		pageContent: {
			title: 'Success!',
			paragraphs: [
				`You’ve accepted the dare! Hype it up & tell your fans about it! We’ll email you when your goal has been reached. If time runs up, the project will expire - but you can give it another shot anytime.
				We’ll verify that you delivered & you’ll get paid.`
			],
			link: ACTIVE_PROJECTS_ROUTE_ID,
			linkLabel: 'Go to Marketplace',
			bannerFooterImage,
		},
	},
}
