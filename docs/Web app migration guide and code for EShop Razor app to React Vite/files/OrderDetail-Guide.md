# OrderDetail Page - Component Guide

## 🎯 Overview

The **OrderDetail** page provides a comprehensive view of a single order with tracking timeline, shipping details, payment information, and order actions.

This is the page users land on when they:
- Click "View Details" from the orders list
- Click "View Orders" from confirmation page
- Access a specific order URL directly

---

## 📁 File Location

```
src/
└── pages/
    ├── OrderDetail.tsx         ← NEW
    └── OrderDetail.css         ← NEW
```

---

## 🚀 Installation

### Step 1: Copy Files

```bash
# Copy to your project
src/pages/OrderDetail.tsx
src/pages/OrderDetail.css
```

### Step 2: Add Route

Update your router configuration:

```tsx
import { OrderDetail } from '@/pages';

// Add this route
<Route path="/orders/:orderId" element={<OrderDetail />} />
```

### Step 3: Link from Other Pages

**From OrderList page:**
```tsx
<Link to={`/orders/${order.id}`}>
  View Details
</Link>
```

**From Confirmation page:**
```tsx
<Button onClick={() => navigate(`/orders/${orderNumber}`)}>
  View Order Details
</Button>
```

---

## 🎨 Features

### ✅ Order Timeline
- **Visual progress tracker** with 4 stages
- **Status-based coloring** (gray → yellow → green)
- **Animated active step** (pulsing marker)
- **Estimated delivery dates**
- **Status descriptions**

### ✅ Order Information Banner
- **Large order number** (monospace font)
- **Order date** with icon
- **Item count**
- **Status badge** with color coding

### ✅ Order Items Display
- **Product images** with fallback
- **Item details** (name, quantity, price)
- **Item totals** (price × quantity)
- **Hover effects**

### ✅ Address Display
- **Shipping address** with complete details
- **Billing address** (if different)
- **Contact information** (email, phone)
- **Icon-based layout**

### ✅ Payment Information
- **Masked card number** (last 4 digits)
- **Cardholder name**
- **Expiration date**
- **Card icon**

### ✅ Order Summary
- **Subtotal calculation**
- **Shipping costs**
- **Tax breakdown**
- **Total amount** (highlighted)

### ✅ Actions
- **Download receipt** (print)
- **Reorder** (add items back to cart)
- **Cancel order** (if pending)
- **Contact support**
- **Track package** (if shipped)

### ✅ States
- **Loading state** with spinner
- **Error state** if order not found
- **Cancelled order notice**

---

## 🔧 Component Props

The component uses React Router's `useParams` hook:

```tsx
const { orderId } = useParams<{ orderId: string }>();
```

No props needed - the order ID comes from the URL!

---

## 📊 Status Mapping

```typescript
const getStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Draft:
      return { label: 'Draft', variant: 'neutral', icon: Package };
    case OrderStatus.Pending:
      return { label: 'Processing', variant: 'warning', icon: Package };
    case OrderStatus.Completed:
      return { label: 'Delivered', variant: 'success', icon: CheckCircle };
    case OrderStatus.Cancelled:
      return { label: 'Cancelled', variant: 'error', icon: XCircle };
  }
};
```

### Status Colors:
- **Draft** (1): Gray - Order created but not paid
- **Pending** (2): Yellow/Orange - Payment received, processing
- **Completed** (3): Green - Order delivered
- **Cancelled** (4): Red - Order cancelled

---

## 🎨 Layout Structure

### Desktop Layout (≥ 1024px)

```
┌─────────────────────────────────────────────────────┐
│  [Back to Orders]              [Download] [Reorder] │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Order #ORD-12345678              [Processing Badge]│
│  📅 Jan 15, 2024 • 3 items                          │
└─────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│  ORDER TIMELINE          │  ORDER SUMMARY           │
│  ● Order Placed ✓        │  Subtotal:     $249.97   │
│  ● Processing (Active)   │  Shipping:     FREE      │
│  ○ Shipped              │  Tax:          $25.00    │
│  ○ Delivered            │  Total:        $274.97   │
│                          │  [Actions Card]          │
│  ORDER ITEMS             │  - Contact Support       │
│  [Item 1]                │  - Cancel Order          │
│  [Item 2]                │                          │
│  [Item 3]                │  [Tracking Card]         │
│                          │  - Track Package         │
│  SHIPPING ADDRESS        │                          │
│  PAYMENT METHOD          │                          │
└──────────────────────────┴──────────────────────────┘
```

### Mobile Layout (< 640px)

