<?php
/**
 * Section Block PHP Render Callback.
 *
 * @package WP_Design_Blocks
 */

namespace WP_Design_Blocks\Blocks;

use WP_Design_Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render Section block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Block HTML.
 */
function render_section( $attributes, $content, $block ) {
	// Get attributes with defaults.
	$unique_id = $attributes['uniqueId'] ?? '';
	$tag_name = $attributes['tagName'] ?? 'section';
	$layout = $attributes['layout'] ?? array();
	$flex = $attributes['flex'] ?? array();
	$visibility = $attributes['visibility'] ?? array();
	$style_background = $attributes['styleBackground'] ?? array();
	$style_overlay = $attributes['styleOverlay'] ?? array();
	$style_spacing = $attributes['styleSpacing'] ?? array();
	$style_shadow = $attributes['styleShadow'] ?? array();
	$animation = $attributes['animation'] ?? array();
	$advanced = $attributes['advanced'] ?? array();

	// Generate CSS custom properties for all devices.
	$css_props = array();
	$devices = array( 'desktop', 'tablet', 'mobile' );

	foreach ( $devices as $device ) {
		$device_props = generate_css_properties( $attributes, $device );
		
		if ( 'desktop' === $device ) {
			// Desktop styles are the base.
			$css_props = array_merge( $css_props, $device_props );
		} else {
			// Store device-specific props for media queries.
			$css_props[ $device ] = $device_props;
		}
	}

	// Generate class names.
	$class_names = array( 'wpdb-section' );

	// Add visibility classes.
	if ( ! empty( $visibility['hideDesktop'] ) ) {
		$class_names[] = 'wpdb-hide-desktop';
	}
	if ( ! empty( $visibility['hideTablet'] ) ) {
		$class_names[] = 'wpdb-hide-tablet';
	}
	if ( ! empty( $visibility['hideMobile'] ) ) {
		$class_names[] = 'wpdb-hide-mobile';
	}

	// Add animation class.
	if ( ! empty( $animation['type'] ) && 'none' !== $animation['type'] ) {
		$class_names[] = 'wpdb-animate';
		$class_names[] = 'wpdb-animate-' . $animation['type'];
	}

	// Add custom classes.
	if ( ! empty( $advanced['customClasses'] ) ) {
		$class_names[] = sanitize_html_class( $advanced['customClasses'] );
	}

	// Build inline styles.
	$inline_styles = array();
	foreach ( $css_props as $property => $value ) {
		if ( is_array( $value ) ) {
			continue; // Skip device-specific arrays for now.
		}
		if ( null !== $value && '' !== $value ) {
			$inline_styles[] = esc_attr( $property ) . ': ' . esc_attr( $value );
		}
	}

	// Build attributes array.
	$block_attributes = array(
		'class' => implode( ' ', array_map( 'sanitize_html_class', $class_names ) ),
		'style' => implode( '; ', $inline_styles ),
	);

	if ( ! empty( $unique_id ) ) {
		$block_attributes['id'] = sanitize_html_class( $unique_id );
	}

	// Add animation data attributes.
	if ( ! empty( $animation['type'] ) && 'none' !== $animation['type'] ) {
		$block_attributes['data-animation-type'] = esc_attr( $animation['type'] );
		$block_attributes['data-animation-duration'] = esc_attr( $animation['duration'] ?? 0.8 );
		$block_attributes['data-animation-delay'] = esc_attr( $animation['delay'] ?? 0 );
	}

	// Build attributes string.
	$attributes_string = '';
	foreach ( $block_attributes as $attr => $value ) {
		if ( ! empty( $value ) ) {
			$attributes_string .= sprintf( ' %s="%s"', esc_attr( $attr ), esc_attr( $value ) );
		}
	}

	// Generate responsive CSS if needed.
	$responsive_css = generate_responsive_css( $unique_id, $css_props );

	// Build the HTML.
	$tag_name = sanitize_key( $tag_name );
	$allowed_tags = array( 'section', 'div', 'header', 'main', 'footer', 'article', 'aside' );
	if ( ! in_array( $tag_name, $allowed_tags, true ) ) {
		$tag_name = 'section';
	}

	$html = sprintf( '<%s%s>', $tag_name, $attributes_string );

	// Add overlay if enabled.
	if ( ! empty( $style_overlay['enable'] ) ) {
		$html .= '<div class="wpdb-overlay"></div>';
	}

	// Add content wrapper.
	$content_class = 'wpdb-section__content';
	if ( 'boxed' === ( $layout['widthType'] ?? 'boxed' ) ) {
		$content_class .= ' wpdb-boxed';
	}

	$html .= sprintf( '<div class="%s">%s</div>', esc_attr( $content_class ), $content );
	$html .= sprintf( '</%s>', $tag_name );

	// Add responsive CSS to the page.
	if ( ! empty( $responsive_css ) ) {
		wp_add_inline_style( 'wp-block-library', $responsive_css );
	}

	return $html;
}

