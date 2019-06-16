export default (event, context, callback) => {
	const { request } = event.Records[0].cf
	const { headers } = request
	const isBr = headers['x-compression'] && headers['x-compression'][0].value === 'br'
	const gzipPath = '/gz'
	const brPath = '/br'

	request.uri = (isBr ? brPath : gzipPath) + request.uri
	callback(null, request)
}
