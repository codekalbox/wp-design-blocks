/**
 * Section Block Frontend JavaScript.
 *
 * Handles animations and interactive features on the frontend.
 *
 * @package WP_Design_Blocks
 */

/**
 * Initialize section animations.
 */
function initSectionAnimations() {
	// Check if IntersectionObserver is supported.
	if ( ! window.IntersectionObserver ) {
		return;
	}

	// Find all section blocks with animations.
	const sections = document.querySelectorAll( '.wpdb-section[data-animation-type]:not([data-animation-type="none"])' );

	if ( sections.length === 0 ) {
		return;
	}

	// Create intersection observer.
	const observer = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					const section = entry.target;
					const animationType = section.getAttribute( 'data-animation-type' );
					const duration = parseFloat( section.getAttribute( 'data-animation-duration' ) ) || 0.8;
					const delay = parseFloat( section.getAttribute( 'data-animation-delay' ) ) || 0;

					// Set CSS custom properties for animation.
					section.style.setProperty( '--animation-duration', `${ duration }s` );
					section.style.setProperty( '--animation-delay', `${ delay }s` );

					// Add animation classes.
					section.classList.add( 'wpdb-animate', `wpdb-animate-${ animationType }` );

					// Trigger animation after delay.
					setTimeout( () => {
						section.classList.add( 'wpdb-animated' );
					}, delay * 1000 );

					// Stop observing this element.
					observer.unobserve( section );
				}
			} );
		},
		{
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px',
		}
	);

	// Observe all sections.
	sections.forEach( ( section ) => {
		observer.observe( section );
	} );
}

/**
 * Initialize responsive breakpoint detection.
 */
function initResponsiveBreakpoints() {
	// Add CSS custom properties for JavaScript access.
	const style = document.createElement( 'style' );
	style.textContent = `
		:root {
			--wpdb-breakpoint-tablet: 1024px;
			--wpdb-breakpoint-mobile: 768px;
		}
	`;
	document.head.appendChild( style );
}

/**
 * Initialize when DOM is ready.
 */
function init() {
	initResponsiveBreakpoints();
	initSectionAnimations();
}

// Initialize on DOM ready.
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}

