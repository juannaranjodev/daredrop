import {
	curry, __, compose, isEmpty, without, toUpper, head, tail, concat,
	converge, split, length, reject, isNil, propIs, unapply, apply, map, composeP,
} from 'ramda'

export const ternary = curry((bool, truth, faulty) => (bool ? truth : faulty))

export const orNull = ternary(__, __, null)

export const isSubset = compose(isEmpty, without)

export const capitalize = converge(concat, [compose(toUpper, head), tail])

export const stringLength = compose(length, split(''))

export const omitEmpty = reject(isNil, __)

const isPromise = propIs(Function, 'then')

const ensurePromise = result => (isPromise(result)
	? result
	: Promise.resolve(result))

const adapter = func => (...args) => ensurePromise(func(...args))

// compose everything (no matter if it returns a promise or not)
export const composeE = unapply(compose(
	apply(composeP),
	map(adapter),
))
