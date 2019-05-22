import { omit } from 'ramda'

export default (arg1, arg2) => expect(omit(['created', 'approved'], arg1)).toEqual(omit(['created', 'approved'], arg2))
