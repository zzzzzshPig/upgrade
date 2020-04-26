const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env = {}) => ({
	mode: env.prod ? 'production' : 'development',
	devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
	entry: path.resolve(__dirname, './src/main.js'),
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/'
	},
	resolve: {
		alias: {
			// this isn't technically needed, since the default `vue` entry for bundlers
			// is a simple `export * from '@vue/runtime-dom`. However having this
			// extra re-export somehow causes webpack to always invalidate the module
			// on the first HMR update and causes the page to reload.
			'vue': '@vue/runtime-dom'
		},
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader'
			},
			{
				test: /\.png$/,
				use: {
					loader: 'url-loader',
					options: {limit: 8192}
				}
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'vue-style-loader',
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'less-loader'
					}
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin(),
		new htmlWebpackPlugin({
			template: 'index.html'
		})
	],
	devServer: {
		hot: true,
		stats: 'minimal'
	}
})
