<?php
/**
 * Plugin Name: wp-dsgn-blocks
 * Description: Phase 1 development of a production-ready block system.
 * Version: 1.0.0
 * Author: Onward
 * Text Domain: wp-dsgn-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function wp_dsgn_blocks_register_blocks() {
	register_block_type( __DIR__ . '/build/blocks/section' );
	register_block_type( __DIR__ . '/build/blocks/column' );
}
add_action( 'init', 'wp_dsgn_blocks_register_blocks' );
