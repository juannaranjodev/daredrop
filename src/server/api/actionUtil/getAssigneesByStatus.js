import { filter, anyPass, propEq } from 'ramda'

export default (assignees, status) => {
 const acceptedPropEq = propEq('accepted')
 const statusKey = acceptedPropEq(status)
 return filter(anyPass([statusKey]), assignees)
}
