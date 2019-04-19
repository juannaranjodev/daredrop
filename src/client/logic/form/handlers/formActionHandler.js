export default (handlerFn, moduleKey, handlerIndex) => (e) => {
	e.preventDefault()
	handlerFn(moduleKey, handlerIndex)
}
