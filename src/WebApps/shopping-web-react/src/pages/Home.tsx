import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import TopProduct from '../components/product/TopProduct';
import Loading from '../components/common/Loading';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types/product';

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