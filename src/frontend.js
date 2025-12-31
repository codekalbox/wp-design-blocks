document.addEventListener( 'DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Default, will be overridden by data attribute
    };

    const observerCallback = ( entries, observer ) => {
        entries.forEach( entry => {
            if ( entry.isIntersecting ) {
                const element = entry.target;
                const delay = element.getAttribute( 'data-animation-delay' ) || 0;
                const duration = element.getAttribute( 'data-animation-duration' ) || 0.5;

                // Apply dynamic styles
                element.style.transitionDuration = `${duration}s`;
                element.style.transitionDelay = `${delay}s`;

                element.classList.add( 'animated' );

                // Handle "once" vs "loop"
                // Current impl is "once" (default behavior of not removing class)
                // If loop needed, we'd remove class in else block
                
                observer.unobserve( element );
            }
        } );
    };

    const observer = new IntersectionObserver( observerCallback, observerOptions );

    const animatedElements = document.querySelectorAll( '.has-animation' );
    animatedElements.forEach( el => observer.observe( el ) );
} );
