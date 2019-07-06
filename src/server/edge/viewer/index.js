export default (event, context, callback) => {
	try {
		const { request } = event.Records[0].cf
		const { headers } = request
		console.log(JSON.stringify(request, null, 2))
		if (headers['accept-encoding'] && headers['accept-encoding'][0].value.indexOf('br') > -1) {
			headers['x-compression'] = [{
				key: 'X-Compression',
				value: 'br',
			}]
		}
		callback(null, request)
	} catch (error) {
		console.log(error)
	}
}
