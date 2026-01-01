<?php
/**
 * Plugin Name: WP Design Blocks
 * Plugin URI:  https://example.com
 * Description: Custom Gutenberg blocks for advanced layout building.
 * Version:     1.0.0
 * Author:      MW. Studio
 * Text Domain: flexblocks
 * Requires at least: 6.0
 * Requires PHP:      7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


// Register Custom Block Category
function flexblocks_register_category( $categories, $post ) {
	return array_merge(
		$categories,
		array(
			array(
				'slug'  => 'wp-design-blocks',
				'title' => __( 'WP Design Blocks', 'flexblocks' ),
				'icon'  => 'layout',
			),
		)
	);
}
add_filter( 'block_categories_all', 'flexblocks_register_category', 10, 2 );

// Register Blocks
require_once plugin_dir_path( __FILE__ ) . 'includes/register-blocks.php';

function flexblocks_check_requirements() {
	global $wp_version;
	if ( version_compare( $wp_version, '6.0', '<' ) ) {
		add_action( 'admin_notices', function() {
			echo '<div class="notice notice-error" role="alert"><p>' . esc_html__( 'FlexBlocks Layout Builder requires WordPress 6.0 or higher.', 'flexblocks' ) . '</p></div>';
		} );
	}
    if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
        add_action( 'admin_notices', function() {
			echo '<div class="notice notice-error" role="alert"><p>' . esc_html__( 'FlexBlocks Layout Builder requires PHP 7.4 or higher.', 'flexblocks' ) . '</p></div>';
		} );
    }
}
add_action( 'admin_init', 'flexblocks_check_requirements' );

// Enqueue frontend scripts and styles
function flexblocks_enqueue_frontend_assets() {
    if ( has_block( 'flexblocks/section' ) || has_block( 'flexblocks/columns' ) || has_block( 'flexblocks/column' ) ) {
        wp_enqueue_script(
            'flexblocks-frontend',
            plugin_dir_url( __FILE__ ) . 'build/frontend.js',
            array(),
            '1.0.0',
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'flexblocks_enqueue_frontend_assets' );
