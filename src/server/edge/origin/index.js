import { replace, compose, contains, slice } from 'ramda'
import webpackCompressedFilenames from 'root/src/server/edge/origin/webpackCompressedFilenames'

const gzipPath = uri => uri
const brPath = (uri) => {
	const uriName = slice(1, Infinity, uri)
	if (!contains(uriName, webpackCompressedFilenames)) {
		return uri
	}
	const uriCompressed = compose(
		replace(/(\.js)/, '.br.js'), replace(/(\.css)/, '.br.css'),
		replace(/(\.svg)/, '.br.svg'), replace(/(\.html)/, '.br.html'),
	)(uriName)
	return `/${uriCompressed}`
}

export default (event, context, callback) => {
	const { request } = event.Records[0].cf
	const { headers } = request
	const isBr = headers['x-compression'] && headers['x-compression'][0].value === 'br'
	request.uri = (isBr ? brPath(request.uri) : gzipPath(request.uri))
	callback(null, request)
}
