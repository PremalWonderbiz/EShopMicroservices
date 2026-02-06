import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight, Download, Home } from 'lucide-react';
import { Button, Card } from '../../components/ui';
import './Confirmation.css';

export const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    // If no order data, redirect to home
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  // Generate mock order number
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="confirmation-page">
      <div className="container">
        {/* Success Animation */}
        <div className="confirmation-header">
          <div className="success-animation">
            <div className="success-circle">
              <CheckCircle className="success-icon" />
            </div>
          </div>

          <h1 className="confirmation-title">Order Confirmed!</h1>
          <p className="confirmation-subtitle">
            Thank you for your purchase. We've received your order and will start processing it right away.
          </p>

          <div className="order-number">
            <span className="order-number-label">Order Number:</span>
            <span className="order-number-value">{orderNumber}</span>
          </div>
        </div>

        <div className="confirmation-content">
          {/* Order Details */}
          <div className="confirmation-main">
            {/* Delivery Timeline */}
            <Card className="timeline-card">
              <h2 className="section-title">
                <Package size={24} />
                Delivery Timeline
              </h2>

              <div className="timeline">
                <div className="timeline-step timeline-step-active">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Order Confirmed</h3>
                    <p className="timeline-time">Just now</p>
                    <p className="timeline-description">
                      Your order has been confirmed and is being prepared
                    </p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Processing</h3>
                    <p className="timeline-time">Within 24 hours</p>
                    <p className="timeline-description">
                      We'll pack your items with care
                    </p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Shipped</h3>
                    <p className="timeline-time">1-2 business days</p>
                    <p className="timeline-description">
                      Your order is on its way
                    </p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Delivered</h3>
                    <p className="timeline-time">
                      Est. {estimatedDelivery.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="timeline-description">
                      Enjoy your purchase!
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="detail-card">
              <h2 className="section-title">Shipping Address</h2>
              <div className="detail-content">
                <p className="detail-text">
                  {orderData.firstName} {orderData.lastName}
                </p>
                <p className="detail-text">{orderData.addressLine}</p>
                <p className="detail-text">
                  {orderData.city}, {orderData.state} {orderData.zipCode}
                </p>
                <p className="detail-text">{orderData.country}</p>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="detail-card">
              <h2 className="section-title">Payment Method</h2>
              <div className="detail-content">
                <div className="payment-info">
                  <span className="payment-icon">💳</span>
                  <div>
                    <p className="detail-text">
                      {orderData.cardName}
                    </p>
                    <p className="detail-text detail-text-muted">
                      Card ending in {orderData.cardNumber?.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="confirmation-sidebar">
            {/* Email Confirmation */}
            <Card className="notification-card">
              <div className="notification-icon">
                <Mail size={24} />
              </div>
              <h3 className="notification-title">Check Your Email</h3>
              <p className="notification-text">
                We've sent a confirmation email to:
              </p>
              <p className="notification-email">{orderData.emailAddress}</p>
            </Card>

            {/* Order Summary */}
            <Card className="summary-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${(orderData.totalPrice - orderData.totalPrice * 0.1 - (orderData.totalPrice > 50 ? 0 : 9.99)).toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{orderData.totalPrice > 50 ? 'FREE' : '$9.99'}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>${(orderData.totalPrice * 0.1).toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${orderData.totalPrice.toFixed(2)}</span>
              </div>
            </Card>

            {/* Actions */}
            <div className="confirmation-actions">
              <Button
                fullWidth
                variant="outline"
                leftIcon={<Download />}
                onClick={handlePrint}
              >
                Download Receipt
              </Button>
              
              <Button
                fullWidth
                variant="primary"
                rightIcon={<ArrowRight />}
                onClick={() => navigate('/orders')}
              >
                View Orders
              </Button>
              
              <Button
                fullWidth
                variant="ghost"
                leftIcon={<Home />}
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>

            {/* Customer Support */}
            <Card className="support-card">
              <h3 className="support-title">Need Help?</h3>
              <p className="support-text">
                Our customer support team is here to help you with any questions about your order.
              </p>
              <Button
                fullWidth
                variant="outline"
                size="sm"
                onClick={() => navigate('/contact')}
              >
                Contact Support
              </Button>
            </Card>
          </div>
        </div>

        {/* Trust Section */}
        <div className="trust-section">
          <div className="trust-item">
            <div className="trust-icon">📦</div>
            <h4 className="trust-title">Fast Shipping</h4>
            <p className="trust-text">Delivered within 3-5 business days</p>
          </div>
          
          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <h4 className="trust-title">Secure Payment</h4>
            <p className="trust-text">Your payment information is protected</p>
          </div>
          
          <div className="trust-item">
            <div className="trust-icon">↩️</div>
            <h4 className="trust-title">Easy Returns</h4>
            <p className="trust-text">30-day money-back guarantee</p>
          </div>
          
          <div className="trust-item">
            <div className="trust-icon">💬</div>
            <h4 className="trust-title">24/7 Support</h4>
            <p className="trust-text">We're here whenever you need us</p>
          </div>
        </div>
      </div>
    </div>
  );
};
