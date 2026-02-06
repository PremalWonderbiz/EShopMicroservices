# Phase 1: Foundation & Global Styles - Implementation Guide

## 📦 Installation

### 1. Install Dependencies

Run the following command in your project root:

```bash
npm install lucide-react framer-motion react-hot-toast
```

**What these packages do:**
- `lucide-react` - Beautiful, customizable icons (14KB gzipped)
- `framer-motion` - Smooth animations and transitions
- `react-hot-toast` - Toast notification system

---

## 📁 File Structure

Create the following folder structure in your project:

```
src/
├── styles/
│   └── design-system.css          ← NEW: Design tokens & utilities
├── components/
│   └── ui/                         ← NEW FOLDER
│       ├── Button.tsx              ← NEW
│       ├── Button.css              ← NEW
│       ├── Input.tsx               ← NEW
│       ├── Input.css               ← NEW
│       ├── Card.tsx                ← NEW
│       ├── Card.css                ← NEW
│       ├── Badge.tsx               ← NEW
│       ├── Badge.css               ← NEW
│       ├── Toast.tsx               ← NEW
│       ├── Toast.css               ← NEW
│       └── index.ts                ← NEW: Exports all components
└── index.css                       ← UPDATE
```

---

## 🔧 Setup Instructions

### Step 1: Add the Design System

1. Create folder: `src/styles/`
2. Copy `design-system.css` to `src/styles/design-system.css`

### Step 2: Update index.css

Replace your current `src/index.css` with the new version that imports the design system.

### Step 3: Add UI Components

1. Create folder: `src/components/ui/`
2. Copy all component files to this folder:
   - Button.tsx & Button.css
   - Input.tsx & Input.css
   - Card.tsx & Card.css
   - Badge.tsx & Badge.css
   - Toast.tsx & Toast.css
   - index.ts

### Step 4: Add ToastProvider to Your App

Update your `src/main.tsx` (or `src/App.tsx`):

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './components/ui';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
```

---

## 🎨 Using the Components

### Button Component

```tsx
import { Button } from '@/components/ui';
import { ShoppingCart, Heart } from 'lucide-react';

// Basic usage
<Button>Click Me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons
<Button leftIcon={<ShoppingCart />}>Add to Cart</Button>
<Button rightIcon={<Heart />}>Favorite</Button>

// Loading state
<Button isLoading>Loading...</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

### Input Component

```tsx
import { Input } from '@/components/ui';
import { Mail, Lock, Search } from 'lucide-react';

// Basic usage
<Input
  label="Email"
  placeholder="Enter your email"
  type="email"
  required
/>

// With icons
<Input
  label="Search"
  placeholder="Search products..."
  leftIcon={<Search />}
/>

// With validation error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  leftIcon={<Lock />}
/>

// With helper text
<Input
  label="Username"
  helperText="Choose a unique username"
/>

// Full width
<Input
  label="Full Name"
  fullWidth
/>
```

### Card Component

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// With hover effect
<Card hover>
  <p>Hover over me!</p>
</Card>

// Card with sections
<Card variant="bordered">
  <CardHeader>
    <h3 className="card-title">Product Name</h3>
    <p className="card-subtitle">Category</p>
  </CardHeader>
  <CardBody>
    <p className="card-description">Product description...</p>
  </CardBody>
  <CardFooter>
    <Button fullWidth>Add to Cart</Button>
  </CardFooter>
</Card>

// Elevated card with custom padding
<Card variant="elevated" padding="lg">
  <p>Content with large padding</p>
</Card>

// Clickable card
<Card hover onClick={() => navigate('/product/123')}>
  <p>Click me to navigate</p>
</Card>
```

### Badge Component

```tsx
import { Badge, BadgeDot } from '@/components/ui';

// Basic badges
<Badge>Default</Badge>
<Badge variant="success">In Stock</Badge>
<Badge variant="error">Out of Stock</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="neutral">Neutral</Badge>

// Different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Status dots
<div className="badge-with-dot">
  <BadgeDot variant="success" />
  <span>Online</span>
</div>

// Notification badge (e.g., on cart icon)
<div style={{ position: 'relative' }}>
  <ShoppingCart />
  <Badge className="badge-notification badge-positioned">3</Badge>
</div>
```

### Toast Notifications

```tsx
import { toast } from '@/components/ui';

// Success toast
toast.success('Product added to cart!');

// Error toast
toast.error('Failed to add product');

// Warning toast
toast.warning('Low stock available');

// Info toast
toast.info('Free shipping on orders over $50');

// With custom duration
toast.success('Saved!', { duration: 2000 });

// Promise toast (for async operations)
toast.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Data saved successfully!',
    error: 'Failed to save data',
  }
);

