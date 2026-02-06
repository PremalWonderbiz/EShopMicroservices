import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/order';
import { orderingService } from '../../api/orderingService';
import { Button, Card, Badge, Input } from '../../components/ui';
import { toast } from '../../components/ui/Toast';
import './Orders.css';

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await orderingService.getOrdersByCustomerId('customer-001');
      // setOrders(response.orders);

      // Mock data for demonstration
      setTimeout(() => {
        const mockOrders: Order[] = [
          {
            id: 'ORD-12345678',
            customerId: 'customer-001',
            orderName: 'Guest Order',
            status: OrderStatus.Pending,
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              emailAddress: 'john@example.com',
              addressLine: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'United States',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              emailAddress: 'john@example.com',
              addressLine: '123 Main St',
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
              { orderId: 'ORD-12345678', productId: 'prod-1', quantity: 2, price: 99.99 },
              { orderId: 'ORD-12345678', productId: 'prod-2', quantity: 1, price: 149.99 },
            ],
          },
          {
            id: 'ORD-87654321',
            customerId: 'customer-001',
            orderName: 'Guest Order',
            status: OrderStatus.Completed,
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              emailAddress: 'john@example.com',
              addressLine: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'United States',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              emailAddress: 'john@example.com',
              addressLine: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'United States',
            },
            payment: {
              cardName: 'John Doe',
              cardNumber: '5678',
              expiration: '12/25',
              cvv: '***',
              paymentMethod: 1,
            },
            orderItems: [
              { orderId: 'ORD-87654321', productId: 'prod-3', quantity: 1, price: 299.99 },
            ],
          },
          {
            id: 'ORD-11223344',
            customerId: 'customer-001',
            orderName: 'Guest Order',
            status: OrderStatus.Cancelled,
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              emailAddress: 'john@example.com',
              addressLine: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'United States',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              emailAddress: 'john@example.com',
              addressLine: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'United States',
            },
            payment: {
              cardName: 'John Doe',
              cardNumber: '9012',
              expiration: '12/25',
              cvv: '***',
              paymentMethod: 1,
            },
            orderItems: [
              { orderId: 'ORD-11223344', productId: 'prod-4', quantity: 3, price: 49.99 },
            ],
          },
        ];
        setOrders(mockOrders);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
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
          icon: Clock,
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

  const calculateOrderTotal = (order: Order) => {
    const subtotal = order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.1;
    return subtotal + shipping + tax;
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.shippingAddress.firstName.toLowerCase().includes(query) ||
          order.shippingAddress.lastName.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === OrderStatus.Pending).length;
    const completed = orders.filter((o) => o.status === OrderStatus.Completed).length;
    const cancelled = orders.filter((o) => o.status === OrderStatus.Cancelled).length;

    return { total, pending, completed, cancelled };
  };

  const filteredOrders = getFilteredOrders();
  const stats = getOrderStats();
  const orderDate = new Date();

  // Loading state
  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="orders-empty">
            <div className="empty-icon">
              <Package size={80} />
            </div>
            <h2 className="empty-title">No orders yet</h2>
            <p className="empty-description">
              Start shopping to see your orders here
            </p>
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        {/* Header */}
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">
              Track and manage all your orders in one place
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="orders-stats">
          <Card className="stat-card">
            <div className="stat-icon stat-icon-total">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon stat-icon-pending">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Processing</div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon stat-icon-completed">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Delivered</div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon stat-icon-cancelled">
              <XCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.cancelled}</div>
              <div className="stat-label">Cancelled</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="orders-filters">
          <div className="filter-search">
            <Input
              placeholder="Search by order number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>

          <div className="filter-status">
            <div className="filter-label">
              <Filter size={16} />
              <span>Status:</span>
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-button ${statusFilter === 'all' ? 'filter-button-active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-button ${
                  statusFilter === OrderStatus.Pending ? 'filter-button-active' : ''
                }`}
                onClick={() => setStatusFilter(OrderStatus.Pending)}
              >
                Processing
              </button>
              <button
                className={`filter-button ${
                  statusFilter === OrderStatus.Completed ? 'filter-button-active' : ''
                }`}
                onClick={() => setStatusFilter(OrderStatus.Completed)}
              >
                Delivered
              </button>
              <button
                className={`filter-button ${
                  statusFilter === OrderStatus.Cancelled ? 'filter-button-active' : ''
                }`}
                onClick={() => setStatusFilter(OrderStatus.Cancelled)}
              >
                Cancelled
              </button>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <Card className="no-results">
              <Package size={48} className="no-results-icon" />
              <h3 className="no-results-title">No orders found</h3>
              <p className="no-results-text">
                Try adjusting your filters or search query
              </p>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const total = calculateOrderTotal(order);
              const itemCount = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <Card
                  key={order.id}
                  className="order-card"
                  hover
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="order-card-header">
                    <div className="order-card-info">
                      <div className="order-number">
                        <Package size={18} />
                        <span>Order #{order.id}</span>
                      </div>
                      <div className="order-date">
                        <Calendar size={14} />
                        <span>
                          {orderDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <Badge variant={statusInfo.variant} size="md">
                      <StatusIcon size={16} />
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <div className="order-card-body">
                    <div className="order-details">
                      <div className="detail-item">
                        <span className="detail-label">Items:</span>
                        <span className="detail-value">{itemCount}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Total:</span>
                        <span className="detail-value detail-value-price">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Ship to:</span>
                        <span className="detail-value">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                      </div>
                    </div>

                    <div className="order-actions">
                      <Button
                        size="sm"
                        variant="outline"
                        rightIcon={<Eye size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${order.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  <ChevronRight className="order-card-arrow" size={20} />
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
