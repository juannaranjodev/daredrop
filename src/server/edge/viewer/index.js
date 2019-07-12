export default (event, context, callback) => {
	const { request } = event.Records[0].cf
	const { headers } = request
	if (headers['accept-encoding'] && headers['accept-encoding'][0].value.indexOf('br') > -1) {
		headers['x-compression'] = [{
			key: 'X-Compression',
			value: 'br',
		}]
	}
	callback(null, request)
}
