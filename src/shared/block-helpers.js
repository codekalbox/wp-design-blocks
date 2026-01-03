/**
 * Block helper utilities.
 *
 * @package WP_Design_Blocks
 */

/**
 * Generate unique ID for a block.
 *
 * @param {string} prefix   - ID prefix.
 * @param {string} clientId - Block client ID.
 * @return {string} Unique ID.
 */
export function generateUniqueId( prefix = 'wpdb', clientId = '' ) {
	const hash = clientId ? clientId.slice( 0, 8 ) : Math.random().toString( 36 ).substr( 2, 8 );
	return `${ prefix }-${ hash }`;
}

/**
 * Get current device type based on screen width.
 *
 * @return {string} Device type (desktop, tablet, mobile).
 */
export function getDeviceType() {
	if ( typeof window === 'undefined' ) {
		return 'desktop';
	}

	const width = window.innerWidth;

	if ( width < 768 ) {
		return 'mobile';
	}

	if ( width < 1024 ) {
		return 'tablet';
	}

	return 'desktop';
}

/**
 * Safely get nested object property.
 *
 * @param {Object} obj     - Object to search.
 * @param {string} path    - Dot-notation path (e.g., 'desktop.value').
 * @param {*}      fallback - Default value if not found.
 * @return {*} Found value or fallback.
 */
export function getNestedValue( obj, path, fallback = null ) {
	if ( ! obj || typeof obj !== 'object' ) {
		return fallback;
	}

	const keys = path.split( '.' );
	let result = obj;

	for ( const key of keys ) {
		if ( result && typeof result === 'object' && key in result ) {
			result = result[ key ];
		} else {
			return fallback;
		}
	}

	return result !== undefined ? result : fallback;
}

/**
 * Deep merge two objects.
 *
 * @param {Object} target - Target object.
 * @param {Object} source - Source object to merge.
 * @return {Object} Merged object.
 */
export function deepMerge( target, source ) {
	const output = { ...target };

	if ( isObject( target ) && isObject( source ) ) {
		Object.keys( source ).forEach( ( key ) => {
			if ( isObject( source[ key ] ) ) {
				if ( ! ( key in target ) ) {
					Object.assign( output, { [ key ]: source[ key ] } );
				} else {
					output[ key ] = deepMerge( target[ key ], source[ key ] );
				}
			} else {
				Object.assign( output, { [ key ]: source[ key ] } );
			}
		} );
	}

	return output;
}

/**
 * Check if value is an object.
 *
 * @param {*} item - Value to check.
 * @return {boolean} True if object.
 */
function isObject( item ) {
	return item && typeof item === 'object' && ! Array.isArray( item );
}

/**
 * Debounce function execution.
 *
 * @param {Function} func  - Function to debounce.
 * @param {number}   wait  - Wait time in milliseconds.
 * @return {Function} Debounced function.
 */
export function debounce( func, wait = 300 ) {
	let timeout;

	return function executedFunction( ...args ) {
		const later = () => {
			clearTimeout( timeout );
			func( ...args );
		};

		clearTimeout( timeout );
		timeout = setTimeout( later, wait );
	};
}

/**
 * Check if code is running in WordPress editor.
 *
 * @return {boolean} True if in editor.
 */
export function isEditor() {
	return typeof wp !== 'undefined' && wp.blocks && wp.data;
}

/**
 * Validate CSS unit value.
 *
 * @param {string} unit - CSS unit to validate.
 * @return {boolean} True if valid CSS unit.
 */
export function isValidCSSUnit( unit ) {
	const validUnits = [ 'px', '%', 'em', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'ch', 'ex' ];
	return validUnits.includes( unit );
}

