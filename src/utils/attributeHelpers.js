/**
 * Utility functions for safe attribute access and manipulation
 * Prevents null reference errors and provides fallback values
 */

/**
 * Safely get a responsive attribute value with fallback
 * @param {Object} attribute - The responsive attribute object
 * @param {string} device - The device key (desktop, tablet, mobile)
 * @param {string} property - The property to access
 * @param {*} fallback - Fallback value if property doesn't exist
 * @returns {*} The property value or fallback
 */
export const getResponsiveValue = (attribute, device, property, fallback = null) => {
    if (!attribute || typeof attribute !== 'object') {
        return fallback;
    }
    
    if (!attribute[device] || typeof attribute[device] !== 'object') {
        return fallback;
    }
    
    return attribute[device][property] !== undefined ? attribute[device][property] : fallback;
};

/**
 * Safely update a responsive attribute
 * @param {Object} attributes - Current attributes object
 * @param {Function} setAttributes - WordPress setAttributes function
 * @param {string} attributeName - Name of the attribute to update
 * @param {string} device - Device key
 * @param {string} property - Property to update
 * @param {*} value - New value
 */
export const updateResponsiveAttribute = (attributes, setAttributes, attributeName, device, property, value) => {
    const currentAttribute = attributes[attributeName] || {};
    const currentDevice = currentAttribute[device] || {};
    
    setAttributes({
        [attributeName]: {
            ...currentAttribute,
            [device]: {
                ...currentDevice,
                [property]: value
            }
        }
    });
};

/**
 * Safely get a nested attribute value
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot-separated path (e.g., 'layout.contentWidth.value')
 * @param {*} fallback - Fallback value
 * @returns {*} The value or fallback
 */
export const getNestedValue = (obj, path, fallback = null) => {
    if (!obj || typeof obj !== 'object') {
        return fallback;
    }
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (current === null || current === undefined || typeof current !== 'object') {
            return fallback;
        }
        current = current[key];
    }
    
    return current !== undefined ? current : fallback;
};

/**
 * Validate and sanitize CSS unit values
 * @param {*} value - Value to validate
 * @param {string} unit - CSS unit (px, %, em, etc.)
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {Object} Validated value and unit
 */
export const validateCSSValue = (value, unit = 'px', min = 0, max = 9999) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
        return { value: min, unit };
    }
    
    const clampedValue = Math.max(min, Math.min(max, numValue));
    
    return {
        value: clampedValue,
        unit: ['px', '%', 'em', 'rem', 'vh', 'vw'].includes(unit) ? unit : 'px'
    };
};

/**
 * Generate CSS custom properties safely
 * @param {Object} attributes - Block attributes
 * @param {string} device - Current device
 * @returns {Object} CSS custom properties object
 */
export const generateCSSProps = (attributes, device = 'desktop') => {
    const props = {};
    
    // Safe spacing values
    const padding = getResponsiveValue(attributes.styleSpacing?.padding, device, 'top', 0);
    const paddingUnit = getResponsiveValue(attributes.styleSpacing?.padding, device, 'unit', 'px');
    
    if (padding !== null) {
        props['--pt'] = `${padding}${paddingUnit}`;
        props['--pr'] = `${getResponsiveValue(attributes.styleSpacing?.padding, device, 'right', padding)}${paddingUnit}`;
        props['--pb'] = `${getResponsiveValue(attributes.styleSpacing?.padding, device, 'bottom', padding)}${paddingUnit}`;
        props['--pl'] = `${getResponsiveValue(attributes.styleSpacing?.padding, device, 'left', padding)}${paddingUnit}`;
    }
    
    // Safe margin values
    const margin = getResponsiveValue(attributes.styleSpacing?.margin, device, 'top', 0);
    const marginUnit = getResponsiveValue(attributes.styleSpacing?.margin, device, 'unit', 'px');
    
    if (margin !== null) {
        props['--mt'] = `${margin}${marginUnit}`;
        props['--mr'] = `${getResponsiveValue(attributes.styleSpacing?.margin, device, 'right', margin)}${marginUnit}`;
        props['--mb'] = `${getResponsiveValue(attributes.styleSpacing?.margin, device, 'bottom', margin)}${marginUnit}`;
        props['--ml'] = `${getResponsiveValue(attributes.styleSpacing?.margin, device, 'left', margin)}${marginUnit}`;
    }
    
    // Safe flex values
    props['--flex-dir'] = getResponsiveValue(attributes.flex, device, 'direction', 'column');
    props['--justify'] = getResponsiveValue(attributes.flex, device, 'justify', 'flex-start');
    props['--align'] = getResponsiveValue(attributes.flex, device, 'align', 'stretch');
    props['--wrap'] = getResponsiveValue(attributes.flex, device, 'wrap', 'nowrap');
    props['--gap'] = `${getResponsiveValue(attributes.flex, device, 'gap', 0)}px`;
    
    return props;
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
