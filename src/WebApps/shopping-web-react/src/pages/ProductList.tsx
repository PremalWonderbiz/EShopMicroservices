import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/common/Loading';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types/product';

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