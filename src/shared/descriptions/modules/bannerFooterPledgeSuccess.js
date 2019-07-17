import { BANNER_FOOTER_PLEDGE_SUCCESS_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'

import pledgeSuccess from 'root/src/client/assets/pledge-success1.jpg'

export default {
	[BANNER_FOOTER_PLEDGE_SUCCESS_MODULE_ID]: {
		moduleType: 'bannerFooter',
		bannerFooterImage: pledgeSuccess,
		isSuccessPage: true,
	},
}
