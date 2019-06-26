import { slice } from 'ramda'

export default (title) => {
	if (title.length > 32) {
		const newTitle = `${slice(0, 32, title)}...`
		return newTitle
	}
	return title
}
