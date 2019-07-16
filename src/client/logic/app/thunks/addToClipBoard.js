import setVisibleSuccessMessage from 'root/src/client/logic/app/actions/setVisibleSuccessMessage'
import getCursorePosition from 'root/src/client/util/getCursorePosition'
import copy from 'copy-to-clipboard'

export default (url, event) => (dispatch) => {
	copy(url)
	const position = getCursorePosition(event)
	dispatch(setVisibleSuccessMessage(true, position, 'Copied!'))
	setTimeout(() => {
		dispatch(setVisibleSuccessMessage(false, { x: 0, y: 0 }, ''))
	}, 2500)
}
