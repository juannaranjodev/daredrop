import { pick } from 'ramda'

export default project => pick([
	'title', 'description', 'pledgeAmount', 'games', 'favoritesAmount', 'pledgers', 'approved', 'assignees',
], project)
