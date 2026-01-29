# Loading Component Integration Guide

This guide shows where and how to use the Loading component throughout the React application to replace inline loading states and improve user experience.

---

## Overview

The Loading component should be used in:
1. **Page-level loading** - When fetching initial data for a page
2. **Component-level loading** - When loading data within a component
3. **Action loading** - During form submissions or actions
4. **Lazy loading** - When code-splitting routes

---

## Updated Components with Loading Integration

### 1. Home Page (`src/pages/Home.tsx`)

**BEFORE:**
```typescript
if (loading) return <div className="container mt-5">Loading...</div>;
if (error) return <div className="container mt-5">Error: {error}</div>;
```

**AFTER:**
```typescript
import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import TopProduct from '../components/product/TopProduct';
import Loading from '../components/common/Loading';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types/product';

const Home: React.FC = () => {
  const { products, loading, error } = useProducts(1, 6);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      color: 'default',
    });
  };

  if (loading) return <Loading fullScreen message="Loading featured products..." />;
  
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Products</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-danger" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const topProduct = products[0];
  const regularProducts = products.slice(1);

  return (
    <div className="container mt-5">
      <div className="row">
        {topProduct && <TopProduct product={topProduct} />}
        <div className="col-md-9">
          <div className="row">
            {regularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
```

---

### 2. Product List Page (`src/pages/ProductList.tsx`)

**AFTER:**
```typescript
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/common/Loading';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types/product';

const ProductList: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 9;
  const { products, loading, error } = useProducts(pageNumber, pageSize);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      color: 'default',
    });
  };

  if (loading) return <Loading fullScreen message="Loading products..." />;
  
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Products</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Products</h1>
      {products.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">No products found.</p>
        </div>
      ) : (
        <>
          <div className="row">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-primary me-2"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber === 1}
            >
              Previous
            </button>
            <span className="align-self-center">Page {pageNumber}</span>
            <button
              className="btn btn-primary ms-2"
              onClick={() => setPageNumber((p) => p + 1)}
              disabled={products.length < pageSize}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
```

---

### 3. Product Detail Page (`src/pages/ProductDetail.tsx`)

**AFTER:**
```typescript
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import Loading from '../components/common/Loading';
import { useCartStore } from '../store/cartStore';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(productId!);
  const addItem = useCartStore((state) => state.addItem);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addItem({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        color: 'default',
      });
      
      // Show success feedback
      setTimeout(() => {
        navigate('/cart');
      }, 500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading product details..." />;
  
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Product</h4>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Product Not Found</h4>
          <p>The product you're looking for doesn't exist.</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={`/images/product/${product.imageFile}`}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p className="text-muted">
            Categories: {product.category.join(', ')}
          </p>
          <h2 className="text-danger">${product.price.toFixed(2)}</h2>
          <p className="mt-3">{product.description}</p>
          <button 
            onClick={handleAddToCart} 
            className="btn btn-success btn-lg"
            disabled={addingToCart}
          >
            {addingToCart ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding to Cart...
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
```

---

### 4. Cart Page (`src/pages/Cart.tsx`)

**AFTER:**
```typescript
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
```

---

### 5. Checkout Page (`src/pages/Checkout.tsx`)

