const { map } = require('ramda')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const appConstants = require('./src/shared/constants/app')
const colorConstants = require('./src/shared/constants/color')
const logoConstant = require('./src/shared/constants/logo')

// const env = slsConstants.env || 'dev'
const env = process.env.STAGE || 'development'
const isProd = env === 'production'
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
	mode: env,
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
		port: 8585,
	},
	// resolve: {
	// 	alias: {
	// 		react: 'preact-compat',
	// 		'react-dom': 'preact-compat',
	// 	},
	// },
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
		],
	},
	plugins: [
		new HtmlWebpackPlugin(Object.assign({
			template: path.resolve(__dirname, 'src/client/web/app.html'),
			hash: isProd,
			// inject: 'body',
			// minify: {
			// 	collapseWhitespace: true,
			// 	removeRedundantAttributes: true,
			// 	useShortDoctype: true,
			// },
		}, envVars)),
		new webpack.DefinePlugin(
			map(JSON.stringify, envVars),
		),
		// new CircularDependencyPlugin({
		// 	// exclude detection of files based on a RegExp
		// 	exclude: /node_modules/,
		// 	// add errors to webpack instead of warnings
		// 	failOnError: true,
		// 	// set the current working directory for displaying module paths
		// 	cwd: process.cwd(),
		// }),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, './src/client/web/static/staticJs/'),
				to: '',
			},
		]),
		(isProd
			? new CompressionPlugin({
				algorithm: 'gzip',
				test: /\.(js|css|html|svg)$/,
				threshold: 10240,
				minRatio: 0.8,
			})
			: () => ''),
		(isProd
			? new BrotliPlugin({
				asset: '[path].br[query]',
				test: /\.(js|css|html|svg)$/,
				threshold: 10240,
				minRatio: 0.8,
			})
			: () => ''),
	],
	optimization: {
		minimizer: [new UglifyJsPlugin({
			sourceMap: true,
		})],
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
}
