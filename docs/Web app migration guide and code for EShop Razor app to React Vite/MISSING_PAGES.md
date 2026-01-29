# Missing Page Components

## Additional Page Components for Migration Guide

These are the missing page components that should be added to the migration guide under **PHASE 8: Page Components**.

---

## Contact Page

**src/pages/Contact.tsx**

```typescript
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
});

const Contact: React.FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // TODO: Replace with actual API call to send contact form
      console.log('Contact form data:', data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setSubmitError(null);
      reset();

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      setSubmitError('Failed to send message. Please try again.');
      setSubmitSuccess(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <h1 className="mb-4">Contact Us</h1>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Get in Touch</h5>
              <p className="card-text">
                Have a question or feedback? We'd love to hear from you. Fill out
                the form below and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>

          {submitSuccess && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Thank you!</strong> Your message has been sent successfully.
              We'll get back to you soon.
              <button
                type="button"
                className="btn-close"
                onClick={() => setSubmitSuccess(false)}
                aria-label="Close"
              ></button>
            </div>
          )}

          {submitError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error!</strong> {submitError}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSubmitError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    {...register('name')}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    {...register('email')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                    id="subject"
                    {...register('subject')}
                    placeholder="Enter message subject"
                  />
                  {errors.subject && (
                    <div className="invalid-feedback">{errors.subject.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    id="message"
                    rows={6}
                    {...register('message')}
                    placeholder="Enter your message"
                  ></textarea>
                  {errors.message && (
                    <div className="invalid-feedback">{errors.message.message}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-envelope"></i> Email
                  </h5>
                  <p className="card-text">support@shoppingapp.com</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-telephone"></i> Phone
                  </h5>
                  <p className="card-text">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
```

---

## Privacy Policy Page

**src/pages/Privacy.tsx**

```typescript
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-10 mx-auto">
          <h1 className="mb-4">Privacy Policy</h1>
          
          <div className="card mb-3">
            <div className="card-body">
              <p className="text-muted">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                This Privacy Policy describes how Shopping App ("we", "us", or "our")
                collects, uses, and shares your personal information when you use our
                website and services.
              </p>
            </div>
          </div>

          <section className="mb-4">
            <h2>1. Information We Collect</h2>
            <div className="card">
              <div className="card-body">
                <h5>Personal Information</h5>
                <p>
                  When you use our services, we may collect the following types of
                  personal information:
                </p>
                <ul>
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Billing and shipping address</li>
                  <li>Payment information (processed securely by our payment provider)</li>
                  <li>Order history and preferences</li>
                  <li>Account credentials (username and password)</li>
                </ul>

                <h5 className="mt-3">Automatically Collected Information</h5>
                <p>We automatically collect certain information about your device, including:</p>
                <ul>
                  <li>IP address and browser type</li>
                  <li>Operating system and device information</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website and search terms used</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2>2. How We Use Your Information</h2>
            <div className="card">
              <div className="card-body">
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Provide customer support</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Detect and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2>3. Information Sharing and Disclosure</h2>
            <div className="card">
              <div className="card-body">
                <p>
                  We do not sell your personal information. We may share your information
                  with:
                </p>
                <ul>
                  <li>
                    <strong>Service Providers:</strong> Third-party companies that help us
                    operate our business (payment processors, shipping companies, etc.)
                  </li>
                  <li>
                    <strong>Legal Authorities:</strong> When required by law or to protect
                    our rights
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger,
                    acquisition, or sale of assets
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2>4. Cookies and Tracking Technologies</h2>
            <div className="card">
              <div className="card-body">
                <p>
                  We use cookies and similar tracking technologies to enhance your
                  experience on our website. Cookies are small data files stored on your
                  device that help us:
                </p>
                <ul>
                  <li>Remember your preferences and settings</li>
                  <li>Keep you logged in</li>
                  <li>Understand how you use our site</li>
                  <li>Provide personalized content and advertisements</li>
                </ul>
                <p>
                  You can control cookies through your browser settings. However,
                  disabling cookies may affect the functionality of our website.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2>5. Data Security</h2>
            <div className="card">
              <div className="card-body">
                <p>
                  We implement appropriate technical and organizational measures to
                  protect your personal information against unauthorized access, loss, or
                  misuse. However, no method of transmission over the internet is 100%
                  secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2>6. Your Rights and Choices</h2>
            <div className="card">
              <div className="card-body">
                <p>You have the right to:</p>
                <ul>
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict certain processing activities</li>
                  <li>Withdraw consent for marketing communications</li>
                  <li>Request a copy of your data in a portable format</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information
                  provided below.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2>7. Children's Privacy</h2>
            <div className="card">
              <div className="card-body">
                <p>
                  Our services are not intended for children under the age of 13. We do
                  not knowingly collect personal information from children. If you believe
                  we have collected information from a child, please contact us
                  immediately.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2>8. International Data Transfers</h2>
            <div className="card">
              <div className="card-body">
                <p>
                  Your information may be transferred to and processed in countries other
                  than your country of residence. These countries may have different data
                  protection laws. By using our services, you consent to such transfers.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2>9. Changes to This Privacy Policy</h2>
            <div className="card">
              <div className="card-body">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you
                  of any significant changes by posting the new policy on this page and
                  updating the "Last Updated" date. We encourage you to review this
                  Privacy Policy periodically.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2>10. Contact Us</h2>
            <div className="card">
              <div className="card-body">
                <p>
                  If you have any questions about this Privacy Policy or our data
                  practices, please contact us:
                </p>
                <ul className="list-unstyled">
                  <li>
                    <strong>Email:</strong> privacy@shoppingapp.com
                  </li>
                  <li>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </li>
                  <li>
                    <strong>Address:</strong> 123 Shopping Street, Commerce City, ST
                    12345
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
```

