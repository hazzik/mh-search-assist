const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const pkg = require('./package.json');

module.exports = (env) => ({
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
						manifest.version = pkg.version;
						delete manifest.$schema;
						if (env.AMO_EXTENSION_ID) {
							manifest.browser_specific_settings = {
								...manifest.browser_specific_settings,
								gecko: { 
									...manifest.browser_specific_settings.gecko,
									id: env.AMO_EXTENSION_ID
								}
							};
						}
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
});