/**
 * Generate CSS custom properties from attributes.
 *
 * @param array  $attributes Block attributes.
 * @param string $device     Device type (desktop, tablet, mobile).
 *
 * @return array CSS properties.
 */
function generate_css_properties( $attributes, $device = 'desktop' ) {
	$props = array();

	// Flex properties.
	if ( ! empty( $attributes['flex'] ) ) {
		$flex = $attributes['flex'];
		$props['--flex-direction'] = WP_Design_Blocks\get_responsive_value( $flex, $device, 'direction', 'column' );
		$props['--flex-justify'] = WP_Design_Blocks\get_responsive_value( $flex, $device, 'justify', 'flex-start' );
		$props['--flex-align'] = WP_Design_Blocks\get_responsive_value( $flex, $device, 'align', 'stretch' );
		$props['--flex-wrap'] = WP_Design_Blocks\get_responsive_value( $flex, $device, 'wrap', 'nowrap' );
		$props['--flex-gap'] = WP_Design_Blocks\sanitize_css_value(
			WP_Design_Blocks\get_responsive_value( $flex, $device, 'gap', 20 ),
			'px'
		);
	}

	// Spacing properties.
	if ( ! empty( $attributes['styleSpacing'] ) ) {
		$spacing = $attributes['styleSpacing'];

		// Padding.
		if ( ! empty( $spacing['padding'] ) ) {
			$props['--padding-top'] = WP_Design_Blocks\sanitize_css_value(
				WP_Design_Blocks\get_responsive_value( $spacing['padding'], $device, 'top', 50 ),
				WP_Design_Blocks\get_responsive_value( $spacing['padding'], $device, 'unit', 'px' )
			);
			$props['--padding-right'] = WP_Design_Blocks\sanitize_css_value(
				WP_Design_Blocks\get_responsive_value( $spacing['padding'], $device, 'right', 20 ),
				WP_Design_Blocks\get_responsive_value( $spacing['padding'], $device, 'unit', 'px' )
			);
			$props['--padding-bottom'] = WP_Design_Blocks\sanitize_css_value(
				WP_Design_Blocks\get_responsive_value( $spacing['padding'], $device, 'bottom', 50 ),
				WP_Design_Blocks\get_responsive_value( $spacing['padding'], $device, 'unit', 'px' )
			);
			$props['--padding-left'] = WP_Design_Blocks\sanitize_css_value(
				WP_Design_Blocks\get_responsive_value( $spacing['padding'], $device, 'left', 20 ),
				WP_Design_Blocks\get_responsive_value( $spacing['padding'], $device, 'unit', 'px' )
			);
		}

		// Margin.
		if ( ! empty( $spacing['margin'] ) ) {
			$props['--margin-top'] = WP_Design_Blocks\sanitize_css_value(
				WP_Design_Blocks\get_responsive_value( $spacing['margin'], $device, 'top', 0 ),
				WP_Design_Blocks\get_responsive_value( $spacing['margin'], $device, 'unit', 'px' )
			);
			$props['--margin-right'] = WP_Design_Blocks\sanitize_css_value(
				WP_Design_Blocks\get_responsive_value( $spacing['margin'], $device, 'right', 0 ),
				WP_Design_Blocks\get_responsive_value( $spacing['margin'], $device, 'unit', 'px' )
			);
			$props['--margin-bottom'] = WP_Design_Blocks\sanitize_css_value(
				WP_Design_Blocks\get_responsive_value( $spacing['margin'], $device, 'bottom', 0 ),
				WP_Design_Blocks\get_responsive_value( $spacing['margin'], $device, 'unit', 'px' )
			);
			$props['--margin-left'] = WP_Design_Blocks\sanitize_css_value(
				WP_Design_Blocks\get_responsive_value( $spacing['margin'], $device, 'left', 0 ),
				WP_Design_Blocks\get_responsive_value( $spacing['margin'], $device, 'unit', 'px' )
			);
		}
	}

	// Background properties.
	if ( ! empty( $attributes['styleBackground'] ) ) {
		$bg = $attributes['styleBackground'];

		if ( 'color' === ( $bg['type'] ?? '' ) && ! empty( $bg['color'] ) ) {
			$props['--bg-color'] = sanitize_hex_color( $bg['color'] );
		} elseif ( 'gradient' === ( $bg['type'] ?? '' ) && ! empty( $bg['gradient'] ) ) {
			$props['--bg-image'] = wp_strip_all_tags( $bg['gradient'] );
		} elseif ( 'image' === ( $bg['type'] ?? '' ) && ! empty( $bg['image']['url'] ) ) {
			$props['--bg-image'] = sprintf( 'url(%s)', esc_url( $bg['image']['url'] ) );
			$props['--bg-position'] = sanitize_text_field( $bg['position'] ?? 'center center' );
			$props['--bg-size'] = sanitize_text_field( $bg['size'] ?? 'cover' );
			$props['--bg-repeat'] = sanitize_text_field( $bg['repeat'] ?? 'no-repeat' );
		}
	}

	// Overlay properties.
	if ( ! empty( $attributes['styleOverlay']['enable'] ) ) {
		$overlay = $attributes['styleOverlay'];

		if ( 'color' === ( $overlay['type'] ?? 'color' ) && ! empty( $overlay['color'] ) ) {
			$props['--overlay-bg'] = sanitize_hex_color( $overlay['color'] );
		} elseif ( 'gradient' === ( $overlay['type'] ?? '' ) && ! empty( $overlay['gradient'] ) ) {
			$props['--overlay-bg'] = wp_strip_all_tags( $overlay['gradient'] );
		}

		$props['--overlay-opacity'] = floatval( $overlay['opacity'] ?? 0.5 );
		$props['--overlay-blend'] = sanitize_text_field( $overlay['blendMode'] ?? 'normal' );
	}

	// Shadow properties.
	if ( ! empty( $attributes['styleShadow']['enable'] ) ) {
		$shadow = $attributes['styleShadow'];
		$shadow_value = sprintf(
			'%dpx %dpx %dpx %dpx %s%s',
			intval( $shadow['hOffset'] ?? 0 ),
			intval( $shadow['vOffset'] ?? 0 ),
			intval( $shadow['blur'] ?? 10 ),
			intval( $shadow['spread'] ?? 0 ),
			sanitize_hex_color( $shadow['color'] ?? '#000000' ) ?: 'rgba(0,0,0,0.2)',
			! empty( $shadow['inset'] ) ? ' inset' : ''
		);
		$props['--box-shadow'] = trim( $shadow_value );
	}

	// Layout properties.
	if ( ! empty( $attributes['layout'] ) ) {
		$layout = $attributes['layout'];

		// Min height.
		if ( ! empty( $layout['minHeight'] ) ) {
			$props['--min-height'] = WP_Design_Blocks\sanitize_css_value(
				WP_Design_Blocks\get_responsive_value( $layout['minHeight'], $device, 'value', 0 ),
				WP_Design_Blocks\get_responsive_value( $layout['minHeight'], $device, 'unit', 'px' )
			);
		}

		// Max width for boxed layout.
		if ( 'boxed' === ( $layout['widthType'] ?? 'boxed' ) && ! empty( $layout['contentWidth'] ) ) {
			$props['--max-width'] = WP_Design_Blocks\sanitize_css_value(
				$layout['contentWidth']['value'] ?? 1200,
				$layout['contentWidth']['unit'] ?? 'px'
			);
		}
	}

	// Advanced properties.
	if ( ! empty( $attributes['advanced'] ) ) {
		$advanced = $attributes['advanced'];

		if ( isset( $advanced['zIndex'] ) ) {
			$props['--z-index'] = intval( $advanced['zIndex'] );
		}

		if ( ! empty( $advanced['overflow'] ) ) {
			$props['--overflow'] = sanitize_text_field( $advanced['overflow'] );
		}
	}

	// Animation properties.
	if ( ! empty( $attributes['animation'] ) ) {
		$animation = $attributes['animation'];

		if ( ! empty( $animation['duration'] ) ) {
			$props['--animation-duration'] = floatval( $animation['duration'] ) . 's';
		}

		if ( ! empty( $animation['delay'] ) ) {
			$props['--animation-delay'] = floatval( $animation['delay'] ) . 's';
		}

		$props['--animation-easing'] = sanitize_text_field( $animation['easing'] ?? 'ease-out' );
	}

	// Remove empty values.
	return array_filter( $props, function( $value ) {
		return null !== $value && '' !== $value;
	} );
}