// Dismiss specific toast
const toastId = toast.success('Message');
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismiss();
```

---

## 🎨 Using Design Tokens

### CSS Custom Properties

You can now use design tokens in your CSS:

```css
.my-component {
  /* Colors */
  color: var(--color-primary-600);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  
  /* Spacing */
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  gap: var(--space-2);
  
  /* Typography */
  font-family: var(--font-family-base);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-relaxed);
  
  /* Border Radius */
  border-radius: var(--radius-lg);
  
  /* Shadows */
  box-shadow: var(--shadow-md);
  
  /* Transitions */
  transition: all var(--transition-base);
}

.my-component:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Utility Classes

Use pre-built utility classes for quick styling:

```tsx
// Typography
<h1 className="text-4xl font-bold text-primary">Heading</h1>
<p className="text-base text-secondary">Paragraph</p>

// Spacing
<div className="mt-4 mb-6 p-4">Content</div>

// Flexbox
<div className="flex items-center justify-between gap-4">
  <span>Left</span>
  <span>Right</span>
</div>

// Grid
<div className="grid grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Border Radius
<div className="rounded-lg">Rounded</div>

// Shadows
<div className="shadow-md">Card with shadow</div>

// Card pattern
<div className="card">Auto-styled card</div>
```

---

## 🎯 Quick Migration Examples

### Before (Old Style)

```tsx
// Old Button
<button 
  className="btn btn-primary" 
  style={{ backgroundColor: '#007bff' }}
>
  Add to Cart
</button>

// Old Input
<input 
  type="text" 
  className="form-control" 
  placeholder="Search"
/>

// Old Card
<div className="card" style={{ padding: '20px' }}>
  <div className="card-body">
    Content
  </div>
</div>
```

### After (New Style)

```tsx
// New Button
<Button variant="primary" leftIcon={<ShoppingCart />}>
  Add to Cart
</Button>

// New Input
<Input
  placeholder="Search"
  leftIcon={<Search />}
  fullWidth
/>

// New Card
<Card hover>
  <CardBody>
    Content
  </CardBody>
</Card>
```

---

## 📱 Responsive Design

All components are mobile-responsive by default. The design system includes:

- Mobile-first breakpoints
- Responsive utility classes
- Touch-friendly tap targets
- Adaptive spacing

### Breakpoints

```css
/* Small devices (640px and up) */
@media (min-width: 640px) { }

/* Medium devices (768px and up) */
@media (min-width: 768px) { }

/* Large devices (1024px and up) */
@media (min-width: 1024px) { }
```

### Responsive Utilities

```tsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {/* Items */}
</div>
```

---

## ♿ Accessibility Features

All components include:

- Proper ARIA labels
- Keyboard navigation support
- Focus indicators (visible outlines)
- Color contrast compliance
- Screen reader support
- Reduced motion support (respects user preferences)

---

## 🎨 Font Choice: DM Sans

We're using **DM Sans** instead of Inter for a more distinctive look:

- **Modern & Friendly**: Geometric sans-serif with warm personality
- **Excellent Readability**: Optimized for screens at all sizes
- **Variable Weights**: 400, 500, 600, 700 available
- **Open Source**: Free from Google Fonts
- **Better Distinction**: Avoids the "generic AI look" of Inter

The font is loaded via Google Fonts (no package needed):
```css
@import url('https://fonts.googleapis.com/css2...');
```

---

## 🎯 What's Next?

You now have:

✅ Complete design system with tokens
✅ Reusable UI components (Button, Input, Card, Badge)
✅ Toast notification system
✅ Modern, consistent styling
✅ Responsive utilities
✅ Accessibility built-in

### Next Steps:

1. **Test the components** - Try using Button, Input, and Card in your existing pages
2. **Replace old styles** - Gradually migrate from Bootstrap to new components
3. **Ready for Phase 2** - We'll update Header and Footer next!

---

## 💡 Tips

1. **Import from index**: Always import from `@/components/ui` for cleaner code
2. **Use tokens**: Reference design tokens instead of hardcoding values
3. **Combine utilities**: Mix utility classes with custom styles
4. **Test responsiveness**: Check components on mobile, tablet, and desktop
5. **Follow patterns**: Use similar patterns across your app for consistency

---

## 🐛 Troubleshooting

**Issue**: Components not styled correctly
- **Solution**: Ensure `design-system.css` is imported before component CSS

**Issue**: Toast not appearing
- **Solution**: Make sure `ToastProvider` wraps your App component

**Issue**: Icons not showing
- **Solution**: Verify `lucide-react` is installed: `npm install lucide-react`

**Issue**: Custom properties not working
- **Solution**: Check browser support (all modern browsers support CSS variables)

---

## 📚 Resources

- [Lucide Icons](https://lucide.dev/) - Browse all available icons
- [Framer Motion](https://www.framer.com/motion/) - Animation documentation
- [React Hot Toast](https://react-hot-toast.com/) - Toast documentation
- [DM Sans Font](https://fonts.google.com/specimen/DM+Sans) - Font details

---

**Need help?** Let me know if you encounter any issues during implementation!
