import { prop, propOr } from 'ramda'

export default (body, option) => ({
	id: `${propOr('', 'id', body)}-${prop('userId', body)}-${new Date().getTime()}`,
	name: prop('title', body),
	sku: prop('', 'id', body),
	price: prop('myPledge', body) || prop('pledgeAmount', body),
	category: option,
	quantity: '1',
})
