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