```
┌───────────────────────┐
│  [Back to Orders]     │
│  [Download]           │
│  [Reorder]            │
├───────────────────────┤
│  Order Info Banner    │
├───────────────────────┤
│  Order Timeline       │
├───────────────────────┤
│  Order Items          │
├───────────────────────┤
│  Shipping Address     │
├───────────────────────┤
│  Payment Method       │
├───────────────────────┤
│  Order Summary        │
├───────────────────────┤
│  Actions              │
└───────────────────────┘
```

---

## 💡 Usage Examples

### Basic Usage

```tsx
// Router configuration
<Route path="/orders/:orderId" element={<OrderDetail />} />

// Navigate from order list
navigate(`/orders/${order.id}`);

// Or use Link
<Link to={`/orders/${order.id}`}>View Details</Link>
```

### With Order Service Integration

Replace the mock data with your actual API:

```tsx
const loadOrderDetails = async () => {
  setLoading(true);
  try {
    // Your API call
    const response = await orderingService.getOrderById(orderId!);
    setOrder(response.order);
  } catch (error) {
    console.error('Failed to load order:', error);
    toast.error('Failed to load order details');
  } finally {
    setLoading(false);
  }
};
```

### Reorder Functionality

```tsx
const handleReorder = async () => {
  if (!order) return;

  try {
    // Add all items back to cart
    for (const item of order.orderItems) {
      await addItem({
        productId: item.productId,
        productName: 'Product Name', // Fetch from products API
        price: item.price,
        quantity: item.quantity,
        color: 'Default',
      });
    }

    toast.success('Items added to cart!');
    navigate('/cart');
  } catch (error) {
    toast.error('Failed to reorder items');
  }
};
```

### Cancel Order

```tsx
const handleCancelOrder = async () => {
  if (!order) return;

  const confirmed = window.confirm(
    'Are you sure you want to cancel this order?'
  );

  if (!confirmed) return;

  try {
    await orderingService.cancelOrder(order.id);
    toast.success('Order cancelled successfully');
    loadOrderDetails(); // Reload to show updated status
  } catch (error) {
    toast.error('Failed to cancel order');
  }
};
```

---

## 🎯 Timeline Logic

The timeline automatically adapts based on order status:

```typescript
// Completed orders show all steps as complete
const timelineSteps = [
  {
    title: 'Order Placed',
    completed: status >= OrderStatus.Pending,
    active: status === OrderStatus.Draft,
  },
  {
    title: 'Processing',
    completed: status > OrderStatus.Pending,
    active: status === OrderStatus.Pending,
  },
  {
    title: 'Shipped',
    completed: status === OrderStatus.Completed,
    active: false,
  },
  {
    title: 'Delivered',
    completed: status === OrderStatus.Completed,
    active: false,
  },
];
```

### Timeline States:
- **Completed** (✓) - Green circle, checkmark icon
- **Active** (⚡) - Yellow/orange circle, pulsing animation
- **Pending** (○) - Gray circle, default icon

---

## 🎨 Customization

### Add Product Names

Currently shows "Product #ID". To show actual product names:

```tsx
// Option 1: Fetch product details
const [productDetails, setProductDetails] = useState<Map<string, Product>>();

useEffect(() => {
  const loadProducts = async () => {
    const productIds = order.orderItems.map(item => item.productId);
    const products = await catalogService.getProductsByIds(productIds);
    
    const productMap = new Map();
    products.forEach(p => productMap.set(p.id, p));
    setProductDetails(productMap);
  };
  
  if (order) loadProducts();
}, [order]);

// Then in render:
<h3 className="item-name">
  {productDetails?.get(item.productId)?.name || `Product #${item.productId}`}
</h3>
```

### Add Order Notes

```tsx
// In order type, add notes field
interface Order {
  // ... existing fields
  notes?: string;
}

// In component
{order.notes && (
  <Card className="notes-card">
    <h3 className="notes-title">Order Notes</h3>
    <p className="notes-content">{order.notes}</p>
  </Card>
)}
```

### Add Tracking Number

```tsx
// Update Order type
interface Order {
  // ... existing fields
  trackingNumber?: string;
  trackingUrl?: string;
}

// In component
{order.trackingNumber && (
  <Card className="tracking-card">
    <h3 className="tracking-title">Tracking Information</h3>
    <p className="tracking-number">
      Tracking #: {order.trackingNumber}
    </p>
    {order.trackingUrl && (
      <Button
        fullWidth
        variant="primary"
        onClick={() => window.open(order.trackingUrl, '_blank')}
      >
        Track Package
      </Button>
    )}
  </Card>
)}
```

---

## 🔗 Integration Points

### From OrderList

```tsx
// In OrderList component
import { Link } from 'react-router-dom';

<Link to={`/orders/${order.id}`}>
  <Button size="sm" variant="outline">
    View Details
  </Button>
</Link>
```

### From Confirmation

```tsx
// In Confirmation component
const orderNumber = location.state?.orderNumber;

