import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

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