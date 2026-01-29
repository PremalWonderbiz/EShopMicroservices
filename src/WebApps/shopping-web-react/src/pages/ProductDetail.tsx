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