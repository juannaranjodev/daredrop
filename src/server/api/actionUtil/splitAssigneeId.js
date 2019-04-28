import { head, split, last } from 'ramda'

export default (token) => {
	const assigneeId = split('-', token)
	const tokenArr = split('|', last(assigneeId))
	return {
		platform: head(tokenArr),
		platformId: last(tokenArr),
	}
}
