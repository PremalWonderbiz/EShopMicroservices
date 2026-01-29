# `cartStore.ts` – Overview & Usage Guide

## Quick Overview ✅

### What this file is

`cartStore.ts` defines a **Zustand store** for the shopping cart. It declares:

* The cart **state shape**
* **Async and sync actions**
* **Persistence** using middleware

The store is exported as `useCartStore` and is consumed by React components to **read and update cart data**.

---

## Core Concepts (Zustand) 🔧

* **Zustand** is a tiny, unopinionated state manager for React.
* It exposes a **hook** (`useCartStore`) that components use to access and manipulate state.
* The store initializer receives:

  * `set` → update state
  * `get` → read current state
* **Middlewares** (like `persist`) add extra behavior such as `localStorage` persistence.
* Stores are created using:

```ts
create<T>()(initializer)
```

Where `T` is a TypeScript interface describing the store’s shape.

---

## How `cartStore.ts` Uses Zustand 📌

### Store Creation

* Uses `persist` middleware
* Saves state to `localStorage` under the key:

```txt
shopping-cart
```

* Automatically **rehydrates** state on app load

---

### State Fields

```ts
cart: ShoppingCart | null   // items, totalPrice, userName
loading: boolean
error: string | null
```

---

### Actions (Async & Sync)

#### `loadCart()`

* Loads user basket via:

```ts
basketService.loadUserBasket()
```

* Updates `cart` state

#### `addItem(item)`

* Adds a new item or increments quantity
* Recalculates `totalPrice`
* Calls `syncCart()` to persist changes to backend

#### `removeItem(productId)`

* Removes item from cart
* Recalculates total price
* Calls `syncCart()`

#### `updateQuantity(productId, quantity)`

* Updates item quantity
* Removes item if `quantity <= 0`
* Calls `syncCart()`

#### `clearCart()`

* Calls:

```ts
basketService.deleteBasket(...)
```

* Clears local cart state

#### `syncCart()`

* Syncs local cart to backend using:

```ts
basketService.storeBasket({ cart })
```

---

### Implementation Pattern

* Use `get()` inside actions to read current state
* Use `set()` to update state
* Actions perform **optimistic updates**:

  * Update UI immediately
  * Then sync changes to server via `syncCart()`

---

## Example Usage in a Component 👩‍💻

### Best Practices

* Use **selectors** to avoid unnecessary re-renders
* Trigger `loadCart()` on component mount
* Use `await addItem(item)` inside event handlers

---

## Tips & Gotchas ⚠️

* `persist` uses `localStorage`

  * ❌ Not SSR-safe (undefined on server)
* Always use **selectors**

  * Avoid reading the entire cart if you only need `items.length`
* Optimistic updates are used

  * Errors are stored in `error`
  * Consider retry logic or better error handling
* For frequent updates:

  * **Debounce `syncCart()`** to reduce backend calls 💡