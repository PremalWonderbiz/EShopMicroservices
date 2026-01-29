import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/cart/CartItem';
import Loading from '../components/common/Loading';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, loadCart, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setClearing(true);
      try {
        await clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
        alert('Failed to clear cart. Please try again.');
      } finally {
        setClearing(false);
      }
    }
  };

  if (loading) return <Loading fullScreen message="Loading your cart..." />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="py-5">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted mb-4"
          >
            <path
              d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
              fill="currentColor"
            />
          </svg>
          <h2>Your cart is empty</h2>
          <p className="text-muted">Start shopping to add items to your cart</p>
          <Link to="/products" className="btn btn-primary btn-lg mt-3">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Shopping Cart</h1>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </tbody>
      </table>
      <div className="row mt-4">
        <div className="col-md-8"></div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Order Summary</h4>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong className="text-success">${cart.totalPrice.toFixed(2)}</strong>
              </div>
              <button 
                onClick={handleCheckout} 
                className="btn btn-success btn-lg w-100 mt-3"
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={handleClearCart} 
                className="btn btn-outline-danger w-100 mt-2"
                disabled={clearing}
              >
                {clearing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Clearing...
                  </>
                ) : (
                  'Clear Cart'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;