<Button
  onClick={() => navigate(`/orders/${orderNumber}`)}
  rightIcon={<ArrowRight />}
>
  View Order Details
</Button>
```

### From Email Links

Users can access directly via URL:
```
https://yoursite.com/orders/ORD-12345678
```

---

## 📊 Data Flow

```
User clicks "View Details"
        ↓
URL: /orders/:orderId
        ↓
useParams extracts orderId
        ↓
loadOrderDetails() called
        ↓
API fetch: GET /api/orders/:orderId
        ↓
Order data loaded
        ↓
Page renders with timeline, items, addresses
        ↓
User can: Print, Reorder, Cancel, Track
```

---

## 🎯 Action Handlers

### Download Receipt (Print)

```tsx
const handlePrint = () => {
  window.print();
};
```

The CSS includes print-specific styles that hide unnecessary elements.

### Reorder

```tsx
const handleReorder = async () => {
  // Add all order items back to cart
  // Navigate to cart
  // Show success toast
};
```

### Cancel Order

```tsx
const handleCancelOrder = async () => {
  // Confirm with user
  // Call cancel API
  // Reload order details
  // Update status to Cancelled
};
```

### Track Package

```tsx
const handleTrackPackage = () => {
  // Open tracking URL in new tab
  // Or navigate to tracking page
};
```

---

## 🎨 Visual States

### Normal Order (Pending)
```
┌─────────────────────────────┐
│ Order #ORD-12345678         │
│ [Processing Badge - Yellow] │
│                             │
│ Timeline:                   │
│ ✓ Order Placed             │
│ ⚡ Processing (Active)      │
│ ○ Shipped                  │
│ ○ Delivered                │
│                             │
│ [Reorder] [Cancel]          │
└─────────────────────────────┘
```

### Delivered Order
```
┌─────────────────────────────┐
│ Order #ORD-12345678         │
│ [Delivered Badge - Green]   │
│                             │
│ Timeline:                   │
│ ✓ Order Placed             │
│ ✓ Processing               │
│ ✓ Shipped                  │
│ ✓ Delivered                │
│                             │
│ [Track Package]             │
│ [Reorder]                   │
└─────────────────────────────┘
```

### Cancelled Order
```
┌─────────────────────────────┐
│ Order #ORD-12345678         │
│ [Cancelled Badge - Red]     │
│                             │
│ ⚠️ Order Cancelled          │
│                             │
│ [Contact Support]           │
└─────────────────────────────┘
```

---

## 🔧 Customization Examples

### Add Order History

Track status changes over time:

```tsx
interface OrderHistory {
  status: OrderStatus;
  timestamp: Date;
  note: string;
}

// In component
<Card className="history-card">
  <h3>Order History</h3>
  {order.history?.map((event, index) => (
    <div key={index} className="history-event">
      <span className="event-time">
        {event.timestamp.toLocaleString()}
      </span>
      <span className="event-status">
        {getStatusInfo(event.status).label}
      </span>
      <span className="event-note">{event.note}</span>
    </div>
  ))}
</Card>
```

### Add Customer Support Chat

```tsx
<Card className="support-card">
  <h3>Need Help with This Order?</h3>
  <p>Chat with our support team</p>
  <Button
    fullWidth
    variant="primary"
    leftIcon={<MessageCircle />}
    onClick={() => openSupportChat(order.id)}
  >
    Start Chat
  </Button>
</Card>
```

### Add Return/Refund Option

```tsx
{order.status === OrderStatus.Completed && (
  <Button
    fullWidth
    variant="outline"
    onClick={() => navigate(`/returns/initiate/${order.id}`)}
  >
    Return Items
  </Button>
)}
```

---

## 📱 Responsive Behavior

### Desktop (≥ 1024px)
- Two-column layout (main + sidebar)
- Sticky summary card
- Full timeline with descriptions

### Tablet (640px - 1024px)
- Single column layout
- Summary below main content
- Compact timeline

### Mobile (< 640px)
- Stacked layout
- Smaller timeline markers
- Reduced padding
- Full-width buttons

---

## ♿ Accessibility Features

✅ **Semantic HTML**
```tsx
<main className="order-detail-page">
  <nav>Back to Orders</nav>
  <article>Order details...</article>
</main>
```

✅ **ARIA Labels**
```tsx
<button aria-label={`Cancel order ${order.id}`}>
  Cancel Order
