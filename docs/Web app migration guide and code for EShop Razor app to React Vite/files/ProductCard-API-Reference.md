# ProductCard Component - API Reference

## 📋 Overview

The `ProductCard` component is a flexible, feature-rich product display component with optional callbacks for complete control over behavior.

---

## 🔧 Props

### `product` (required)
- **Type**: `Product`
- **Description**: The product object to display

### `onAddToCart` (optional)
- **Type**: `(product: Product) => void | Promise<void>`
- **Description**: Custom handler when "Add to Cart" button is clicked
- **Default**: Uses Zustand store's `addItem` method

### `onWishlistToggle` (optional)
- **Type**: `(product: Product, isWishlisted: boolean) => void`
- **Description**: Custom handler when wishlist icon is clicked
- **Parameters**:
  - `product`: The product being wishlisted
  - `isWishlisted`: New wishlist state (true/false)

### `onQuickView` (optional)
- **Type**: `(product: Product) => void`
- **Description**: Custom handler when quick view icon is clicked
- **Default**: Navigates to product detail page

### `onClick` (optional)
- **Type**: `(product: Product) => void`
- **Description**: Custom handler when the entire card is clicked
- **Default**: Navigates to product detail page

---

## 💡 Usage Examples

### Basic Usage (Default Behavior)

```tsx
import { ProductCard } from '@/components/product';

function ProductList() {
  return (
    <div className="product-card-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Default behavior:**
- Add to cart uses Zustand store
- Wishlist shows toast notifications
- Quick view navigates to product page
- Card click navigates to product page

---

### Custom Add to Cart Handler

```tsx
import { ProductCard } from '@/components/product';

function ProductList() {
  const handleAddToCart = async (product: Product) => {
    // Your custom logic
    console.log('Adding to cart:', product);
    
    // Call your API
    await api.addToCart(product.id, 1);
    
    // Update your state
    dispatch(addToCart(product));
  };

  return (
    <div className="product-card-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
```

---

### Complete Custom Control

```tsx
import { ProductCard } from '@/components/product';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const navigate = useNavigate();

  const handleAddToCart = async (product: Product) => {
    await myCartService.add(product);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = (product: Product, isWishlisted: boolean) => {
    if (isWishlisted) {
      myWishlistService.add(product.id);
    } else {
      myWishlistService.remove(product.id);
    }
  };

  const handleQuickView = (product: Product) => {
    // Open modal instead of navigating
    setQuickViewProduct(product);
    setModalOpen(true);
  };

  const handleCardClick = (product: Product) => {
    // Track analytics before navigating
    analytics.track('product_clicked', { id: product.id });
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="product-card-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
          onQuickView={handleQuickView}
          onClick={handleCardClick}
        />
      ))}
    </div>
  );
}
```

---

## 🔄 Migration from Old Component

### If you were using:

```tsx
// Old version
<ProductCard
  key={product.id}
  product={product}
  onAddToCart={handleAddToCart}
/>
```

### No changes needed!

The component is **100% backward compatible**. Your existing code will work exactly as before.

---

## 🎯 Common Use Cases

### 1. Analytics Tracking

```tsx
const handleCardClick = (product: Product) => {
  // Track before navigating
  analytics.track('product_viewed', {
    productId: product.id,
    productName: product.name,
    price: product.price,
  });
  
  // Default navigation still works
  navigate(`/products/${product.id}`);
};

<ProductCard product={product} onClick={handleCardClick} />
```

---

### 2. Modal Quick View

```tsx
const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

const handleQuickView = (product: Product) => {
  setQuickViewProduct(product);
  // Don't navigate, just open modal
};

