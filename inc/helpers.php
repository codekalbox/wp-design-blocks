<?php
/**
 * Helper functions for WP Design Blocks.
 *
 * @package WP_Design_Blocks
 */

namespace WP_Design_Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get responsive value from attribute.
 *
 * @param array  $attribute Attribute array with responsive values.
 * @param string $device    Device type (desktop, tablet, mobile).
 * @param string $property  Property to get (e.g., 'value', 'unit').
 * @param mixed  $default   Default value if not found.
 *
 * @return mixed Property value or default.
 */
function get_responsive_value( $attribute, $device = 'desktop', $property = 'value', $default = null ) {
	if ( ! is_array( $attribute ) || ! isset( $attribute[ $device ] ) ) {
		return $default;
	}

	if ( ! isset( $attribute[ $device ][ $property ] ) ) {
		return $default;
	}

	return $attribute[ $device ][ $property ];
}

/**
 * Sanitize CSS value.
 *
 * @param mixed  $value Input value.
 * @param string $unit  CSS unit (px, %, em, rem, etc.).
 *
 * @return string Sanitized CSS value.
 */
function sanitize_css_value( $value, $unit = 'px' ) {
	if ( null === $value || '' === $value ) {
		return '';
	}

	$value = is_numeric( $value ) ? floatval( $value ) : 0;
	$unit  = sanitize_text_field( $unit );

	return $value . $unit;
}

/**
 * Generate unique ID for block.
 *
 * @param string $prefix Prefix for ID.
 * @param string $client_id Block client ID.
 *
 * @return string Unique ID.
 */
function generate_block_id( $prefix = 'wpdb', $client_id = '' ) {
	$hash = $client_id ? substr( $client_id, 0, 8 ) : substr( md5( uniqid() ), 0, 8 );
	return sanitize_html_class( $prefix . '-' . $hash );
}

/**
 * Get nested array value safely.
 *
 * @param array  $array   Array to search.
 * @param string $path    Dot-notation path (e.g., 'desktop.value').
 * @param mixed  $default Default value if not found.
 *
 * @return mixed Found value or default.
 */
function get_nested_value( $array, $path, $default = null ) {
	if ( ! is_array( $array ) ) {
		return $default;
	}

	$keys = explode( '.', $path );

	foreach ( $keys as $key ) {
		if ( ! isset( $array[ $key ] ) ) {
			return $default;
		}
		$array = $array[ $key ];
	}

	return $array;
}

/**
 * Enqueue editor assets with cache busting.
 *
 * @param string $handle    Script/style handle.
 * @param string $file_path Relative path to file in build directory.
 * @param array  $deps      Dependencies.
 * @param bool   $in_footer Whether to enqueue script in footer.
 *
 * @return void
 */
function enqueue_block_asset( $handle, $file_path, $deps = array(), $in_footer = true ) {
	$file_url = WPDB_URL . 'build/' . $file_path;
	$file_abs = WPDB_PATH . 'build/' . $file_path;

	if ( ! file_exists( $file_abs ) ) {
		return;
	}

	$version = file_exists( $file_abs ) ? filemtime( $file_abs ) : WPDB_VERSION;
	$ext     = pathinfo( $file_path, PATHINFO_EXTENSION );

	if ( 'js' === $ext ) {
		wp_enqueue_script( $handle, $file_url, $deps, $version, $in_footer );
	} elseif ( 'css' === $ext ) {
		wp_enqueue_style( $handle, $file_url, $deps, $version );
	}
}

/**
 * Check if block exists in content.
 *
 * @param string $block_name Block name to check.
 * @param int    $post_id    Post ID (optional, uses current post if not provided).
 *
 * @return bool True if block exists.
 */
function has_block_in_content( $block_name, $post_id = null ) {
	if ( function_exists( 'has_block' ) ) {
		return has_block( $block_name, $post_id );
	}

	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	if ( ! $post_id ) {
		return false;
	}

	$post = get_post( $post_id );

	return $post && is_a( $post, 'WP_Post' ) && has_block( $block_name, $post );
}
