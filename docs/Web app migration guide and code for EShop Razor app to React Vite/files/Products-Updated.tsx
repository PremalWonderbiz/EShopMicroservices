import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid3x3,
  List,
  ChevronDown,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { catalogService } from '../../api/catalogService';
import { Button, Card, Input, Badge, toast } from '../../components/ui';
import './Products.css';
import type { Product } from '../../types/product';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'popular' | 'price-low' | 'price-high' | 'name';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [currentPage]);

  useEffect(() => {
    // Update search query from URL params
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await catalogService.getProducts({
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      setProducts(response.products);
      setTotalProducts(response.count || response.products.length);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from products
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach((product) => {
      if (product.category) {
        product.category.forEach((cat) => categorySet.add(cat));
      }
    });
    return Array.from(categorySet).sort();
  }, [products]);

  // Get price range from products
  const productPriceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.category?.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // Assuming newer products have higher IDs
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'popular':
        // Could sort by rating or sales - using random for demo
        filtered.sort(() => Math.random() - 0.5);
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategories, priceRange, sortBy]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange(productPriceRange);
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount =
    selectedCategories.length + (searchQuery ? 1 : 0) + 
    (priceRange.min !== productPriceRange.min || priceRange.max !== productPriceRange.max ? 1 : 0);

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="products-loading">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div>
            <h1 className="products-title">Products</h1>
            <p className="products-subtitle">
              Discover our collection of {totalProducts} amazing products
            </p>
          </div>
        </div>

        {/* Search and View Controls */}
        <Card className="products-controls">
          <div className="controls-top">
            <div className="search-wrapper">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                leftIcon={<Search size={18} />}
              />
            </div>

            <div className="controls-actions">
              {/* Sort Dropdown */}
              <div className="sort-dropdown">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="sort-select"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <ChevronDown size={16} className="sort-icon" />
              </div>

              {/* View Toggle */}
              <div className="view-toggle">
                <button
                  className={`view-button ${viewMode === 'grid' ? 'view-button-active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  className={`view-button ${viewMode === 'list' ? 'view-button-active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                className="filter-toggle-mobile"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={18} />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="primary" size="sm">
                    {activeFiltersCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="active-filters">
              <span className="active-filters-label">Active filters:</span>
              <div className="active-filters-list">
                {searchQuery && (
                  <Badge variant="primary" className="filter-badge">
                    Search: "{searchQuery}"
                    <button
                      className="filter-badge-remove"
                      onClick={() => handleSearchChange('')}
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="primary" className="filter-badge">
                    {category}
                    <button
                      className="filter-badge-remove"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {(priceRange.min !== productPriceRange.min ||
                  priceRange.max !== productPriceRange.max) && (
                  <Badge variant="primary" className="filter-badge">
                    ${priceRange.min} - ${priceRange.max}
                    <button
                      className="filter-badge-remove"
                      onClick={() => setPriceRange(productPriceRange)}
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </Card>

        {/* Main Content */}
        <div className="products-content">
          {/* Sidebar Filters */}
          <aside className={`products-sidebar ${showFilters ? 'products-sidebar-open' : ''}`}>
            <Card className="filters-card">
              <div className="filters-header">
                <h3 className="filters-title">
                  <Filter size={20} />
                  Filters
                </h3>
                <button
                  className="filters-close"
                  onClick={() => setShowFilters(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories Filter */}
              {categories.length > 0 && (
                <div className="filter-section">
                  <h4 className="filter-section-title">Categories</h4>
                  <div className="filter-options">
                    {categories.map((category) => (
                      <label key={category} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        />
                        <span className="checkbox-label">{category}</span>
                        <span className="checkbox-count">
                          ({products.filter((p) => p.category?.includes(category)).length})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="filter-section">
                <h4 className="filter-section-title">Price Range</h4>
                <div className="price-range">
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))
                      }
                      className="price-input"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                      }
                      className="price-input"
                    />
                  </div>
                  <input
                    type="range"
                    min={productPriceRange.min}
                    max={productPriceRange.max}
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="price-slider"
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <Button
                  fullWidth
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="products-main">
            <div className="products-results">
              <span className="results-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="no-products">
                <div className="no-products-icon">🔍</div>
                <h3 className="no-products-title">No products found</h3>
                <p className="no-products-text">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </Card>
            ) : (
              <>
                <div className={`products-grid products-grid-${viewMode}`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                      leftIcon={<ChevronLeft size={16} />}
                    >
                      Previous
                    </Button>

                    <div className="pagination-numbers">
                      {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="pagination-ellipsis">...</span>
                          ) : (
                            <button
                              className={`pagination-number ${
                                currentPage === page ? 'pagination-number-active' : ''
                              }`}
                              onClick={() => handlePageChange(page as number)}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      rightIcon={<ChevronRight size={16} />}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div
          className="filters-overlay"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};
