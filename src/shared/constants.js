/**
 * Shared constants for WP Design Blocks.
 *
 * @package WP_Design_Blocks
 */

/**
 * Responsive breakpoints (px).
 */
export const BREAKPOINTS = {
	tablet: 1024,
	mobile: 768,
};

/**
 * Device types.
 */
export const DEVICES = [ 'desktop', 'tablet', 'mobile' ];

/**
 * Default spacing values.
 */
export const DEFAULT_SPACING = {
	desktop: { top: '50', right: '20', bottom: '50', left: '20', unit: 'px' },
	tablet: { top: '40', right: '15', bottom: '40', left: '15', unit: 'px' },
	mobile: { top: '30', right: '10', bottom: '30', left: '10', unit: 'px' },
};

/**
 * Default flex settings.
 */
export const DEFAULT_FLEX = {
	desktop: {
		direction: 'column',
		justify: 'flex-start',
		align: 'stretch',
		wrap: 'nowrap',
		gap: 20,
	},
	tablet: {
		direction: 'column',
		justify: 'flex-start',
		align: 'stretch',
		wrap: 'nowrap',
		gap: 20,
	},
	mobile: {
		direction: 'column',
		justify: 'flex-start',
		align: 'stretch',
		wrap: 'nowrap',
		gap: 20,
	},
};

/**
 * CSS units.
 */
export const CSS_UNITS = [ 'px', '%', 'em', 'rem', 'vw', 'vh' ];

/**
 * Block namespace.
 */
export const BLOCK_NAMESPACE = 'wp-design-blocks';

