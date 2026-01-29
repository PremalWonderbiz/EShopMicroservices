import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="container">
          <div className="row min-vh-100 align-items-center justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                  <h4 className="mb-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Something Went Wrong
                  </h4>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    We're sorry, but something unexpected happened. Please try
                    refreshing the page or return to the homepage.
                  </p>

                  {import.meta.env?.MODE === 'development' && this.state.error && (
                    <div className="mt-3">
                      <h6 className="text-danger">Error Details (Development Only):</h6>
                      <div className="alert alert-secondary">
                        <strong>Error:</strong> {this.state.error.toString()}
                        <details className="mt-2">
                          <summary>Stack Trace</summary>
                          <pre className="mt-2" style={{ fontSize: '0.75rem' }}>
                            {this.state.errorInfo?.componentStack}
                          </pre>
                        </details>
                      </div>
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-4">
                    <button
                      onClick={this.handleReset}
                      className="btn btn-primary"
                    >
                      Try Again
                    </button>
                    <Link to="/" className="btn btn-outline-secondary">
                      Go to Homepage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;