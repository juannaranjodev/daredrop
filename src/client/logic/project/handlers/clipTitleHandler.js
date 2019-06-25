import { slice } from 'ramda'

export default (title) => {
	if (title.length > 42) {
		const newTitle = `${slice(0, 42, title)}...`
		return newTitle
	}
	return title
}
