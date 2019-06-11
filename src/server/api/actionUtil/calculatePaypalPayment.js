import { path } from 'ramda'

export default authorization => (
	path(['amount', 'total'], authorization) - path(['transaction_fee', 'value'], authorization))
