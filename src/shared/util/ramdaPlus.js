import { curry, __, compose, isEmpty, without, toUpper, head, tail, concat, converge, split, length, reject, isNil } from 'ramda'

export const ternary = curry((bool, truth, faulty) => (bool ? truth : faulty))

export const orNull = ternary(__, __, null)

export const isSubset = compose(isEmpty, without)

export const capitalize = converge(concat, [compose(toUpper, head), tail])

export const stringLength = compose(length, split(''))

export const omitEmpty = reject(isNil, __)
