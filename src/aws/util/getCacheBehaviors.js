import { reduce } from 'ramda'

export default (paths, behavior) => reduce(
	(results, path) => [...results, { ...behavior, PathPattern: `*.${path}` }], [], paths,
)
