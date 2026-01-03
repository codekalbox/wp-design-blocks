/**
 * Error Boundary Component.
 *
 * Catches JavaScript errors in child components and displays a fallback UI.
 *
 * @package WP_Design_Blocks
 */

import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Error Boundary class component.
 */
class ErrorBoundary extends Component {
	/**
	 * Constructor.
	 *
	 * @param {Object} props - Component props.
	 */
	constructor( props ) {
		super( props );
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	/**
	 * Update state when error is caught.
	 *
	 * @param {Error} error - Error object.
	 * @return {Object} New state.
	 */
	static getDerivedStateFromError( error ) {
		return {
			hasError: true,
			error,
		};
	}

	/**
	 * Log error information.
	 *
	 * @param {Error}  error     - Error object.
	 * @param {Object} errorInfo - Error info with component stack.
	 */
	componentDidCatch( error, errorInfo ) {
		this.setState( {
			errorInfo,
		} );

		// Log to console in development.
		if ( process.env.NODE_ENV === 'development' ) {
			console.error( 'ErrorBoundary caught an error:', error, errorInfo );
		}
	}

	/**
	 * Reset error state.
	 */
	resetError = () => {
		this.setState( {
			hasError: false,
			error: null,
			errorInfo: null,
		} );
	};

	/**
	 * Render component.
	 *
	 * @return {JSX.Element} Component markup.
	 */
	render() {
		const { hasError, error, errorInfo } = this.state;
		const { children, fallback } = this.props;

		if ( hasError ) {
			// Custom fallback UI if provided.
			if ( fallback ) {
				return typeof fallback === 'function'
					? fallback( error, errorInfo, this.resetError )
					: fallback;
			}

			// Default fallback UI.
			return (
				<div
					style={ {
						padding: '20px',
						border: '2px solid #dc3232',
						borderRadius: '4px',
						background: '#fff',
						color: '#1e1e1e',
					} }
				>
					<h3 style={ { margin: '0 0 10px', color: '#dc3232' } }>
						{ __( 'Something went wrong', 'wp-design-blocks' ) }
					</h3>
					<p style={ { margin: '0 0 10px', fontSize: '14px' } }>
						{ __( 'This block encountered an error and cannot be displayed.', 'wp-design-blocks' ) }
					</p>
					{ process.env.NODE_ENV === 'development' && error && (
						<details style={ { marginTop: '15px' } }>
							<summary style={ { cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' } }>
								{ __( 'Error Details', 'wp-design-blocks' ) }
							</summary>
							<pre
								style={ {
									padding: '10px',
									background: '#f0f0f1',
									borderRadius: '4px',
									overflow: 'auto',
									fontSize: '12px',
								} }
							>
								{ error.toString() }
								{ errorInfo && errorInfo.componentStack }
							</pre>
						</details>
					) }
					<button
						onClick={ this.resetError }
						style={ {
							marginTop: '15px',
							padding: '8px 16px',
							background: '#2271b1',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							fontSize: '14px',
						} }
					>
						{ __( 'Try Again', 'wp-design-blocks' ) }
					</button>
				</div>
			);
		}

		return children;
	}
}

export default ErrorBoundary;