**AFTER:**
```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCartStore } from '../store/cartStore';
import { basketService } from '../api/basketService';
import { BasketCheckout } from '../types/cart';
import Loading from '../components/common/Loading';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  emailAddress: yup.string().email('Invalid email').required('Email is required'),
  addressLine: yup.string().required('Address is required'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('Zip code is required'),
  cardName: yup.string().required('Card name is required'),
  cardNumber: yup.string().required('Card number is required'),
  expiration: yup.string().required('Expiration is required'),
  cvv: yup.string().required('CVV is required'),
});

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, loadCart, loading: cartLoading } = useCartStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const onSubmit = async (data: any) => {
    if (!cart) return;

    setSubmitting(true);
    try {
      const checkoutData: BasketCheckout = {
        ...data,
        userName: cart.userName,
        customerId: '00000000-0000-0000-0000-000000000000',
        totalPrice: cart.totalPrice,
        paymentMethod: 1,
      };

      await basketService.checkoutBasket({
        basketCheckoutDto: checkoutData,
      });

      await clearCart();
      navigate('/confirmation');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while cart is being loaded
  if (cartLoading) {
    return <Loading fullScreen message="Loading checkout..." />;
  }

  // Redirect if cart is empty
  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mt-5">
      <h1>Checkout</h1>
      
      {submitting && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="bg-white p-5 rounded shadow">
            <Loading message="Processing your order..." />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="mb-0">Shipping Information</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName.message}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName.message}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input {...register('emailAddress')} className={`form-control ${errors.emailAddress ? 'is-invalid' : ''}`} />
                  {errors.emailAddress && (
                    <div className="invalid-feedback">{errors.emailAddress.message}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input {...register('addressLine')} className={`form-control ${errors.addressLine ? 'is-invalid' : ''}`} />
                  {errors.addressLine && (
                    <div className="invalid-feedback">{errors.addressLine.message}</div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country</label>
                    <input {...register('country')} className={`form-control ${errors.country ? 'is-invalid' : ''}`} />
                    {errors.country && (
                      <div className="invalid-feedback">{errors.country.message}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State</label>
                    <input {...register('state')} className={`form-control ${errors.state ? 'is-invalid' : ''}`} />
                    {errors.state && (
                      <div className="invalid-feedback">{errors.state.message}</div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Zip Code</label>
                  <input {...register('zipCode')} className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`} />
                  {errors.zipCode && (
                    <div className="invalid-feedback">{errors.zipCode.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="mb-0">Payment Information</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Card Name</label>
                  <input {...register('cardName')} className={`form-control ${errors.cardName ? 'is-invalid' : ''}`} />
                  {errors.cardName && (
                    <div className="invalid-feedback">{errors.cardName.message}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input {...register('cardNumber')} className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`} placeholder="1234 5678 9012 3456" />
                  {errors.cardNumber && (
                    <div className="invalid-feedback">{errors.cardNumber.message}</div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Expiration</label>
                    <input
                      {...register('expiration')}
                      placeholder="MM/YY"
                      className={`form-control ${errors.expiration ? 'is-invalid' : ''}`}
                    />
                    {errors.expiration && (
                      <div className="invalid-feedback">{errors.expiration.message}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CVV</label>
                    <input {...register('cvv')} className={`form-control ${errors.cvv ? 'is-invalid' : ''}`} placeholder="123" />
                    {errors.cvv && <div className="invalid-feedback">{errors.cvv.message}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-light">
                <h4 className="mb-0">Order Summary</h4>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({cart.items.reduce((sum, i) => sum + i.quantity, 0)}):</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className="text-success">FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-success">${cart.totalPrice.toFixed(2)}</strong>
                </div>

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100 mt-3"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
```

---

### 6. Order List Page (`src/pages/OrderList.tsx`)

**AFTER:**
```typescript
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
    return OrderStatus[status];
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
```

---

### 7. App Component with Initial Loading (`src/App.tsx`)

**AFTER:**
```typescript
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loading from './components/common/Loading';
import { useCartStore } from './store/cartStore';

const App: React.FC = () => {
  const loadCart = useCartStore((state) => state.loadCart);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadCart();
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setInitializing(false);
      }
    };

    initialize();
  }, [loadCart]);

  if (initializing) {
    return <Loading fullScreen message="Initializing application..." />;
  }

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

### 8. Lazy Loading Routes (`src/main.tsx`)

**AFTER:**
```typescript
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Loading from './components/common/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<Loading fullScreen message="Loading application..." />}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
```

---

### 9. Enhanced Router with Lazy Loading (`src/router.tsx`)

**AFTER:**
```typescript
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import App from './App';
import ErrorPage from './pages/Error';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const OrderList = lazy(() => import('./pages/OrderList'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'products',
        element: <ProductList />,
      },
      {
        path: 'products/:productId',
        element: <ProductDetail />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'confirmation',
        element: <Confirmation />,
      },
      {
        path: 'orders',
        element: <OrderList />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
    ],
  },
]);
```

---

## Summary of Loading Component Usage

### ✅ Where Loading Component is Used:

1. **Page-level loading** (all pages):
   - `<Loading fullScreen message="..." />`
   - Used when fetching initial data for pages

2. **App initialization**:
   - Loading cart data on app start
   - Shows fullscreen loader during initialization

3. **Lazy route loading**:
   - Shows loader while code-splitting components load
   - Wrapped in Suspense boundary

4. **Inline action loading**:
   - Button spinner for actions (Add to Cart, Clear Cart, Submit Order)
   - Uses Bootstrap spinner for inline states

5. **Overlay loading**:
   - Checkout page uses semi-transparent overlay during submission
   - Prevents user interaction during processing

### 🎨 Loading Component Props:

```typescript
interface LoadingProps {
  message?: string;      // Custom loading message
  fullScreen?: boolean;  // Full screen vs inline display
}
```

### 📋 Best Practices:

1. **Full-screen loading**: Use for page-level data fetching
2. **Inline loading**: Use for component-level actions
3. **Button spinners**: Use for form submissions and actions
4. **Overlay loading**: Use for critical operations that should block UI
5. **Custom messages**: Provide context-specific loading messages
6. **Error handling**: Always pair loading states with error states

---

## Benefits of This Approach:

✅ **Consistent UX** - All loading states look the same
✅ **Better feedback** - Users know what's happening
✅ **Reusable component** - One component for all loading states
✅ **Performance** - Lazy loading improves initial load time
✅ **Accessibility** - Proper ARIA labels and semantic HTML
✅ **Professional** - Loading states match Bootstrap design system

---

This completes the comprehensive integration of the Loading component throughout your React application!
