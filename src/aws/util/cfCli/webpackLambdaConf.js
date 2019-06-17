import ZipPlugin from 'zip-webpack-plugin'
import { map } from 'ramda'
import webpack from 'webpack'
import appConstants from 'root/src/shared/constants/app'

const env = process.env.stage || 'development'
const isProd = env === 'production'
const envVars = Object.assign(
	appConstants(env),
)

module.exports = {
	mode: env,
	devtool: isProd ? false : 'source-map',
	target: 'node',
	output: {
		libraryTarget: 'commonjs2',
	},
	externals: ['aws-sdk'],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env', 'stage-0'],
						plugins: ['package-name-import'],
					},
				},
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|css)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
				},
			},
		],
	},
	plugins: [
		new ZipPlugin({
			// pathPrefix: 'test',
		}),
		new webpack.DefinePlugin(
			map(JSON.stringify, envVars),
		),
	],
}
