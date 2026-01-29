import React from 'react';
import { Link } from 'react-router-dom';

const Confirmation: React.FC = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="alert alert-success">
        <h1>Order Placed Successfully!</h1>
        <p className="lead mt-3">Thank you for your purchase.</p>
        <p>Your order has been confirmed and will be processed soon.</p>
        <div className="mt-4">
          <Link to="/orders" className="btn btn-primary me-2">
            View Orders
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;