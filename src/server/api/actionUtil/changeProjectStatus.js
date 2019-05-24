import { replace, prop } from 'ramda'

export default (keyBefore, keyAfter, project) => ({
	...project,
	sk: replace(keyBefore, keyAfter, prop('sk', project)),
})
