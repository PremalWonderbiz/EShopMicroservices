import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Download,
  ArrowLeft,
  Mail,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/order';
import { Button, Card, Badge } from '../../components/ui';
import { toast } from '../../components/ui/Toast';
import './OrderDetail.css';

export const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await orderService.getOrderById(orderId);
      // setOrder(response.order);

      // Mock data for demonstration
      setTimeout(() => {
        const mockOrder: Order = {
          id: orderId || 'ORD-12345678',
          customerId: 'customer-001',
          orderName: 'Guest Order',
          status: OrderStatus.Pending,
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            emailAddress: 'john.doe@example.com',
            addressLine: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
          },
          billingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            emailAddress: 'john.doe@example.com',
            addressLine: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
          },
          payment: {
            cardName: 'John Doe',
            cardNumber: '1234',
            expiration: '12/25',
            cvv: '***',
            paymentMethod: 1,
          },
          orderItems: [
            {
              orderId: orderId || 'ORD-12345678',
              productId: 'prod-1',
              quantity: 2,
              price: 99.99,
            },
            {
              orderId: orderId || 'ORD-12345678',
              productId: 'prod-2',
              quantity: 1,
              price: 149.99,
            },
          ],
        };
        setOrder(mockOrder);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order details');
      setLoading(false);
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Draft:
        return {
          label: 'Draft',
          variant: 'neutral' as const,
          icon: Package,
          color: 'var(--color-gray-600)',
        };
      case OrderStatus.Pending:
        return {
          label: 'Processing',
          variant: 'warning' as const,
          icon: Package,
          color: 'var(--color-warning-600)',
        };
      case OrderStatus.Completed:
        return {
          label: 'Delivered',
          variant: 'success' as const,
          icon: CheckCircle,
          color: 'var(--color-success-600)',
        };
      case OrderStatus.Cancelled:
        return {
          label: 'Cancelled',
          variant: 'error' as const,
          icon: XCircle,
          color: 'var(--color-error-600)',
        };
      default:
        return {
          label: 'Unknown',
          variant: 'neutral' as const,
          icon: Package,
          color: 'var(--color-gray-600)',
        };
    }
  };

  const calculateTotal = () => {
    if (!order) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };

    const subtotal = order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReorder = () => {
    // TODO: Implement reorder functionality
    toast.success('Items added to cart!');
    navigate('/cart');
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      // TODO: Implement cancel order API call
      toast.success('Order cancelled successfully');
      loadOrderDetails();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-loading">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-error">
            <Package size={64} className="error-icon" />
            <h2>Order Not Found</h2>
            <p>We couldn't find the order you're looking for.</p>
            <Button onClick={() => navigate('/orders')}>
              View All Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const totals = calculateTotal();
  const orderDate = new Date();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="order-detail-page">
      <div className="container">
        {/* Header */}
        <div className="order-detail-header">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft />}
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>

          <div className="header-actions">
            <Button variant="outline" leftIcon={<Download />} onClick={handlePrint}>
              Download
            </Button>
            {order.status !== OrderStatus.Cancelled && (
              <Button variant="primary" leftIcon={<RefreshCw />} onClick={handleReorder}>
                Reorder
              </Button>
            )}
          </div>
        </div>

        {/* Order Info Banner */}
        <Card className="order-info-banner">
          <div className="banner-content">
            <div className="banner-main">
              <h1 className="order-number">Order #{order.id}</h1>
              <div className="order-meta">
                <span className="meta-item">
                  <Calendar size={16} />
                  Placed on {orderDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="meta-separator">•</span>
                <span className="meta-item">
                  {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>
            </div>
            <Badge variant={statusInfo.variant} size="lg" className="status-badge">
              <StatusIcon size={18} />
              {statusInfo.label}
            </Badge>
          </div>
        </Card>

        <div className="order-detail-content">
          {/* Main Content */}
          <div className="order-detail-main">
            {/* Order Timeline */}
            <Card className="timeline-card">
              <h2 className="section-title">
                <Truck size={24} />
                Order Timeline
              </h2>

              <div className="order-timeline">
                <div
                  className={`timeline-step ${
                    order.status >= OrderStatus.Pending ? 'timeline-step-completed' : ''
                  }`}
                >
                  <div className="timeline-marker">
                    <CheckCircle size={20} />
                  </div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Order Placed</h3>
                    <p className="timeline-time">
                      {orderDate.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="timeline-description">
                      Your order has been confirmed
                    </p>
                  </div>
                </div>

                <div
                  className={`timeline-step ${
                    order.status >= OrderStatus.Pending ? 'timeline-step-active' : ''
                  } ${order.status > OrderStatus.Pending ? 'timeline-step-completed' : ''}`}
                >
                  <div className="timeline-marker">
                    {order.status > OrderStatus.Pending ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Processing</h3>
                    <p className="timeline-time">
                      {order.status >= OrderStatus.Pending ? 'In progress' : 'Pending'}
                    </p>
                    <p className="timeline-description">
                      We're preparing your items for shipment
                    </p>
                  </div>
                </div>

                <div
                  className={`timeline-step ${
                    order.status === OrderStatus.Completed ? 'timeline-step-completed' : ''
                  }`}
                >
                  <div className="timeline-marker">
                    {order.status === OrderStatus.Completed ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Truck size={20} />
                    )}
                  </div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Shipped</h3>
                    <p className="timeline-time">
                      {order.status === OrderStatus.Completed
                        ? 'Completed'
                        : 'Expected in 1-2 days'}
                    </p>
                    <p className="timeline-description">
                      Your package is on the way
                    </p>
                  </div>
                </div>

                <div
                  className={`timeline-step ${
                    order.status === OrderStatus.Completed ? 'timeline-step-completed' : ''
                  }`}
                >
                  <div className="timeline-marker">
                    {order.status === OrderStatus.Completed ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Delivered</h3>
                    <p className="timeline-time">
                      {order.status === OrderStatus.Completed
                        ? 'Completed'
                        : `Est. ${estimatedDelivery.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}`}
                    </p>
                    <p className="timeline-description">
                      Package delivered to your address
                    </p>
                  </div>
                </div>
              </div>

              {order.status === OrderStatus.Cancelled && (
                <div className="cancelled-notice">
                  <XCircle size={20} />
                  <span>This order has been cancelled</span>
                </div>
              )}
            </Card>

            {/* Order Items */}
            <Card className="items-card">
              <h2 className="section-title">
                <Package size={24} />
                Order Items
              </h2>

              <div className="order-items-list">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img
                        src="/api/placeholder/80/80"
                        alt={`Product ${item.productId}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">Product #{item.productId}</h3>
                      <p className="item-meta">Quantity: {item.quantity}</p>
                      <p className="item-price">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Addresses */}
            <div className="addresses-grid">
              <Card className="address-card">
                <h3 className="address-title">
                  <MapPin size={20} />
                  Shipping Address
                </h3>
                <div className="address-content">
                  <p>
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.addressLine}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <div className="address-contact">
                    <span>
                      <Mail size={14} />
                      {order.shippingAddress.emailAddress}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="address-card">
                <h3 className="address-title">
                  <CreditCard size={20} />
                  Payment Method
                </h3>
                <div className="address-content">
                  <div className="payment-details">
                    <span className="payment-icon">💳</span>
                    <div>
                      <p className="payment-name">{order.payment.cardName}</p>
                      <p className="payment-number">
                        •••• •••• •••• {order.payment.cardNumber}
                      </p>
                      <p className="payment-expiry">Expires {order.payment.expiration}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="order-detail-sidebar">
            {/* Order Summary */}
            <Card className="summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>
                    {totals.shipping === 0 ? (
                      <Badge variant="success" size="sm">
                        FREE
                      </Badge>
                    ) : (
                      `$${totals.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="actions-card">
              <h3 className="actions-title">Need Help?</h3>
              <p className="actions-text">
                Contact our support team for any questions about your order.
              </p>
              <div className="actions-buttons">
                <Button fullWidth variant="outline" onClick={() => navigate('/contact')}>
                  Contact Support
                </Button>
                {order.status === OrderStatus.Pending && (
                  <Button fullWidth variant="outline" onClick={handleCancelOrder}>
                    Cancel Order
                  </Button>
                )}
              </div>
            </Card>

            {/* Tracking Info (if available) */}
            {order.status === OrderStatus.Completed && (
              <Card className="tracking-card">
                <h3 className="tracking-title">
                  <Truck size={20} />
                  Tracking Information
                </h3>
                <p className="tracking-number">Tracking #: TRK{order.id.slice(-6)}</p>
                <Button fullWidth variant="primary" size="sm">
                  Track Package
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
