import { split, last, compose } from 'ramda'

export default ({ 
	email,
	sk }) => ({
	method: compose(last, split('|'))(sk),
	email
})
