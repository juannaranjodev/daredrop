import reduxConnector from 'root/src/shared/util/reduxConnector'

import staticPageTypeSelector from 'root/src/client/logic/static/selectors/staticPageTypeSelector'
import pageContentSelector from 'root/src/client/logic/static/selectors/pageContentSelector'
import sharedUrlSelector from 'root/src/client/logic/static/selectors/sharedUrlSelector'

export default reduxConnector(
	[
		['staticPageType', staticPageTypeSelector],
		['sharedUrl', sharedUrlSelector],
		['pageContent', pageContentSelector],
	],
)
