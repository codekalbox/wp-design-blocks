/**
 * Responsive attribute utilities.
 *
 * @package WP_Design_Blocks
 */

import { DEVICES } from './constants';

/**
 * Get responsive value from attribute object.
 *
 * @param {Object} attribute - Attribute object with device keys.
 * @param {string} device    - Device type (desktop, tablet, mobile).
 * @param {string} property  - Property to get (e.g., 'value', 'unit').
 * @param {*}      fallback  - Default value if not found.
 * @return {*} Property value or fallback.
 */
export function getResponsiveValue( attribute, device = 'desktop', property = 'value', fallback = null ) {
	if ( ! attribute || typeof attribute !== 'object' ) {
		return fallback;
	}

	if ( ! attribute[ device ] || typeof attribute[ device ] !== 'object' ) {
		return fallback;
	}

	if ( ! ( property in attribute[ device ] ) ) {
		return fallback;
	}

	const value = attribute[ device ][ property ];
	return value !== undefined && value !== null ? value : fallback;
}

/**
 * Create responsive attribute object.
 *
 * @param {*}      value    - Value to set for all devices.
 * @param {string} property - Property name (e.g., 'value', 'unit').
 * @return {Object} Responsive attribute object.
 */
export function createResponsiveAttribute( value, property = 'value' ) {
	const attribute = {};

	DEVICES.forEach( ( device ) => {
		attribute[ device ] = {
			[ property ]: value,
		};
	} );

	return attribute;
}

/**
 * Update responsive attribute for specific device.
 *
 * @param {Object} attribute     - Existing attribute object.
 * @param {string} device        - Device type to update.
 * @param {string} property      - Property to update.
 * @param {*}      value         - New value.
 * @return {Object} Updated attribute object.
 */
export function updateResponsiveAttribute( attribute, device, property, value ) {
	return {
		...attribute,
		[ device ]: {
			...( attribute?.[ device ] || {} ),
			[ property ]: value,
		},
	};
}

/**
 * Get CSS value with unit.
 *
 * @param {Object} attribute - Attribute with value and unit.
 * @param {string} device    - Device type.
 * @param {string} fallback  - Fallback CSS string.
 * @return {string} CSS value with unit (e.g., '20px').
 */
export function getCSSValue( attribute, device = 'desktop', fallback = '0' ) {
	const value = getResponsiveValue( attribute, device, 'value' );
	const unit = getResponsiveValue( attribute, device, 'unit', 'px' );

	if ( value === null || value === undefined || value === '' ) {
		return fallback;
	}

	return `${ value }${ unit }`;
}

/**
 * Check if responsive attribute has any values set.
 *
 * @param {Object} attribute - Attribute to check.
 * @param {string} property  - Property to check.
 * @return {boolean} True if any device has a value.
 */
export function hasResponsiveValue( attribute, property = 'value' ) {
	if ( ! attribute || typeof attribute !== 'object' ) {
		return false;
	}

	return DEVICES.some( ( device ) => {
		const value = getResponsiveValue( attribute, device, property );
		return value !== null && value !== undefined && value !== '';
	} );
}

