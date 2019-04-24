import { filter, propEq, not, isEmpty, compose } from 'ramda'

export default (displayName, assigneesArr) => compose(not, isEmpty, filter(propEq('displayName', displayName)))(assigneesArr)
