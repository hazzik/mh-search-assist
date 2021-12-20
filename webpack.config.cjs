const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const package = require('./package.json');

module.exports = {
	devtool: 'source-map',
	mode: 'production',	
	plugins: [
		new CopyPlugin({
			patterns: [
            	{ 
					from: 'src/manifest.json',
					transform(content) {
						const manifest = JSON.parse(content.toString());
						manifest.version = package.version;
						return JSON.stringify(manifest);
					}
				},
				{
					from: "**/*",
          			context: path.resolve(__dirname, "src"),
					globOptions: {
						ignore: [ "**/*.js" ]
					}
				}
    	    ]
		})
	]
};
