import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents single component errors from crashing the entire editor
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('FlexBlocks Error Boundary caught an error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Report error to WordPress if available
        if (window.wp && window.wp.hooks) {
            window.wp.hooks.doAction('flexblocks.error', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="flexblocks-error-boundary">
                    <div className="flexblocks-error-message">
                        <h3>{__('Something went wrong', 'flexblocks')}</h3>
                        <p>{__('This block encountered an error and cannot be displayed properly.', 'flexblocks')}</p>
                        {process.env.NODE_ENV === 'development' && (
                            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                                <summary>{__('Error Details (Development Mode)', 'flexblocks')}</summary>
                                <code>
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo.componentStack}
                                </code>
                            </details>
                        )}
                        <button 
                            className="button button-secondary"
                            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                            style={{ marginTop: '10px' }}
                        >
                            {__('Try Again', 'flexblocks')}
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
