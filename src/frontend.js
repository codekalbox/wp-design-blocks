document.addEventListener( 'DOMContentLoaded', () => {
    try {
        // Check for IntersectionObserver support
        if ( !window.IntersectionObserver ) {
            console.warn( 'FlexBlocks: IntersectionObserver not supported. Animations will not work.' );
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2 // Default, will be overridden by data attribute
        };

        const observerCallback = ( entries, observer ) => {
            try {
                entries.forEach( entry => {
                    if ( entry.isIntersecting ) {
                        const element = entry.target;
                        
                        // Validate element exists
                        if ( !element ) {
                            return;
                        }

                        const delay = parseFloat( element.getAttribute( 'data-animation-delay' ) ) || 0;
                        const duration = parseFloat( element.getAttribute( 'data-animation-duration' ) ) || 0.5;

                        // Validate values
                        const validDelay = Math.max( 0, Math.min( 10, delay ) );
                        const validDuration = Math.max( 0.1, Math.min( 10, duration ) );

                        // Apply dynamic styles safely
                        try {
                            element.style.transitionDuration = `${validDuration}s`;
                            element.style.transitionDelay = `${validDelay}s`;
                            element.classList.add( 'animated' );
                        } catch ( styleError ) {
                            console.warn( 'FlexBlocks: Error applying animation styles:', styleError );
                        }

                        // Handle "once" vs "loop"
                        // Current impl is "once" (default behavior of not removing class)
                        // If loop needed, we'd remove class in else block
                        
                        observer.unobserve( element );
                    }
                } );
            } catch ( callbackError ) {
                console.error( 'FlexBlocks: Error in observer callback:', callbackError );
            }
        };

        const observer = new IntersectionObserver( observerCallback, observerOptions );

        const animatedElements = document.querySelectorAll( '.has-animation' );
        
        if ( animatedElements.length === 0 ) {
            return; // No elements to observe
        }

        animatedElements.forEach( el => {
            try {
                observer.observe( el );
            } catch ( observeError ) {
                console.warn( 'FlexBlocks: Error observing element:', observeError );
            }
        } );

    } catch ( error ) {
        console.error( 'FlexBlocks: Error initializing animations:', error );
    }
} );
