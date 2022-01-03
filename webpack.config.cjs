const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const package = require('./package.json');

module.exports = {
	devtool: 'source-map',
	mode: 'production',
	entry: {
		main: [
			'./src/index.js',
			'./src/index.css'
		]
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'src/manifest.json',
					transform(content) {
						const manifest = JSON.parse(content.toString());
						manifest.version = package.version;
						return JSON.stringify(manifest);
					}
				}
			]
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: 'asset/inline',
			},
		],
	},
	optimization: {
		minimizer: [
			new CssMinimizerPlugin(),
		],
	},
};
