import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Loading from './components/common/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import { ToastProvider } from './components/ui/Toast/Toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <Suspense fallback={<Loading fullScreen message="Loading application..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </ToastProvider>
  </React.StrictMode>
);