/**
 * Generate responsive CSS for tablet and mobile.
 *
 * @param string $unique_id Block unique ID.
 * @param array  $css_props CSS properties with device-specific values.
 *
 * @return string CSS string.
 */
function generate_responsive_css( $unique_id, $css_props ) {
	if ( empty( $unique_id ) || empty( $css_props ) ) {
		return '';
	}

	$css = '';

	// Tablet styles.
	if ( ! empty( $css_props['tablet'] ) ) {
		$css .= '@media (min-width: 768px) and (max-width: 1023px) {';
		$css .= sprintf( '#%s {', esc_attr( $unique_id ) );
		foreach ( $css_props['tablet'] as $property => $value ) {
			if ( null !== $value && '' !== $value ) {
				$css .= sprintf( '%s: %s;', esc_attr( $property ), esc_attr( $value ) );
			}
		}
		$css .= '}}';
	}

	// Mobile styles.
	if ( ! empty( $css_props['mobile'] ) ) {
		$css .= '@media (max-width: 767px) {';
		$css .= sprintf( '#%s {', esc_attr( $unique_id ) );
		foreach ( $css_props['mobile'] as $property => $value ) {
			if ( null !== $value && '' !== $value ) {
				$css .= sprintf( '%s: %s;', esc_attr( $property ), esc_attr( $value ) );
			}
		}
		$css .= '}}';
	}

	return $css;
}

