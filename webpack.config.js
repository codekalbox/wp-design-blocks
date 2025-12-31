const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		'section/index': path.resolve(process.cwd(), 'src/section', 'index.js'),
		'columns/index': path.resolve(process.cwd(), 'src/columns', 'index.js'),
		'column/index': path.resolve(process.cwd(), 'src/column', 'index.js'),
	},
};
