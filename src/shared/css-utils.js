/**
 * CSS generation utilities.
 *
 * @package WP_Design_Blocks
 */

import { getResponsiveValue, getCSSValue } from './responsive';

/**
 * Sanitize CSS value.
 *
 * @param {*}      value     - Value to sanitize.
 * @param {string} unit      - CSS unit.
 * @param {string} fallback  - Fallback value if invalid.
 * @return {string} Sanitized CSS value.
 */
export function sanitizeCSSValue( value, unit = 'px', fallback = '0' ) {
	if ( value === null || value === undefined || value === '' ) {
		return fallback;
	}

	// Convert to number if possible.
	const numValue = parseFloat( value );

	if ( isNaN( numValue ) ) {
		return fallback;
	}

	return `${ numValue }${ unit }`;
}

/**
 * Generate CSS custom properties from attributes.
 *
 * @param {Object} attributes - Block attributes.
 * @param {string} device     - Current device (desktop, tablet, mobile).
 * @return {Object} CSS custom properties object.
 */
export function generateCSSProps( attributes, device = 'desktop' ) {
	const props = {};

	// Flex properties.
	if ( attributes.flex ) {
		props[ '--flex-direction' ] = getResponsiveValue(
			attributes.flex,
			device,
			'direction',
			'column'
		);
		props[ '--flex-justify' ] = getResponsiveValue(
			attributes.flex,
			device,
			'justify',
			'flex-start'
		);
		props[ '--flex-align' ] = getResponsiveValue( attributes.flex, device, 'align', 'stretch' );
		props[ '--flex-wrap' ] = getResponsiveValue( attributes.flex, device, 'wrap', 'nowrap' );
		props[ '--flex-gap' ] = sanitizeCSSValue(
			getResponsiveValue( attributes.flex, device, 'gap', 20 ),
			'px'
		);
	}

	// Spacing properties.
	if ( attributes.styleSpacing ) {
		const spacing = attributes.styleSpacing;

		// Padding.
		if ( spacing.padding ) {
			props[ '--padding-top' ] = getCSSValue( spacing.padding, device, '0' );
			props[ '--padding-right' ] = getCSSValue( spacing.padding, device, '0' );
			props[ '--padding-bottom' ] = getCSSValue( spacing.padding, device, '0' );
			props[ '--padding-left' ] = getCSSValue( spacing.padding, device, '0' );
		}

		// Margin.
		if ( spacing.margin ) {
			props[ '--margin-top' ] = getCSSValue( spacing.margin, device, '0' );
			props[ '--margin-right' ] = getCSSValue( spacing.margin, device, '0' );
			props[ '--margin-bottom' ] = getCSSValue( spacing.margin, device, '0' );
			props[ '--margin-left' ] = getCSSValue( spacing.margin, device, '0' );
		}
	}

	// Background properties.
	if ( attributes.styleBackground ) {
		const bg = attributes.styleBackground;

		if ( bg.type === 'color' && bg.color ) {
			props[ '--bg-color' ] = bg.color;
		} else if ( bg.type === 'gradient' && bg.gradient ) {
			props[ '--bg-image' ] = bg.gradient;
		} else if ( bg.type === 'image' && bg.image?.url ) {
			props[ '--bg-image' ] = `url(${ bg.image.url })`;
			props[ '--bg-position' ] = bg.position || 'center center';
			props[ '--bg-size' ] = bg.size || 'cover';
			props[ '--bg-repeat' ] = bg.repeat || 'no-repeat';
		}
	}

	// Overlay properties.
	if ( attributes.styleOverlay?.enable ) {
		const overlay = attributes.styleOverlay;

		if ( overlay.type === 'color' && overlay.color ) {
			props[ '--overlay-bg' ] = overlay.color;
		} else if ( overlay.type === 'gradient' && overlay.gradient ) {
			props[ '--overlay-bg' ] = overlay.gradient;
		}

		props[ '--overlay-opacity' ] = overlay.opacity ?? 0.5;
		props[ '--overlay-blend' ] = overlay.blendMode || 'normal';
	}

	// Border radius.
	if ( attributes.styleBorder?.radius ) {
		const radius = attributes.styleBorder.radius;
		props[ '--border-radius-top' ] = getCSSValue( radius, device, '0' );
		props[ '--border-radius-right' ] = getCSSValue( radius, device, '0' );
		props[ '--border-radius-bottom' ] = getCSSValue( radius, device, '0' );
		props[ '--border-radius-left' ] = getCSSValue( radius, device, '0' );
	}

	// Shadow.
	if ( attributes.styleShadow?.enable ) {
		const shadow = attributes.styleShadow;
		props[ '--box-shadow' ] = `${ shadow.hOffset || 0 }px ${ shadow.vOffset || 0 }px ${
			shadow.blur || 10
		}px ${ shadow.spread || 0 }px ${ shadow.color || 'rgba(0,0,0,0.2)' } ${
			shadow.inset ? 'inset' : ''
		}`.trim();
	}

	// Min height (for sections).
	if ( attributes.layout?.minHeight ) {
		props[ '--min-height' ] = getCSSValue( attributes.layout.minHeight, device, 'auto' );
	}

	// Max width (for sections).
	if ( attributes.layout?.contentWidth ) {
		props[ '--max-width' ] = sanitizeCSSValue(
			attributes.layout.contentWidth.value || 1200,
			attributes.layout.contentWidth.unit || 'px'
		);
	}

	// Remove undefined/null values.
	Object.keys( props ).forEach( ( key ) => {
		if ( props[ key ] === undefined || props[ key ] === null ) {
			delete props[ key ];
		}
	} );

	return props;
}

/**
 * Generate classnames from attributes.
 *
 * @param {Object} attributes - Block attributes.
 * @param {string} baseClass  - Base class name.
 * @return {string} Combined class names.
 */
export function generateClassNames( attributes, baseClass = '' ) {
	const classes = [ baseClass ].filter( Boolean );

	// Visibility classes.
	if ( attributes.visibility ) {
		const { hideDesktop, hideTablet, hideMobile } = attributes.visibility;

		if ( hideDesktop ) {
			classes.push( 'wpdb-hide-desktop' );
		}
		if ( hideTablet ) {
			classes.push( 'wpdb-hide-tablet' );
		}
		if ( hideMobile ) {
			classes.push( 'wpdb-hide-mobile' );
		}
	}

	// Animation class.
	if ( attributes.animation?.type && attributes.animation.type !== 'none' ) {
		classes.push( `wpdb-animate-${ attributes.animation.type }` );
	}

	// Custom classes.
	if ( attributes.advanced?.customClasses ) {
		classes.push( attributes.advanced.customClasses );
	}

	return classes.join( ' ' );
}

