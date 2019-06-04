import { forEach, toPairs } from 'ramda'
import { stringify } from 'qs'
import uploadProgress from 'root/src/client/logic/project/actions/uploadProgress'

export default ({
	url, method, body, queryParams, headers, file,
}, dispatch, state) => new Promise((resolve, reject) => {
	const queryString = queryParams
		? `?${stringify(queryParams, { indices: false })}` : ''
	const xhr = new XMLHttpRequest()
	const jsonBody = body ? JSON.stringify(body) : undefined
	const defaultMethod = method || 'GET'
	const defaultHeaders = {
		...headers,
		'Content-Type': headers['Content-Type'] || 'application/json',
	}
	xhr.open(defaultMethod, `${url}${queryString}`)
	forEach(
		([key, value]) => {
			xhr.setRequestHeader(key, value)
		},
		toPairs(defaultHeaders),
	)
	xhr.onload = () => {
		let parsed = xhr.response
		try {
			parsed = JSON.parse(parsed)
		} catch (e) {
			// response not json, leave parsed as text and continue
		}
		if (xhr.status >= 200 && xhr.status < 300) {
			resolve(parsed)
		} else {
			reject(parsed)
		}
	}
	xhr.onerror = () => {
		reject(new Error('Network Error'))
	}
	xhr.upload.addEventListener('progress', e => dispatch(uploadProgress(e)))
	if (file) {
		xhr.send(file)
	} else {
		xhr.send(jsonBody)
	}
})
