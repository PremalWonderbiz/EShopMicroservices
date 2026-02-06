import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import './ProductCard.css';
import type { Product } from '../../../types/product';
import { useCartStore } from '../../../store/cartStore';
import { Badge, Button, toast } from '../../ui';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void | Promise<void>;
  onWishlistToggle?: (product: Product, isWishlisted: boolean) => void;
  onQuickView?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  onAddToCart,
  onWishlistToggle,
  onQuickView,
  onClick
}) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    try {
      // If parent component provides onAddToCart, use that
      if (onAddToCart) {
        await onAddToCart(product);
      } else {
        // Otherwise, use default implementation
        await addItem({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          color: 'Default',
          originalPrice: product.price
        });
      }
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.log(error);      
      toast.error('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);
    
    // Call parent callback if provided
    if (onWishlistToggle) {
      onWishlistToggle(product, newWishlistState);
    }
    
    if (newWishlistState) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Call parent callback if provided
    if (onQuickView) {
      onQuickView(product);
    } else {
      // Default behavior: navigate to product detail
      navigate(`/products/${product.id}`);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Call parent callback if provided
    e.stopPropagation();
    console.log('CARD CLICKED', e.target);
    if (onClick) {
      onClick(product);
    } else {
      // Default behavior: navigate to product detail
      navigate(`/products/${product.id}`);
    }
  };

  // Mock rating (you can add this to your Product type later)
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 100) + 10;

  // Mock discount (you can add this to your Product type later)
  // const hasDiscount = Math.random() > 0.7;
  // const discountPercentage = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
  // const originalPrice = hasDiscount ? product.price * (1 + discountPercentage / 100) : product.price;

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="product-card-image-container">
        <img
          // src={product.imageFile || 'default.jpg'}
          src={'/default.jpg'}
          alt={product.name}
          className="product-card-image"
          onError={(e) => {
            console.log(e.target);            
          }}
        />
        
        {/* Badges */}
        <div className="product-card-badges">
          {/* {hasDiscount && (
            <Badge variant="error" size="sm">
              -{discountPercentage}%
            </Badge>
          )} */}
          {product.category && product.category[0] && (
            <Badge variant="neutral" size="sm">
              {product.category[0]}
            </Badge>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="product-card-overlay">
          <div className="product-card-actions">
            <button
              className={`action-icon ${isWishlisted ? 'action-icon-active' : ''}`}
              onClick={handleWishlist}
              aria-label="Add to wishlist"
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              className="action-icon"
              onClick={handleQuickView}
              aria-label="Quick view"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="product-card-content">
        {/* Category */}
        {product.category && product.category[0] && (
          <div className="product-card-category">{product.category[0]}</div>
        )}

        {/* Title */}
        <h3 className="product-card-title">{product.name}</h3>

        {/* Description */}
        <p className="product-card-description">
          {product.description?.length > 80
            ? `${product.description.substring(0, 80)}...`
            : product.description}
        </p>

        {/* Rating */}
        <div className="product-card-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={14}
                fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
                className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
          <span className="rating-text">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="price-current">${product.price.toFixed(2)}</span>
            {/* {hasDiscount && (
              <span className="price-original">${originalPrice.toFixed(2)}</span>
            )} */}
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<ShoppingCart size={16} />}
            onClick={handleAddToCart}
            isLoading={isAddingToCart}
            className="add-to-cart-button"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