<>
  <ProductCard product={product} onQuickView={handleQuickView} />
  
  {quickViewProduct && (
    <QuickViewModal
      product={quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
    />
  )}
</>
```

---

### 3. Custom Cart Logic

```tsx
const handleAddToCart = async (product: Product) => {
  // Check stock first
  const inStock = await checkStock(product.id);
  
  if (!inStock) {
    toast.error('Product out of stock');
    return;
  }
  
  // Add to cart
  await addToCart(product);
  
  // Show custom notification
  toast.success(
    <div>
      <strong>{product.name}</strong> added to cart!
      <button onClick={() => navigate('/cart')}>View Cart</button>
    </div>
  );
};

<ProductCard product={product} onAddToCart={handleAddToCart} />
```

---

### 4. Wishlist Persistence

```tsx
const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

const handleWishlistToggle = (product: Product, isWishlisted: boolean) => {
  const newSet = new Set(wishlistedIds);
  
  if (isWishlisted) {
    newSet.add(product.id);
    // Persist to backend
    api.addToWishlist(product.id);
  } else {
    newSet.delete(product.id);
    // Remove from backend
    api.removeFromWishlist(product.id);
  }
  
  setWishlistedIds(newSet);
  localStorage.setItem('wishlist', JSON.stringify([...newSet]));
};

<ProductCard
  product={product}
  onWishlistToggle={handleWishlistToggle}
/>
```

---

## 🎨 Internal Features

The component includes built-in features that work automatically:

✅ **Loading States** - Shows spinner during add to cart
✅ **Toast Notifications** - Success/error messages
✅ **Hover Effects** - Image zoom, overlay appearance
✅ **Responsive Design** - Mobile, tablet, desktop
✅ **Accessibility** - ARIA labels, keyboard navigation
✅ **Rating Display** - Star rating with count
✅ **Discount Badges** - Shows sale percentage
✅ **Category Tags** - Product category display
✅ **Error Handling** - Graceful fallbacks

---

## 🔒 TypeScript Support

Full TypeScript support with intellisense:

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void | Promise<void>;
  onWishlistToggle?: (product: Product, isWishlisted: boolean) => void;
  onQuickView?: (product: Product) => void;
  onClick?: (product: Product) => void;
}
```

All callbacks are properly typed and optional!

---

## ⚠️ Important Notes

### Event Propagation

All button handlers (add to cart, wishlist, quick view) call `e.stopPropagation()` to prevent triggering the card's `onClick` handler.

### Async Support

The `onAddToCart` callback supports both synchronous and asynchronous operations:

```tsx
// Synchronous
const handleAddToCart = (product: Product) => {
  addToCart(product);
};

// Asynchronous
const handleAddToCart = async (product: Product) => {
  await api.addToCart(product);
};
```

### Default Behavior

If you don't provide callbacks, the component uses sensible defaults:
- `onAddToCart`: Uses Zustand store
- `onWishlistToggle`: Shows toast notifications
- `onQuickView`: Navigates to product detail
- `onClick`: Navigates to product detail

---

## 🐛 Troubleshooting

**Issue**: `onAddToCart` not being called
- **Check**: Make sure you're passing the callback correctly
- **Check**: Verify the function signature matches the type

**Issue**: Wishlist state not persisting
- **Solution**: Implement `onWishlistToggle` with persistence logic

**Issue**: Quick view navigates instead of opening modal
- **Solution**: Provide custom `onQuickView` handler

**Issue**: Toast appears twice
- **Solution**: Make sure not to show toast in both callback and component

---

## 📚 Related Components

- `TopProduct` - Alternative simplified product display
- `ProductItem` - List view variant
- `ProductDetail` - Full product page

---

## ✅ Best Practices

1. **Always provide `key` prop** when mapping
2. **Handle errors** in async callbacks
3. **Show feedback** to users (toasts, loading states)
4. **Track analytics** in click handlers
5. **Validate data** before adding to cart
6. **Check stock** before allowing purchases
7. **Persist wishlist** to backend or localStorage

---

## 🎓 Example Repository Structure

```
src/
├── components/
│   └── product/
│       ├── ProductCard.tsx
│       └── ProductCard.css
├── hooks/
│   ├── useCart.ts
│   └── useWishlist.ts
├── services/
│   ├── cartService.ts
│   └── analyticsService.ts
└── pages/
    └── ProductList.tsx
```

---

**Pro Tip**: Use the default behavior for prototyping, then add custom callbacks as your requirements grow!
