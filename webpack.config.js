const { map, filter, contains, replace } = require('ramda')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const BrotliGzipPlugin = require('brotli-gzip-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const EndWebpackPlugin = require('end-webpack-plugin')
const appConstants = require('./src/shared/constants/app')
const colorConstants = require('./src/shared/constants/color')
const logoConstant = require('./src/shared/constants/logo')

const stage = process.env.STAGE
// production is webpack production build with production variables
// staging is webpack production build with development variables
// development is webpack development build with development variables
const mode = (stage === 'staging' || stage === 'production') ? 'production' : 'development'
const env = stage || 'dev'

const isProd = mode === 'production'

const envVars = Object.assign(
	{ __sha__: process.env.CIRCLE_SHA1 || 'dev' },
	colorConstants,
	logoConstant,
	appConstants(env),
)

if (module.hot) {
	module.hot.accept()
}

module.exports = {
	mode,
	devtool: isProd ? false : 'source-map',
	entry: [
		'babel-polyfill',
		path.resolve(__dirname, 'src/client/web/app.js'),
	],
	output: {
		path: path.resolve(__dirname, 'dist/build-web-client'),
		filename: 'bundle.js',
		publicPath: '/',
	},
	devServer: {
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'src/client/web'),
		compress: true,
		host: '0.0.0.0',
		port: 8585,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env', 'stage-0', 'react'],
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
		new HtmlWebpackPlugin(Object.assign({
			template: path.resolve(__dirname, 'src/client/web/app.html'),
			hash: isProd,
		}, envVars)),
		// COPY STATICS
		new webpack.DefinePlugin(
			map(JSON.stringify, envVars),
		),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, './src/client/web/static/staticJs/'),
				to: '',
			},
		]),
		...(isProd ? [
			// CONSOLE LOGS REMOVE
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: {
						global_defs: {
							'@alert': 'console.log',
						},
						drop_console: true,
					},
				},
			}),
			// COMPRESSION THINGS
			new EndWebpackPlugin(async () => {
				const readdir = promisify(fs.readdir)
				const writeFile = promisify(fs.writeFile)
				const files = await readdir(path.resolve(__dirname, 'dist/build-web-client'))
				const nameContainsBr = contains('.br.')
				const brFiles = filter(nameContainsBr, files)
				const gzipFiles = map(replace('.br', ''), brFiles)
				const compressedFilenames = [...brFiles, ...gzipFiles]
				await writeFile(
					path.resolve(__dirname, 'src/server/edge/origin/webpackCompressedFilenames.js'),
					`export default ${JSON.stringify(compressedFilenames)}`,
				)
			}),
			new BrotliGzipPlugin({
				asset: '[fileWithoutExt].br.[ext][query]',
				algorithm: 'brotli',
				test: /\.(js|css|html|svg)$/,
				threshold: 10240,
				minRatio: 0.8,
			}),
			new BrotliGzipPlugin({
				asset: '[fileWithoutExt].[ext][query]',
				algorithm: 'gzip',
				test: /\.(js|css|html|svg)$/,
				threshold: 10240,
				minRatio: 0.8,
			}),
		] : []),
	],
	optimization: {
		minimizer: [new UglifyJsPlugin({
			sourceMap: true,
		})],
		...(isProd ? {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			},
		} : {}),
	},
}
