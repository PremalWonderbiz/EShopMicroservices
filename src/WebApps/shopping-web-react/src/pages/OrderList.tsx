import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrderStatus } from '../types/order';
import Loading from '../components/common/Loading';
import { Link } from 'react-router-dom';

const OrderList: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const { orders, loading, error } = useOrders(pageIndex, pageSize);

  if (loading) return <Loading fullScreen message="Loading your orders..." />;
  
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Orders</h4>
          <p>{error}</p>
          <button className="btn btn-danger" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap = {
      [OrderStatus.Draft]: 'secondary',
      [OrderStatus.Pending]: 'warning',
      [OrderStatus.Completed]: 'success',
      [OrderStatus.Cancelled]: 'danger',
    };
    return `badge bg-${statusMap[status]}`;
  };

  const getStatusText = (status: OrderStatus) => {
    const statusTextMap: Record<OrderStatus, string> = {
      [OrderStatus.Draft]: 'Draft',
      [OrderStatus.Pending]: 'Pending',
      [OrderStatus.Completed]: 'Completed',
      [OrderStatus.Cancelled]: 'Cancelled',
    };
    return statusTextMap[status];
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Order History</h1>
      
      {orders && orders.data.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Order Name</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.data.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <small className="text-muted">{order.id.substring(0, 8)}...</small>
                    </td>
                    <td>
                      <strong>{order.orderName}</strong>
                    </td>
                    <td>
                      <span className={getStatusBadge(order.status)}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>{order.orderItems.length} items</td>
                    <td>
                      <strong>
                        $
                        {order.orderItems
                          .reduce((sum, item) => sum + item.price * item.quantity, 0)
                          .toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <small className="text-muted">
                        {/* Add date if available in order object */}
                        N/A
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="d-flex justify-content-center align-items-center mt-4">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
              disabled={pageIndex === 1}
            >
              <i className="bi bi-chevron-left"></i> Previous
            </button>
            <span className="mx-3">
              Page <strong>{pageIndex}</strong> of{' '}
              <strong>{Math.ceil(orders.count / pageSize)}</strong>
            </span>
            <button
              className="btn btn-outline-primary ms-2"
              onClick={() => setPageIndex((p) => p + 1)}
              disabled={pageIndex >= Math.ceil(orders.count / pageSize)}
            >
              Next <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted mb-4"
          >
            <path
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
              fill="currentColor"
            />
          </svg>
          <h3>No Orders Yet</h3>
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderList;