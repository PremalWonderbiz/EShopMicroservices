import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft,
  Plus,
  Minus,
} from 'lucide-react';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/cartStore';
import { useProducts } from '../../hooks/useProducts';
import { Button, Card, Badge } from '../../components/ui';
import { toast } from '../../components/ui/Toast';
import { ProductCard } from '../../components/product/ProductCard';
import './ProductDetail.css';

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  const addItem = useCartStore((state) => state.addItem);
  const { products: relatedProducts } = useProducts();

  useEffect(() => {
    loadProductDetail();
  }, [productId]);

  const loadProductDetail = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await catalogService.getProductById(productId);
      // setProduct(response.product);

      // Mock data for demonstration
      setTimeout(() => {
        const mockProduct: Product = {
          id: productId || 'prod-1',
          name: 'Premium Wireless Headphones',
          category: ['Electronics', 'Audio'],
          description: 'Experience premium sound quality with these wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals alike.',
          imageFile: '/api/placeholder/600/600',
          price: 299.99,
        };
        setProduct(mockProduct);
        setLoading(false);
      }, 600);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product details');
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        color: 'Default',
      });

      toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-loading">
            <div className="loading-spinner"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-error">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const images = [product.imageFile, product.imageFile, product.imageFile];
  const rating = 4.5;
  const reviewCount = 128;
  const inStock = true;
  const relatedProductsList = relatedProducts.slice(0, 4);

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft />}
            onClick={() => navigate('/products')}
          >
            Back to Products
          </Button>
        </div>

        <div className="product-detail-content">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="gallery-main">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="gallery-main-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    className="gallery-nav gallery-nav-prev"
                    onClick={() =>
                      setSelectedImage((selectedImage - 1 + images.length) % images.length)
                    }
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="gallery-nav gallery-nav-next"
                    onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="gallery-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`gallery-thumbnail ${
                    selectedImage === index ? 'gallery-thumbnail-active' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            {/* Header */}
            <div className="product-header">
              <div className="product-meta">
                {product.category && product.category[0] && (
                  <Badge variant="neutral" size="sm">
                    {product.category[0]}
                  </Badge>
                )}
                {inStock ? (
                  <Badge variant="success" size="sm">
                    <Check size={14} />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="error" size="sm">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating">
                <div className="rating-stars">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
                      className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {rating} ({reviewCount} reviews)
                </span>
              </div>

              <div className="product-price">
                <span className="price-current">${product.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Quantity & Actions */}
            <Card className="product-actions-card">
              <div className="quantity-selector">
                <label className="quantity-label">Quantity:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  leftIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={isWishlisted ? 'wishlist-active' : ''}
                >
                  <Heart
                    size={20}
                    fill={isWishlisted ? 'currentColor' : 'none'}
                  />
                </Button>

                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 size={20} />
                </Button>
              </div>
            </Card>

            {/* Features */}
            <Card className="product-features">
              <div className="feature-item">
                <Truck className="feature-icon" />
                <div className="feature-text">
                  <strong>Free Shipping</strong>
                  <span>On orders over $50</span>
                </div>
              </div>

              <div className="feature-item">
                <Shield className="feature-icon" />
                <div className="feature-text">
                  <strong>Secure Payment</strong>
                  <span>100% secure transactions</span>
                </div>
              </div>

              <div className="feature-item">
                <RefreshCw className="feature-icon" />
                <div className="feature-text">
                  <strong>Easy Returns</strong>
                  <span>30-day return policy</span>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Card className="product-tabs">
              <div className="tabs-header">
                <button
                  className={`tab-button ${activeTab === 'description' ? 'tab-button-active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`tab-button ${activeTab === 'reviews' ? 'tab-button-active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({reviewCount})
                </button>
                <button
                  className={`tab-button ${activeTab === 'shipping' ? 'tab-button-active' : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping Info
                </button>
              </div>

              <div className="tabs-content">
                {activeTab === 'description' && (
                  <div className="tab-panel">
                    <h3>Product Description</h3>
                    <p>{product.description}</p>
                    <h4>Key Features:</h4>
                    <ul>
                      <li>Premium quality materials</li>
                      <li>Advanced technology</li>
                      <li>Long-lasting durability</li>
                      <li>Modern design</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="tab-panel">
                    <h3>Customer Reviews</h3>
                    <div className="reviews-summary">
                      <div className="reviews-score">
                        <span className="score-value">{rating}</span>
                        <div className="score-stars">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={16}
                              fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <span className="score-text">Based on {reviewCount} reviews</span>
                      </div>
                    </div>
                    <p className="reviews-placeholder">
                      Reviews feature coming soon! Check back later to see what customers are saying.
                    </p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="tab-panel">
                    <h3>Shipping Information</h3>
                    <ul>
                      <li><strong>Standard Shipping:</strong> 5-7 business days</li>
                      <li><strong>Express Shipping:</strong> 2-3 business days</li>
                      <li><strong>Free Shipping:</strong> On orders over $50</li>
                      <li><strong>International:</strong> Available to select countries</li>
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProductsList.length > 0 && (
          <section className="related-products">
            <h2 className="section-title">You May Also Like</h2>
            <div className="related-products-grid">
              {relatedProductsList.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
