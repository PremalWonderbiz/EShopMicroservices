import React, { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loading from './components/common/Loading';
import { useCartStore } from './store/cartStore';
import { Header } from './components/common/Header/Header';
import { Footer } from './components/common/Footer/Footer';
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
          <ScrollRestoration />
          <Outlet />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;