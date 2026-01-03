<?php
/**
 * Asset management and enqueuing.
 *
 * @package WP_Design_Blocks
 */

namespace WP_Design_Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Setup script translations.
 *
 * @return void
 */
function setup_script_translations() {
	// Set script translations for all block scripts.
	$blocks = array( 'section', 'columns', 'column' );

	foreach ( $blocks as $block ) {
		$handle = 'wp-design-blocks-' . $block . '-editor-script';
		
		if ( wp_script_is( $handle, 'registered' ) ) {
			wp_set_script_translations(
				$handle,
				'wp-design-blocks',
				WPDB_PATH . 'languages'
			);
		}
	}
}
add_action( 'init', __NAMESPACE__ . '\setup_script_translations', 20 );

/**
 * Add editor assets.
 *
 * @return void
 */
function enqueue_editor_assets() {
	// Enqueue shared editor styles if needed.
	$editor_css = WPDB_PATH . 'build/shared/editor.css';
	if ( file_exists( $editor_css ) ) {
		wp_enqueue_style(
			'wp-design-blocks-editor',
			WPDB_URL . 'build/shared/editor.css',
			array( 'wp-edit-blocks' ),
			filemtime( $editor_css )
		);
	}
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_assets' );

/**
 * Add inline CSS for responsive breakpoints.
 *
 * This ensures our blocks have consistent breakpoint behavior.
 *
 * @return void
 */
function add_responsive_breakpoints() {
	$css = '
		:root {
			--wpdb-breakpoint-tablet: 1024px;
			--wpdb-breakpoint-mobile: 768px;
		}
	';

	wp_add_inline_style( 'wp-block-library', $css );
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\add_responsive_breakpoints' );
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\add_responsive_breakpoints' );
