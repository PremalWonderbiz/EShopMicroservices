import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import App from './App';
import ErrorPage from './pages/Error';
import { Home } from './pages/Home/Home';
import { Cart } from './pages/Cart/Cart';
import { Confirmation } from './pages/Confirmation/Confirmation';
import { Checkout } from './pages/Checkout/Checkout';
import { OrderDetail } from './pages/OrderDetail/OrderDetail';
import { ProductDetail } from './pages/ProductDetail/ProductDetail';
import { OrderList } from './pages/OrderList/OrderList';
import { Products } from './pages/Products/Products';

// Lazy load pages for better performance
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
        element: <Products />,
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
      {
        path: 'orders/:orderId',
        element: <OrderDetail />
      }
    ],
  },
]);