import webConfig from 'root/webpack.config'
import webpack from 'webpack'

export default () => new Promise((resolve, reject) => (
	webpack(
		webConfig,
		(err, stats) => {
			if (err || stats.hasErrors()) {
				reject(err)
			}
			resolve()
		},
	)
))
