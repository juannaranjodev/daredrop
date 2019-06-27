import { prop } from 'ramda'

export default assignee => `${prop('platform', assignee)}|${prop('platformId', assignee)}`
