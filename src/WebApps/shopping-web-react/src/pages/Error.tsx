import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorStatus: number | string = 'Unknown';

  if (isRouteErrorResponse(error)) {
    // React Router error
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || 'An error occurred';
  } else if (error instanceof Error) {
    // Standard JavaScript error
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'An unexpected error occurred';
  }

  const getErrorTitle = () => {
    switch (errorStatus) {
      case 404:
        return 'Page Not Found';
      case 403:
        return 'Access Forbidden';
      case 500:
        return 'Internal Server Error';
      case 503:
        return 'Service Unavailable';
      default:
        return 'Oops! Something Went Wrong';
    }
  };

  const getErrorDescription = () => {
    switch (errorStatus) {
      case 404:
        return "The page you're looking for doesn't exist or has been moved.";
      case 403:
        return "You don't have permission to access this resource.";
      case 500:
        return 'Our server encountered an error while processing your request.';
      case 503:
        return 'Our service is temporarily unavailable. Please try again later.';
      default:
        return 'We apologize for the inconvenience. Please try again or contact support if the problem persists.';
    }
  };

  return (
    <div className="container">
      <div className="row min-vh-100 align-items-center justify-content-center">
        <div className="col-md-8 col-lg-6 text-center">
          <div className="error-container">
            {/* Error Icon */}
            <div className="mb-4">
              {errorStatus === 404 ? (
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-danger"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-warning"
                >
                  <path
                    d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </div>

            {/* Error Status */}
            {typeof errorStatus === 'number' && (
              <h1 className="display-1 fw-bold text-muted mb-3">{errorStatus}</h1>
            )}

            {/* Error Title */}
            <h2 className="mb-3">{getErrorTitle()}</h2>

            {/* Error Description */}
            <p className="lead text-muted mb-4">{getErrorDescription()}</p>

            {/* Error Message (for development) */}
            {import.meta.env.MODE === 'development' && (
              <div className="alert alert-danger text-start mb-4">
                <h6 className="alert-heading">Error Details (Development Only):</h6>
                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {errorMessage}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/" className="btn btn-primary btn-lg">
                <i className="bi bi-house me-2"></i>
                Go to Homepage
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn btn-outline-secondary btn-lg"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Go Back
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-5">
              <p className="text-muted">
                Need help?{' '}
                <Link to="/contact" className="text-decoration-none">
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;