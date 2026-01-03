module.exports = {
	root: true,
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	rules: {
		// Add custom rules here if needed
		'jsdoc/require-param-description': 'off',
		'jsdoc/require-returns-description': 'off',
	},
};

