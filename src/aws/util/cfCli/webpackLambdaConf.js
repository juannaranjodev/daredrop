import ZipPlugin from 'zip-webpack-plugin'
import { map } from 'ramda'
import webpack from 'webpack'
import appConstants from 'root/src/shared/constants/app'

const stage = process.env.STAGE
// production is webpack production build with production variables
// staging is webpack production build with development variables
// development is webpack development build with development variables
const mode = (stage === 'staging' || stage === 'production') ? 'production' : 'development'
const env = stage || 'dev'
const isProd = mode === 'production'
const envVars = Object.assign(
	appConstants(env),
)

module.exports = {
	mode,
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
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'webpack-conditional-loader',
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
