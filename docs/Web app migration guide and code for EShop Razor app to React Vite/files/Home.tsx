import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TruckIcon, Shield, Clock, Award, Star } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Button, Card, Badge } from '../../components/ui';
import { TopProduct } from '../../components/product/TopProduct';
import './Home.css';

export const Home: React.FC = () => {
  const { products, loading, error, loadProducts } = useProducts();

  useEffect(() => {
    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      description: 'On orders over $50',
      color: 'primary',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
      color: 'success',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Dedicated customer service',
      color: 'secondary',
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: '30-day money back',
      color: 'warning',
    },
  ];

  const categories = [
    { name: 'Electronics', image: '📱', count: 45 },
    { name: 'Fashion', image: '👔', count: 128 },
    { name: 'Home & Garden', image: '🏡', count: 67 },
    { name: 'Sports', image: '⚽', count: 89 },
    { name: 'Books', image: '📚', count: 234 },
    { name: 'Beauty', image: '💄', count: 156 },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <Badge variant="primary" size="lg" className="hero-badge">
                New Arrivals 2024
              </Badge>
              
              <h1 className="hero-title">
                Discover Your Perfect
                <span className="hero-title-gradient"> Shopping </span>
                Experience
              </h1>
              
              <p className="hero-description">
                Explore our curated collection of premium products. Quality guaranteed,
                satisfaction delivered. Shop with confidence.
              </p>
              
              <div className="hero-actions">
                <Button
                  size="lg"
                  variant="primary"
                  rightIcon={<ArrowRight />}
                  onClick={() => window.location.href = '/products'}
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/contact'}
                >
                  Learn More
                </Button>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-value">50K+</div>
                  <div className="stat-label">Happy Customers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">500+</div>
                  <div className="stat-label">Products</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">4.8</div>
                  <div className="stat-label">
                    <Star size={16} fill="currentColor" /> Rating
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <div className="hero-image-card">
                <div className="hero-image-placeholder">
                  <ShoppingBagIllustration />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="feature-card" hover>
                  <div className={`feature-icon feature-icon-${feature.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-description">
              Browse our diverse range of product categories
            </p>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="category-card"
              >
                <div className="category-icon">{category.image}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-description">
                Hand-picked items just for you
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" rightIcon={<ArrowRight />}>
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="products-loading">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="products-error">
              <p>Failed to load products. Please try again.</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <TopProduct key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Card className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Start Shopping?</h2>
              <p className="cta-description">
                Join thousands of satisfied customers and discover amazing deals today
              </p>
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight />}
                onClick={() => window.location.href = '/products'}
              >
                Browse Products
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

// Simple SVG Illustration Component
const ShoppingBagIllustration: React.FC = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="200" r="150" fill="url(#gradient1)" opacity="0.1" />
    <circle cx="200" cy="200" r="120" fill="url(#gradient2)" opacity="0.1" />
    
    <rect x="120" y="140" width="160" height="180" rx="8" fill="white" stroke="url(#gradient1)" strokeWidth="3" />
    <path d="M140 140 C140 110, 160 90, 200 90 C240 90, 260 110, 260 140" stroke="url(#gradient1)" strokeWidth="3" fill="none" />
    
    <circle cx="160" cy="200" r="8" fill="url(#gradient1)" />
    <circle cx="240" cy="200" r="8" fill="url(#gradient2)" />
    <rect x="140" y="240" width="120" height="8" rx="4" fill="url(#gradient1)" opacity="0.3" />
    <rect x="140" y="260" width="80" height="8" rx="4" fill="url(#gradient2)" opacity="0.3" />
    
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
  </svg>
);