---

## Error Page

**src/pages/Error.tsx**

```typescript
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
            {process.env.NODE_ENV === 'development' && (
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
```

---

## Alternative Error Boundary Component

For catching errors within the application (not just routing errors), you should also create an Error Boundary component:

**src/components/common/ErrorBoundary.tsx**

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
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

                  {process.env.NODE_ENV === 'development' && this.state.error && (
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
```

---

## Usage in App.tsx

Update your **src/App.tsx** to include the ErrorBoundary:

```typescript
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useCartStore } from './store/cartStore';

const App: React.FC = () => {
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <ErrorBoundary>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
```

---

## Loading Component

**src/components/common/Loading.tsx**

```typescript
import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const containerClass = fullScreen
    ? 'min-vh-100 d-flex align-items-center justify-content-center'
    : 'd-flex align-items-center justify-content-center py-5';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        {message && <p className="mt-3 text-muted">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
```

---

## Update Migration Guide - Insert This Section

Add this after **Step 8.6: Other Pages** in the migration guide:

### Additional Utility Components

These components enhance error handling and user experience:

1. **ErrorBoundary** - Catches React errors within components
2. **Loading** - Reusable loading indicator
3. **Contact** - Full-featured contact form with validation
4. **Privacy** - Comprehensive privacy policy page
5. **Error** - User-friendly error page for routing errors

All pages include proper form validation, responsive design, and production-ready error handling.

---

## Notes

1. **Contact Form**: Currently logs to console. Replace with actual API endpoint for sending emails.
2. **Error Tracking**: Consider integrating services like Sentry or LogRocket for production error monitoring.
3. **Loading States**: The Loading component can be reused throughout the app for consistent UX.
4. **Privacy Policy**: Update content to match your actual data practices and legal requirements.
5. **Icons**: The examples use Bootstrap Icons. Install with: `npm install bootstrap-icons`

---

## Additional Dependencies

If using Bootstrap Icons, add to your **src/main.tsx**:

```typescript
import 'bootstrap-icons/font/bootstrap-icons.css';
```

Or in your HTML:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
```
