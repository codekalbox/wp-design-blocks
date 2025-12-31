<?php
/**
 * Plugin Name: FlexBlocks Layout Builder
 * Plugin URI:  https://example.com
 * Description: Custom Gutenberg blocks for advanced layout building.
 * Version:     1.0.0
 * Author:      FlexBlocks
 * Text Domain: flexblocks
 * Requires at least: 6.0
 * Requires PHP:      7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Register Blocks
require_once plugin_dir_path( __FILE__ ) . 'includes/register-blocks.php';
