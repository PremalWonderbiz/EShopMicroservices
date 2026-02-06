import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Button, Card, Badge } from '../../components/ui';
import { toast } from '../../components/ui/Toast';
import './Cart.css';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeItem, loadCart } = useCartStore();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: string, productName: string) => {
    try {
      await removeItem(productId);
      toast.success(`${productName} removed from cart`);
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  // Calculate totals
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  // Loading state
  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="empty-icon">
              <ShoppingBag size={80} />
            </div>
            <h2 className="empty-title">Your cart is empty</h2>
            <p className="empty-description">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight />}
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
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="cart-header">
          <div>
            <h1 className="cart-title">Shopping Cart</h1>
            <p className="cart-subtitle">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft />}
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-section">
            <Card padding="none" className="cart-items-card">
              <div className="cart-items-header">
                <span>Product</span>
                <span className="header-price">Price</span>
                <span className="header-quantity">Quantity</span>
                <span className="header-total">Total</span>
                <span className="header-actions"></span>
              </div>

              <div className="cart-items-list">
                {cart.items.map((item) => (
                  <div key={item.productId} className="cart-item">
                    {/* Product Info */}
                    <div className="cart-item-product">
                      <div className="cart-item-image">
                        <img
                          src={`/api/placeholder/120/120`}
                          alt={item.productName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                          }}
                        />
                      </div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.productName}</h3>
                        {item.color && item.color !== 'Default' && (
                          <div className="cart-item-meta">
                            <span>Color: {item.color}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="cart-item-price">
                      <span className="price-label">Price:</span>
                      <span className="price-value">${item.price.toFixed(2)}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="cart-item-quantity">
                      <span className="quantity-label">Quantity:</span>
                      <div className="quantity-controls">
                        <button
                          className="quantity-button"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-button"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="cart-item-total">
                      <span className="total-label">Total:</span>
                      <span className="total-value">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <div className="cart-item-actions">
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveItem(item.productId, item.productName)}
                        aria-label={`Remove ${item.productName}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Free Shipping Banner */}
            {subtotal > 0 && subtotal < 50 && (
              <div className="shipping-banner">
                <Badge variant="warning" size="md">
                  Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                </Badge>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="cart-summary-section">
            <Card className="cart-summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-items">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">${subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-value">
                    {shipping === 0 ? (
                      <Badge variant="success" size="sm">FREE</Badge>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Estimated Tax</span>
                  <span className="summary-value">${tax.toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row summary-total">
                  <span className="summary-label">Total</span>
                  <span className="summary-value">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight />}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="trust-badge">
                  <span className="trust-icon">🔒</span>
                  <span className="trust-text">Secure Checkout</span>
                </div>
                <div className="trust-badge">
                  <span className="trust-icon">↩️</span>
                  <span className="trust-text">30-Day Returns</span>
                </div>
                <div className="trust-badge">
                  <span className="trust-icon">✓</span>
                  <span className="trust-text">Quality Guaranteed</span>
                </div>
              </div>
            </Card>

            {/* Promo Code (Future Feature) */}
            <Card className="promo-card">
              <h3 className="promo-title">Have a promo code?</h3>
              <div className="promo-input-group">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="promo-input"
                  disabled
                />
                <Button variant="outline" size="sm" disabled>
                  Apply
                </Button>
              </div>
              <p className="promo-note">Coming soon!</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