</button>
```

✅ **Keyboard Navigation**
- All buttons accessible via Tab
- Enter/Space to activate
- Focus indicators visible

✅ **Screen Reader Support**
```tsx
<span className="sr-only">Order status: {statusInfo.label}</span>
```

---

## 🐛 Error Handling

### Order Not Found

```tsx
if (!order) {
  return (
    <div className="order-error">
      <Package size={64} className="error-icon" />
      <h2>Order Not Found</h2>
      <p>We couldn't find the order you're looking for.</p>
      <Button onClick={() => navigate('/orders')}>
        View All Orders
      </Button>
    </div>
  );
}
```

### API Failure

```tsx
try {
  const response = await orderingService.getOrderById(orderId);
  setOrder(response.order);
} catch (error) {
  console.error('Failed to load order:', error);
  toast.error('Failed to load order details');
  // Show error state or retry option
}
```

### Missing Order ID

```tsx
useEffect(() => {
  if (!orderId) {
    toast.error('Invalid order ID');
    navigate('/orders');
    return;
  }
  loadOrderDetails();
}, [orderId]);
```

---

## 🎯 User Experience Flow

```
Orders List Page
      ↓ [Click "View Details"]
OrderDetail Page Loads
      ↓ [Show loading spinner]
API Call: Fetch order data
      ↓ [Order loaded]
Display:
  - Order number & status
  - Timeline with progress
  - Items purchased
  - Shipping address
  - Payment method
  - Order summary
      ↓ [User actions available]
Options:
  - Download receipt
  - Reorder items
  - Cancel order (if pending)
  - Track package (if shipped)
  - Contact support
```

---

## 💰 Business Value

**Reduces Support Tickets:**
- Self-service order information
- Clear status timeline
- Easy access to tracking

**Increases Repeat Purchases:**
- One-click reorder functionality
- Smooth experience encourages returns

**Builds Trust:**
- Transparent order status
- Professional presentation
- Easy cancellation if needed

**Improves Customer Satisfaction:**
- All info in one place
- Clear delivery expectations
- Multiple contact options

---

## 🔧 Advanced Features (Future)

### Real-time Updates

```tsx
useEffect(() => {
  // Poll for updates every 30 seconds
  const interval = setInterval(() => {
    loadOrderDetails();
  }, 30000);

  return () => clearInterval(interval);
}, [orderId]);
```

### WebSocket Integration

```tsx
useEffect(() => {
  const ws = new WebSocket(`wss://api.example.com/orders/${orderId}`);
  
  ws.onmessage = (event) => {
    const updatedOrder = JSON.parse(event.data);
    setOrder(updatedOrder);
    toast.info('Order status updated');
  };

  return () => ws.close();
}, [orderId]);
```

### Product Images in Items

```tsx
// Fetch product details to show images
const [products, setProducts] = useState<Map<string, Product>>();

useEffect(() => {
  const loadProducts = async () => {
    const ids = order.orderItems.map(i => i.productId);
    const prods = await catalogService.getProductsByIds(ids);
    
    const map = new Map();
    prods.forEach(p => map.set(p.id, p));
    setProducts(map);
  };
  
  if (order) loadProducts();
}, [order]);

// Then use in render
<img src={products?.get(item.productId)?.imageFile} />
```

---

## 📊 Component Checklist

Before deployment:

- [ ] Order loads correctly from API
- [ ] Timeline displays proper status
- [ ] Status badge shows correct variant
- [ ] All addresses display properly
- [ ] Payment info is masked correctly
- [ ] Order summary calculates totals
- [ ] Print functionality works
- [ ] Reorder adds items to cart
- [ ] Cancel order works (if pending)
- [ ] Loading state shows during fetch
- [ ] Error state shows if order not found
- [ ] Back button navigates correctly
- [ ] Mobile responsive
- [ ] Accessibility tested

---

## 🎨 Design Highlights

### Consistent with Confirmation Page
- Same timeline design
- Same card styling
- Same badge variants
- Same button patterns

### Unique to OrderDetail
- Editable actions (reorder, cancel)
- More comprehensive information
- Back navigation
- Support access

### Visual Hierarchy
1. Order number (largest, monospace)
2. Status badge (prominent color)
3. Timeline (visual storytelling)
4. Items (product focus)
5. Details (supporting info)
6. Actions (clear CTAs)

---

## 🚀 Integration with Existing Flow

```
Confirmation Page
      ↓ [View Order Details]
OrderDetail Page
      ↓ [Shows same order]
      ↓ [Can reorder]
Cart Page
      ↓ [Checkout again]
New Order!
```

---

## 💡 Pro Tips

1. **Cache Order Data**: Store in state management to avoid re-fetching
2. **Prefetch Product Images**: Load images for better UX
3. **Add Analytics**: Track which orders users view most
4. **Enable Deep Linking**: Share order URLs via email
5. **Add Export Options**: CSV, PDF downloads
6. **Implement Notifications**: Email when status changes

---

**This completes the order management experience!** Users can now track their orders from placement to delivery with a professional, modern interface. 🎉
