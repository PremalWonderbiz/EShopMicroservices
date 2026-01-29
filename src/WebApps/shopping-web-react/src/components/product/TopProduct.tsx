import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

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