const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

/**
 * Custom webpack configuration for WP Design Blocks.
 * 
 * We use the default @wordpress/scripts configuration with minimal customization.
 * Block-specific scripts (edit, save, view) are handled automatically via block.json.
 */
module.exports = {
	...defaultConfig,
	// Add custom configuration only if absolutely necessary
	// Most cases should rely on @wordpress/scripts defaults
};

