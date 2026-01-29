# Complete Migration Guide: .NET Razor Pages Shopping App to React

## Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture Analysis](#architecture-analysis)
3. [Migration Strategy](#migration-strategy)
4. [Step-by-Step Migration Plan](#step-by-step-migration-plan)
5. [Component Mapping](#component-mapping)
6. [State Management Strategy](#state-management-strategy)
7. [API Integration](#api-integration)
8. [Routing Setup](#routing-setup)
9. [Styling Migration](#styling-migration)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Considerations](#deployment-considerations)

---

## Application Overview

### Current Application (.NET Razor Pages)
**Type:** E-commerce Shopping Web Application  
**Framework:** ASP.NET Core 8.0 Razor Pages  
**Architecture:** Server-side rendered with API Gateway integration

### Key Features Identified:
1. **Product Catalog**
   - Product listing with pagination
   - Product detail view
   - Category filtering
   - Search functionality

2. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - View cart total

3. **Checkout Process**
   - Shipping information
   - Billing information
   - Payment details

4. **Order Management**
   - Order history/listing with pagination
   - Order confirmation

5. **Static Pages**
   - Contact page
   - Privacy policy
   - Error handling

---

## Architecture Analysis

### Current Backend Services (via API Gateway)
```
API Gateway: https://localhost:6064
├── Catalog Service: /catalog-service/*
│   ├── GET /products (paginated)
│   ├── GET /products/{id}
│   └── GET /products/category/{category}
├── Basket Service: /basket-service/*
│   ├── GET /basket/{userName}
│   ├── POST /basket
│   ├── DELETE /basket/{userName}
│   └── POST /basket/checkout
└── Ordering Service: /ordering-service/*
    ├── GET /orders (paginated)
    ├── GET /orders/{orderName}
    └── GET /orders/customer/{customerId}
```

### Current Data Models

#### Catalog Models
```typescript
// Product
- Id: Guid
- Name: string
- Category: string[]
- Description: string
- ImageFile: string
- Price: decimal
```

#### Basket Models
```typescript
// ShoppingCart
- UserName: string
- Items: ShoppingCartItem[]
- TotalPrice: calculated

// ShoppingCartItem
- Quantity: number
- Color: string
- Price: decimal
- ProductId: Guid
- ProductName: string

// BasketCheckout
- UserName, CustomerId, TotalPrice
- FirstName, LastName, EmailAddress
- AddressLine, Country, State, ZipCode
- CardName, CardNumber, Expiration, CVV
- PaymentMethod: number
```

#### Order Models
```typescript
// Order
- Id: Guid
- CustomerId: Guid
- OrderName: string
- ShippingAddress: Address
- BillingAddress: Address
- Payment: Payment
- Status: enum (Draft, Pending, Completed, Cancelled)
- OrderItems: OrderItem[]

// OrderItem
- OrderId, ProductId: Guid
- Quantity: number
- Price: decimal

// Address
- FirstName, LastName, EmailAddress
- AddressLine, Country, State, ZipCode

// Payment
- CardName, CardNumber, Expiration, Cvv
- PaymentMethod: number
```

### Current Page Structure
1. **Index.cshtml** - Home page with featured products
2. **ProductList.cshtml** - Product catalog with filtering
3. **ProductDetail.cshtml** - Single product view
4. **Cart.cshtml** - Shopping cart
5. **Checkout.cshtml** - Checkout form
6. **Confirmation.cshtml** - Order confirmation
7. **OrderList.cshtml** - Order history
8. **Contact.cshtml** - Contact page
9. **Privacy.cshtml** - Privacy policy
10. **Error.cshtml** - Error page

---

## Migration Strategy

### Recommended Approach: **Big Bang Migration with Feature Parity**

#### Phase 1: Setup & Infrastructure (Week 1)
- Initialize React project
- Setup development environment
- Configure build tools
- Setup routing
- Configure API client

#### Phase 2: Core Components & Services (Week 2)
- Create shared components
- Implement API services
- Setup state management
- Create layout components

#### Phase 3: Feature Implementation (Weeks 3-4)
- Implement product catalog
- Implement shopping cart
- Implement checkout flow
- Implement order management

#### Phase 4: Polish & Testing (Week 5)
- Styling refinement
- Error handling
- Testing
- Performance optimization

#### Phase 5: Deployment (Week 6)
- Production build setup
- Deployment configuration
- Monitoring setup
- Documentation

---

## Step-by-Step Migration Plan

### PHASE 1: Project Setup

#### Step 1.1: Initialize React Project
```bash
# Using Vite (recommended for modern React)
npm create vite@latest shopping-web-react -- --template react-ts

# OR using Create React App
npx create-react-app shopping-web-react --template typescript

# Navigate to project
cd shopping-web-react
```

#### Step 1.2: Install Core Dependencies
```bash
# Core dependencies
npm install react-router-dom axios

# UI Framework (choose one)
npm install bootstrap react-bootstrap
# OR
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Form handling
npm install react-hook-form yup @hookform/resolvers

# State management
npm install zustand
# OR
npm install @reduxjs/toolkit react-redux

# Utilities
npm install date-fns uuid

# Development dependencies
npm install -D @types/react-router-dom @types/uuid
```

#### Step 1.3: Project Structure
```
shopping-web-react/
├── public/
│   ├── images/
│   │   └── product/          # Product images
│   └── index.html
├── src/
│   ├── api/                  # API service layer
│   │   ├── client.ts         # Axios configuration
│   │   ├── catalogService.ts
│   │   ├── basketService.ts
│   │   └── orderingService.ts
│   ├── components/           # Reusable components
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Loading.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductItem.tsx
│   │   │   └── TopProduct.tsx
│   │   ├── cart/
│   │   │   └── CartItem.tsx
│   │   └── order/
│   │       └── OrderItem.tsx
│   ├── pages/                # Page components
│   │   ├── Home.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Confirmation.tsx
│   │   ├── OrderList.tsx
│   │   ├── Contact.tsx
│   │   ├── Privacy.tsx
│   │   └── Error.tsx
│   ├── hooks/                # Custom hooks
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   └── useOrders.ts
│   ├── store/                # State management
│   │   ├── cartStore.ts
│   │   └── userStore.ts
│   ├── types/                # TypeScript types
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   └── order.ts
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── config/               # Configuration
│   │   └── constants.ts
│   ├── styles/               # Global styles
│   │   └── global.css
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

#### Step 1.4: Environment Configuration
Create `.env` file:
```env
VITE_API_GATEWAY_URL=https://localhost:6064
VITE_DEFAULT_USERNAME=swn
```

Create `.env.example`:
```env
VITE_API_GATEWAY_URL=your_api_gateway_url
VITE_DEFAULT_USERNAME=default_username
```

---

### PHASE 2: Type Definitions

#### Step 2.1: Create Type Definitions

**src/types/product.ts**
```typescript
export interface Product {
  id: string;
  name: string;
  category: string[];
  description: string;
  imageFile: string;
  price: number;
}

export interface GetProductsResponse {
  products: Product[];
}

export interface GetProductByIdResponse {
  product: Product;
}

export interface GetProductByCategoryResponse {
  products: Product[];
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}
```

**src/types/cart.ts**
```typescript
export interface ShoppingCartItem {
  quantity: number;
  color: string;
  price: number;
  productId: string;
  productName: string;
}

export interface ShoppingCart {
  userName: string;
  items: ShoppingCartItem[];
  totalPrice: number;
}

export interface GetBasketResponse {
  cart: ShoppingCart;
}

export interface StoreBasketRequest {
  cart: ShoppingCart;
}

export interface StoreBasketResponse {
  userName: string;
}

export interface DeleteBasketResponse {
  isSuccess: boolean;
}

export interface BasketCheckout {
  userName: string;
  customerId: string;
  totalPrice: number;
  // Shipping and Billing
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine: string;
  country: string;
  state: string;
  zipCode: string;
  // Payment
  cardName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  paymentMethod: number;
}

export interface CheckoutBasketRequest {
  basketCheckoutDto: BasketCheckout;
}

export interface CheckoutBasketResponse {
  isSuccess: boolean;
}
```

**src/types/order.ts**
```typescript
export enum OrderStatus {
  Draft = 1,
  Pending = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface Address {
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine: string;
  country: string;
  state: string;
  zipCode: string;
}

export interface Payment {
  cardName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  paymentMethod: number;
}

export interface OrderItem {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  orderName: string;
  shippingAddress: Address;
  billingAddress: Address;
  payment: Payment;
  status: OrderStatus;
  orderItems: OrderItem[];
}

export interface PaginatedResult<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface GetOrdersResponse {
  orders: PaginatedResult<Order>;
}

export interface GetOrdersByNameResponse {
  orders: Order[];
}

export interface GetOrdersByCustomerResponse {
  orders: PaginatedResult<Order>;
}
```

---

### PHASE 3: API Services

#### Step 3.1: Configure Axios Client

**src/api/client.ts**
```typescript
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://localhost:6064';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (error.response?.status === 404) {
      // Handle not found
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Step 3.2: Catalog Service

**src/api/catalogService.ts**
```typescript
import apiClient from './client';
import {
  GetProductsResponse,
  GetProductByIdResponse,
  GetProductByCategoryResponse,
  PaginationParams,
} from '../types/product';

export const catalogService = {
  getProducts: async (params?: PaginationParams): Promise<GetProductsResponse> => {
    const { pageNumber = 1, pageSize = 10 } = params || {};
    const response = await apiClient.get<GetProductsResponse>(
      `/catalog-service/products`,
      { params: { pageNumber, pageSize } }
    );
    return response.data;
  },

  getProduct: async (id: string): Promise<GetProductByIdResponse> => {
    const response = await apiClient.get<GetProductByIdResponse>(
      `/catalog-service/products/${id}`
    );
    return response.data;
  },

  getProductsByCategory: async (category: string): Promise<GetProductByCategoryResponse> => {
    const response = await apiClient.get<GetProductByCategoryResponse>(
      `/catalog-service/products/category/${category}`
    );
    return response.data;
  },
};
```

#### Step 3.3: Basket Service

**src/api/basketService.ts**
```typescript
import apiClient from './client';
import {
  GetBasketResponse,
  StoreBasketRequest,
  StoreBasketResponse,
  DeleteBasketResponse,
  CheckoutBasketRequest,
  CheckoutBasketResponse,
  ShoppingCart,
} from '../types/cart';

const DEFAULT_USERNAME = import.meta.env.VITE_DEFAULT_USERNAME || 'swn';

export const basketService = {
  getBasket: async (userName: string = DEFAULT_USERNAME): Promise<GetBasketResponse> => {
    const response = await apiClient.get<GetBasketResponse>(
      `/basket-service/basket/${userName}`
    );
    return response.data;
  },

  storeBasket: async (request: StoreBasketRequest): Promise<StoreBasketResponse> => {
    const response = await apiClient.post<StoreBasketResponse>(
      `/basket-service/basket`,
      request
    );
    return response.data;
  },

  deleteBasket: async (userName: string = DEFAULT_USERNAME): Promise<DeleteBasketResponse> => {
    const response = await apiClient.delete<DeleteBasketResponse>(
      `/basket-service/basket/${userName}`
    );
    return response.data;
  },

  checkoutBasket: async (request: CheckoutBasketRequest): Promise<CheckoutBasketResponse> => {
    const response = await apiClient.post<CheckoutBasketResponse>(
      `/basket-service/basket/checkout`,
      request
    );
    return response.data;
  },

  loadUserBasket: async (): Promise<ShoppingCart> => {
    try {
      const response = await basketService.getBasket(DEFAULT_USERNAME);
      return response.cart;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Return empty basket if not found
        return {
          userName: DEFAULT_USERNAME,
          items: [],
          totalPrice: 0,
        };
      }
      throw error;
    }
  },
};
```

#### Step 3.4: Ordering Service

**src/api/orderingService.ts**
```typescript
import apiClient from './client';
import {
  GetOrdersResponse,
  GetOrdersByNameResponse,
  GetOrdersByCustomerResponse,
} from '../types/order';

export const orderingService = {
  getOrders: async (pageIndex: number = 1, pageSize: number = 10): Promise<GetOrdersResponse> => {
    const response = await apiClient.get<GetOrdersResponse>(
      `/ordering-service/orders`,
      { params: { pageIndex, pageSize } }
    );
    return response.data;
  },

  getOrdersByName: async (orderName: string): Promise<GetOrdersByNameResponse> => {
    const response = await apiClient.get<GetOrdersByNameResponse>(
      `/ordering-service/orders/${orderName}`
    );
    return response.data;
  },

  getOrdersByCustomer: async (customerId: string): Promise<GetOrdersByCustomerResponse> => {
    const response = await apiClient.get<GetOrdersByCustomerResponse>(
      `/ordering-service/orders/customer/${customerId}`
    );
    return response.data;
  },
};
```

---

### PHASE 4: State Management (Zustand)

#### Step 4.1: Cart Store

**src/store/cartStore.ts**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShoppingCart, ShoppingCartItem } from '../types/cart';
import { basketService } from '../api/basketService';

interface CartStore {
  cart: ShoppingCart | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadCart: () => Promise<void>;
  addItem: (item: ShoppingCartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,

      loadCart: async () => {
        set({ loading: true, error: null });
        try {
          const cart = await basketService.loadUserBasket();
          set({ cart, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      addItem: async (item: ShoppingCartItem) => {
        const { cart } = get();
        if (!cart) return;

        const existingItem = cart.items.find((i) => i.productId === item.productId);
        let updatedItems: ShoppingCartItem[];

        if (existingItem) {
          updatedItems = cart.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updatedItems = [...cart.items, item];
        }

        const updatedCart: ShoppingCart = {
          ...cart,
          items: updatedItems,
          totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };

        set({ cart: updatedCart });
        await get().syncCart();
      },

      removeItem: async (productId: string) => {
        const { cart } = get();
        if (!cart) return;

        const updatedItems = cart.items.filter((i) => i.productId !== productId);
        const updatedCart: ShoppingCart = {
          ...cart,
          items: updatedItems,
          totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };

        set({ cart: updatedCart });
        await get().syncCart();
      },

      updateQuantity: async (productId: string, quantity: number) => {
        const { cart } = get();
        if (!cart) return;

        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }

        const updatedItems = cart.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
        const updatedCart: ShoppingCart = {
          ...cart,
          items: updatedItems,
          totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };

        set({ cart: updatedCart });
        await get().syncCart();
      },

      clearCart: async () => {
        const { cart } = get();
        if (!cart) return;

        try {
          await basketService.deleteBasket(cart.userName);
          set({ cart: { userName: cart.userName, items: [], totalPrice: 0 } });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      syncCart: async () => {
        const { cart } = get();
        if (!cart) return;

        try {
          await basketService.storeBasket({ cart });
        } catch (error: any) {
          set({ error: error.message });
        }
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);
```

---

### PHASE 5: Custom Hooks

#### Step 5.1: Products Hook

**src/hooks/useProducts.ts**
```typescript
import { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { catalogService } from '../api/catalogService';

export const useProducts = (pageNumber: number = 1, pageSize: number = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await catalogService.getProducts({ pageNumber, pageSize });
        setProducts(response.products);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber, pageSize]);

  return { products, loading, error };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await catalogService.getProduct(id);
        setProduct(response.product);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useProductsByCategory = (category: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await catalogService.getProductsByCategory(category);
        setProducts(response.products);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
};
```

#### Step 5.2: Orders Hook

**src/hooks/useOrders.ts**
```typescript
import { useState, useEffect } from 'react';
import { Order, PaginatedResult } from '../types/order';
import { orderingService } from '../api/orderingService';

export const useOrders = (pageIndex: number = 1, pageSize: number = 10) => {
  const [orders, setOrders] = useState<PaginatedResult<Order> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderingService.getOrders(pageIndex, pageSize);
        setOrders(response.orders);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pageIndex, pageSize]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderingService.getOrders(pageIndex, pageSize);
      setOrders(response.orders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refetch };
};
```

---

### PHASE 6: Routing Setup

**src/router.tsx**
```typescript
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import OrderList from './pages/OrderList';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import ErrorPage from './pages/Error';

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

### PHASE 7: Component Implementation

#### Step 7.1: Layout Component

**src/components/common/Header.tsx**
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

const Header: React.FC = () => {
  const cart = useCartStore((state) => state.cart);
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Shopping App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart
                {itemCount > 0 && (
                  <span className="badge bg-danger ms-1">{itemCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
```

**src/components/common/Footer.tsx**
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4">
            <h5>Shopping App</h5>
            <p>Your one-stop shop for all your needs.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/products" className="text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-white">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/privacy" className="text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Shopping App. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

#### Step 7.2: Product Components

**src/components/product/ProductCard.tsx**
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <Link to={`/products/${product.id}`}>
          <img
            src={`/images/product/${product.imageFile}`}
            className="card-img-top"
            alt={product.name}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        </Link>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            <Link to={`/products/${product.id}`} className="text-decoration-none">
              {product.name}
            </Link>
          </h5>
          <p className="card-text flex-grow-1">
            {product.description.substring(0, 100)}...
          </p>
          <div className="row mt-auto">
            <div className="col">
              <p className="btn btn-danger btn-block mb-0">${product.price}</p>
            </div>
            <div className="col">
              {onAddToCart ? (
                <button
                  onClick={() => onAddToCart(product)}
                  className="btn btn-success btn-block"
                >
                  Add to Cart
                </button>
              ) : (
                <Link
                  to={`/products/${product.id}`}
                  className="btn btn-success btn-block"
                >
                  View Details
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
```

**src/components/product/TopProduct.tsx**
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';

interface TopProductProps {
  product: Product;
}

const TopProduct: React.FC<TopProductProps> = ({ product }) => {
  return (
    <div className="col-12 col-md-3">
      <div className="card">
        <div className="card-header bg-success text-white text-uppercase">
          <i className="fa fa-heart"></i> Top product
        </div>
        <Link to={`/products/${product.id}`}>
          <img
            className="img-fluid border-0"
            src={`/images/product/${product.imageFile}`}
            alt={product.name}
          />
        </Link>
        <div className="card-body">
          <h4 className="card-title text-center">
            <Link to={`/products/${product.id}`} title="View Product">
              {product.name}
            </Link>
          </h4>
          <div className="row">
            <div className="col">
              <p className="btn btn-danger btn-block">${product.price}</p>
            </div>
            <div className="col">
              <Link
                to={`/products/${product.id}`}
                className="btn btn-success btn-block"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProduct;
```

#### Step 7.3: Cart Component

**src/components/cart/CartItem.tsx**
```typescript
import React from 'react';
import { ShoppingCartItem } from '../../types/cart';

interface CartItemProps {
  item: ShoppingCartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <tr>
      <td>{item.productName}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value))}
          className="form-control"
          style={{ width: '80px' }}
        />
      </td>
      <td>${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <button
          onClick={() => onRemove(item.productId)}
          className="btn btn-danger btn-sm"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
```

---

### PHASE 8: Page Components

#### Step 8.1: Home Page

**src/pages/Home.tsx**
```typescript
import React, { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import TopProduct from '../components/product/TopProduct';
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

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5">Error: {error}</div>;

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

#### Step 8.2: Product List Page

**src/pages/ProductList.tsx**
```typescript
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
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

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Products</h1>
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
    </div>
  );
};

export default ProductList;
```

#### Step 8.3: Product Detail Page

**src/pages/ProductDetail.tsx**
```typescript
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(productId!);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      color: 'default',
    });

    navigate('/cart');
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5">Error: {error}</div>;
  if (!product) return <div className="container mt-5">Product not found</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={`/images/product/${product.imageFile}`}
            alt={product.name}
            className="img-fluid"
          />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p className="text-muted">
            Categories: {product.category.join(', ')}
          </p>
          <h2 className="text-danger">${product.price}</h2>
          <p className="mt-3">{product.description}</p>
          <button onClick={handleAddToCart} className="btn btn-success btn-lg">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
```

#### Step 8.4: Cart Page

**src/pages/Cart.tsx**
```typescript
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/cart/CartItem';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, loadCart, updateQuantity, removeItem, clearCart } =
    useCartStore();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="container mt-5">Loading...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
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
          <h3>Total: ${cart.totalPrice.toFixed(2)}</h3>
          <button onClick={handleCheckout} className="btn btn-success btn-lg w-100 mt-3">
            Proceed to Checkout
          </button>
          <button onClick={clearCart} className="btn btn-danger w-100 mt-2">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
```

#### Step 8.5: Checkout Page

**src/pages/Checkout.tsx**
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCartStore } from '../store/cartStore';
import { basketService } from '../api/basketService';
import { BasketCheckout } from '../types/cart';

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
  const { cart, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    if (!cart) return;

    setSubmitting(true);
    try {
      const checkoutData: BasketCheckout = {
        ...data,
        userName: cart.userName,
        customerId: '00000000-0000-0000-0000-000000000000', // Generate proper customer ID
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

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mt-5">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mt-4">
          <div className="col-md-6">
            <h3>Shipping Information</h3>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input {...register('firstName')} className="form-control" />
              {errors.firstName && (
                <p className="text-danger">{errors.firstName.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input {...register('lastName')} className="form-control" />
              {errors.lastName && (
                <p className="text-danger">{errors.lastName.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input {...register('emailAddress')} className="form-control" />
              {errors.emailAddress && (
                <p className="text-danger">{errors.emailAddress.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input {...register('addressLine')} className="form-control" />
              {errors.addressLine && (
                <p className="text-danger">{errors.addressLine.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Country</label>
              <input {...register('country')} className="form-control" />
              {errors.country && (
                <p className="text-danger">{errors.country.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">State</label>
              <input {...register('state')} className="form-control" />
              {errors.state && (
                <p className="text-danger">{errors.state.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Zip Code</label>
              <input {...register('zipCode')} className="form-control" />
              {errors.zipCode && (
                <p className="text-danger">{errors.zipCode.message}</p>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <h3>Payment Information</h3>
            <div className="mb-3">
              <label className="form-label">Card Name</label>
              <input {...register('cardName')} className="form-control" />
              {errors.cardName && (
                <p className="text-danger">{errors.cardName.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input {...register('cardNumber')} className="form-control" />
              {errors.cardNumber && (
                <p className="text-danger">{errors.cardNumber.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Expiration</label>
              <input
                {...register('expiration')}
                placeholder="MM/YY"
                className="form-control"
              />
              {errors.expiration && (
                <p className="text-danger">{errors.expiration.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">CVV</label>
              <input {...register('cvv')} className="form-control" />
              {errors.cvv && <p className="text-danger">{errors.cvv.message}</p>}
            </div>

            <h4 className="mt-4">Order Summary</h4>
            <p>Total Items: {cart.items.reduce((sum, i) => sum + i.quantity, 0)}</p>
            <h3>Total: ${cart.totalPrice.toFixed(2)}</h3>

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 mt-3"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
```

#### Step 8.6: Other Pages

**src/pages/Confirmation.tsx**
```typescript
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
```

**src/pages/OrderList.tsx**
```typescript
import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrderStatus } from '../types/order';

const OrderList: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const { orders, loading, error } = useOrders(pageIndex, pageSize);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5">Error: {error}</div>;

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap = {
      [OrderStatus.Draft]: 'secondary',
      [OrderStatus.Pending]: 'warning',
      [OrderStatus.Completed]: 'success',
      [OrderStatus.Cancelled]: 'danger',
    };
    return `badge bg-${statusMap[status]}`;
  };

  return (
    <div className="container mt-5">
      <h1>Order History</h1>
      {orders && orders.data.length > 0 ? (
        <>
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Name</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.data.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.orderName}</td>
                  <td>
                    <span className={getStatusBadge(order.status)}>
                      {OrderStatus[order.status]}
                    </span>
                  </td>
                  <td>{order.orderItems.length}</td>
                  <td>
                    $
                    {order.orderItems
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-primary me-2"
              onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
              disabled={pageIndex === 1}
            >
              Previous
            </button>
            <span className="align-self-center">
              Page {pageIndex} of {Math.ceil(orders.count / pageSize)}
            </span>
            <button
              className="btn btn-primary ms-2"
              onClick={() => setPageIndex((p) => p + 1)}
              disabled={pageIndex >= Math.ceil(orders.count / pageSize)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="mt-4">No orders found.</p>
      )}
    </div>
  );
};

export default OrderList;
```

---

### PHASE 9: Main Application Setup

**src/App.tsx**
```typescript
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { useCartStore } from './store/cartStore';

const App: React.FC = () => {
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
```

**src/main.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

---

### PHASE 10: Styling

**src/styles/global.css**
```css
/* Import original styles from .NET app */
.bloc_left_price {
  color: #c01508;
  text-align: center;
  font-weight: bold;
  font-size: 150%;
}

.category_block li:hover {
  background-color: #007bff;
}

.category_block li:hover a {
  color: #ffffff;
}

.category_block li a {
  color: #343a40;
}

.add_to_cart_block .price {
  color: #c01508;
  text-align: center;
  font-weight: bold;
  font-size: 200%;
  margin-bottom: 0;
}

.add_to_cart_block .price_discounted {
  color: #343a40;
  text-align: center;
  text-decoration: line-through;
  font-size: 140%;
}

.product_rassurance {
  padding: 10px;
  margin-top: 15px;
  background: #ffffff;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.product_rassurance .list-inline {
  margin-bottom: 0;
  text-transform: uppercase;
  text-align: center;
}

.product_rassurance .list-inline li:hover {
  color: #343a40;
}

.reviews_product .fa-star {
  color: gold;
}

.pagination {
  margin-top: 20px;
}

footer {
  background: #343a40;
  padding: 40px;
}

footer a {
  color: #f8f9fa !important;
}
```

---

## Testing Strategy

### Unit Testing
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Example Test
```typescript
// src/components/product/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  category: ['Test'],
  description: 'Test Description',
  imageFile: 'test.jpg',
  price: 99.99,
};

test('renders product card', () => {
  render(
    <BrowserRouter>
      <ProductCard product={mockProduct} />
    </BrowserRouter>
  );
  expect(screen.getByText('Test Product')).toBeInTheDocument();
});
```

---

## Deployment

### Build for Production
```bash
npm run build
```

### Dockerfile for React App
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://localhost:6064;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Migration Checklist

### Pre-Migration
- [ ] Analyze current application
- [ ] Document all features
- [ ] Identify API endpoints
- [ ] Plan component structure
- [ ] Setup development environment

### Implementation
- [ ] Initialize React project
- [ ] Install dependencies
- [ ] Create type definitions
- [ ] Implement API services
- [ ] Setup state management
- [ ] Create routing structure
- [ ] Build shared components
- [ ] Implement page components
- [ ] Migrate styles
- [ ] Copy static assets

### Testing
- [ ] Unit tests for components
- [ ] Integration tests for pages
- [ ] API integration tests
- [ ] E2E tests for critical flows
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

### Deployment
- [ ] Build optimization
- [ ] Docker configuration
- [ ] Environment configuration
- [ ] API proxy setup
- [ ] Production deployment
- [ ] Monitoring setup

### Post-Migration
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Accessibility audit
- [ ] Security review
- [ ] Documentation
- [ ] Training materials

---

## Key Differences & Considerations

### State Management
- **Razor Pages:** Server-side session state
- **React:** Client-side state (Zustand/Redux)

### Routing
- **Razor Pages:** Server-side routing
- **React:** Client-side routing (React Router)

### Forms
- **Razor Pages:** Server-side validation
- **React:** Client-side validation (React Hook Form + Yup)

### Data Fetching
- **Razor Pages:** Page model methods
- **React:** Custom hooks with API services

### SEO Considerations
- Consider Server-Side Rendering (Next.js) if SEO is critical
- Implement meta tags management
- Use React Helmet for dynamic meta tags

---

## Timeline Estimate

- **Week 1:** Setup & Infrastructure
- **Week 2:** Core Services & Components
- **Week 3:** Feature Implementation (Products & Cart)
- **Week 4:** Feature Implementation (Checkout & Orders)
- **Week 5:** Testing & Polish
- **Week 6:** Deployment & Documentation

**Total: 6 weeks for complete migration**

---

## Additional Recommendations

1. **Consider Next.js** for better SEO and SSR capabilities
2. **Implement Error Boundaries** for better error handling
3. **Add Loading States** for better UX
4. **Implement Caching** for API responses
5. **Add Optimistic Updates** for better perceived performance
6. **Setup CI/CD Pipeline** for automated deployments
7. **Implement Analytics** for user behavior tracking
8. **Add A/B Testing** capabilities
9. **Setup Feature Flags** for gradual rollouts
10. **Implement Accessibility** features (ARIA labels, keyboard navigation)

---

This migration guide provides a complete roadmap for converting your .NET Razor Pages e-commerce application to React with feature parity and modern best practices.
