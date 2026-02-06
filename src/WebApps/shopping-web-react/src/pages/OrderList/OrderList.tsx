import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  ChevronRight,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from 'lucide-react';
import type { Order } from '../../types/order';
import { OrderStatus } from '../../types/order';
import { useOrders } from '../../hooks/useOrders';
import { Button, Card, Badge, Input } from '../../components/ui';
import './OrderList.css';

export const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const { orders, loading } = useOrders();

  const filteredOrders = useMemo(() => {
    let filtered = orders?.data ?? [];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.orderName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [orders, statusFilter, searchQuery]);

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Draft:
        return {
          label: 'Draft',
          variant: 'neutral' as const,
          icon: FileText,
        };
      case OrderStatus.Pending:
        return {
          label: 'Processing',
          variant: 'warning' as const,
          icon: Clock,
        };
      case OrderStatus.Completed:
        return {
          label: 'Delivered',
          variant: 'success' as const,
          icon: CheckCircle,
        };
      case OrderStatus.Cancelled:
        return {
          label: 'Cancelled',
          variant: 'error' as const,
          icon: XCircle,
        };
      default:
        return {
          label: 'Unknown',
          variant: 'neutral' as const,
          icon: Package,
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

  const statusCounts = {
    all: orders?.data.length ?? 0,
    [OrderStatus.Draft]: orders?.data.filter((o) => o.status === OrderStatus.Draft).length ?? 0,
    [OrderStatus.Pending]: orders?.data.filter((o) => o.status === OrderStatus.Pending).length ?? 0,
    [OrderStatus.Completed]: orders?.data.filter((o) => o.status === OrderStatus.Completed).length ?? 0,
    [OrderStatus.Cancelled]: orders?.data.filter((o) => o.status === OrderStatus.Cancelled).length ?? 0,
  };

  if (loading) {
    return (
      <div className="order-list-page">
        <div className="container">
          <div className="order-loading">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-list-page">
      <div className="container">
        {/* Header */}
        <div className="order-list-header">
          <div>
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">
              Track and manage your orders
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="filters-card">
          <div className="filters-content">
            {/* Search */}
            <div className="filter-search">
              <Input
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={18} />}
              />
            </div>

            {/* Status Filters */}
            <div className="filter-tabs">
              <button
                className={`filter-tab ${statusFilter === 'all' ? 'filter-tab-active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All Orders
                <Badge variant="neutral" size="sm">
                  {statusCounts.all}
                </Badge>
              </button>

              <button
                className={`filter-tab ${statusFilter === OrderStatus.Pending ? 'filter-tab-active' : ''}`}
                onClick={() => setStatusFilter(OrderStatus.Pending)}
              >
                <Clock size={16} />
                Processing
                <Badge variant="warning" size="sm">
                  {statusCounts[OrderStatus.Pending]}
                </Badge>
              </button>

              <button
                className={`filter-tab ${statusFilter === OrderStatus.Completed ? 'filter-tab-active' : ''}`}
                onClick={() => setStatusFilter(OrderStatus.Completed)}
              >
                <CheckCircle size={16} />
                Delivered
                <Badge variant="success" size="sm">
                  {statusCounts[OrderStatus.Completed]}
                </Badge>
              </button>

              <button
                className={`filter-tab ${statusFilter === OrderStatus.Cancelled ? 'filter-tab-active' : ''}`}
                onClick={() => setStatusFilter(OrderStatus.Cancelled)}
              >
                <XCircle size={16} />
                Cancelled
                <Badge variant="error" size="sm">
                  {statusCounts[OrderStatus.Cancelled]}
                </Badge>
              </button>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <Package size={80} className="empty-icon" />
            <h2 className="empty-title">
              {searchQuery || statusFilter !== 'all'
                ? 'No orders found'
                : 'No orders yet'}
            </h2>
            <p className="empty-description">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Start shopping to see your orders here'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/products')}
              >
                Start Shopping
              </Button>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const total = calculateOrderTotal(order);
              const itemCount = order.orderItems.reduce(
                (sum, item) => sum + item.quantity,
                0
              );

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
                        <Package size={20} />
                        <span>Order #{order.id}</span>
                      </div>
                      <Badge variant={statusInfo.variant} size="md">
                        <StatusIcon size={16} />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="order-card-meta">
                      <span className="meta-item">
                        <Calendar size={14} />
                        {new Date().toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="meta-separator">•</span>
                      <span className="meta-item">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  <div className="order-card-body">
                    {/* Order Items Preview */}
                    <div className="order-items-preview">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <div key={index} className="preview-item">
                          <div className="preview-image">
                            <img
                              // src="/api/placeholder/60/60"
                              src="/default.jpg"
                              alt={`Product ${item.productId}`}                              
                            />
                          </div>
                          <div className="preview-details">
                            <span className="preview-name">
                              Product #{item.productId}
                            </span>
                            <span className="preview-qty">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}

                      {order.orderItems.length > 3 && (
                        <div className="preview-more">
                          +{order.orderItems.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <div className="order-address">
                      <strong>Shipping to:</strong>
                      <span>
                        {order.shippingAddress.firstName}{' '}
                        {order.shippingAddress.lastName}
                      </span>
                      <span>{order.shippingAddress.addressLine}</span>
                      <span>
                        {order.shippingAddress.state}{' '}
                        {order.shippingAddress.zipCode}
                      </span>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <div className="order-total">
                      <DollarSign size={18} />
                      <span className="total-label">Total:</span>
                      <span className="total-value">${total.toFixed(2)}</span>
                    </div>

                    <Button variant="outline" size="sm" rightIcon={<ChevronRight />}>
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
