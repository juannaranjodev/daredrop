
import { filter, gt, propEq, length } from 'ramda'

export default (tokensArr, token) => gt(length(filter(propEq('sk', `token-${token}`), tokensArr)), 0)
