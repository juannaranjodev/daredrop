export default 	(event) => {
	let posx = 0
	let posy = 0
	let eventObject = event

	if (!event) {
		eventObject = window.event
	}

	if (eventObject.pageX || eventObject.pageY) {
		posx = eventObject.pageX
		posy = eventObject.pageY
	} else if (eventObject.clientX || eventObject.clientY) {
		posx = eventObject.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft
		posy = eventObject.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop
	}

	return {
		x: posx,
		y: posy,
	}
}
