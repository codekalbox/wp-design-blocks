<?php
/**
 * Block registration and management.
 *
 * @package WP_Design_Blocks
 */

namespace WP_Design_Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register all blocks.
 *
 * @return void
 */
function register_blocks() {
	// Array of block names to register.
	$blocks = array(
		'section',
		'columns',
		'column',
	);

	foreach ( $blocks as $block ) {
		register_single_block( $block );
	}
}
add_action( 'init', __NAMESPACE__ . '\register_blocks' );

/**
 * Register a single block.
 *
 * @param string $block_name Block name (folder name in build/).
 *
 * @return void
 */
function register_single_block( $block_name ) {
	$block_path = WPDB_PATH . 'build/' . $block_name;

	// Check if block.json exists.
	if ( ! file_exists( $block_path . '/block.json' ) ) {
		return;
	}

	// Include block-specific PHP file if it exists.
	$block_php = WPDB_PATH . 'inc/blocks/' . $block_name . '.php';
	if ( file_exists( $block_php ) ) {
		require_once $block_php;
	}

	// Get render callback function if exists.
	$render_callback = null;
	$callback_function = __NAMESPACE__ . '\Blocks\render_' . str_replace( '-', '_', $block_name );
	
	if ( function_exists( $callback_function ) ) {
		$render_callback = $callback_function;
	}

	// Register block from metadata.
	$args = array();
	
	if ( $render_callback ) {
		$args['render_callback'] = $render_callback;
	}

	register_block_type_from_metadata( $block_path, $args );
}

/**
 * Enqueue shared frontend assets.
 *
 * Only loads when any of our blocks are present in content.
 *
 * @return void
 */
function enqueue_frontend_assets() {
	// Check if any of our blocks are in use.
	$has_blocks = false;
	$block_types = array( 'wp-design-blocks/section', 'wp-design-blocks/columns', 'wp-design-blocks/column' );

	foreach ( $block_types as $block_type ) {
		if ( has_block( $block_type ) ) {
			$has_blocks = true;
			break;
		}
	}

	if ( ! $has_blocks ) {
		return;
	}

	// Enqueue shared frontend styles if needed.
	$shared_css = WPDB_PATH . 'build/shared/frontend.css';
	if ( file_exists( $shared_css ) ) {
		wp_enqueue_style(
			'wp-design-blocks-frontend',
			WPDB_URL . 'build/shared/frontend.css',
			array(),
			filemtime( $shared_css )
		);
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_frontend_assets' );
