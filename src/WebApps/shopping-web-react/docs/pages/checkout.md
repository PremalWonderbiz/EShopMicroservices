# `Checkout` Component – Summary & Flow

## Quick Summary ✅

The **Checkout** component:

* Renders a **validated checkout form**
* Displays an **order summary**
* Submits a **checkout request** to the backend
* Clears the cart on success
* Navigates the user to the **confirmation page**

---

## Step-by-Step Flow 🔁

### Imports & Setup

* Uses **`react-hook-form`** with **Yup** validation via `yupResolver`
* Reads `cart` and `clearCart` from `useCartStore`
* Uses:

  * `basketService` to call the checkout API
  * `useNavigate` from React Router for redirection

---

### Validation Schema

* A Yup `schema` defines required fields for:

  * Shipping details (first name, last name, email, address, etc.)
  * Payment details (card number, expiry, CVV, etc.)
* Client-side validation runs **before** any API call

---

### Guard / Early Redirect

* If `cart` is `null` or contains no items:

  * Redirects to `/cart`
  * Stops rendering the checkout UI

---

### UI Rendering

#### Left Column – Shipping Information

* Form fields registered using `register`
* Inline validation errors displayed using `errors`

#### Right Column – Payment & Order Summary

* Payment input fields
* Order summary:

  * **Total Items**

    ```ts
    cart.items.reduce((sum, i) => sum + i.quantity, 0)
    ```
  * **Total Price**

    ```ts
    cart.totalPrice.toFixed(2)
    ```
* Submit button:

  * Disabled while `submitting === true`

---

### Submit Handler (`onSubmit`)

1. Returns early if `cart` is missing
2. Sets `submitting` to `true`
3. Builds a `BasketCheckout` object containing:

   * `userName`
   * Placeholder `customerId`
   * `totalPrice`
   * `paymentMethod`
4. Calls checkout API:

   ```ts
   await basketService.checkoutBasket({
     basketCheckoutDto: checkoutData
   })
   ```
5. On success:

   * `await clearCart()`
   * Navigate to `/confirmation`
6. On error:

   * Logs the error
   * Shows an alert
7. Finally:

   * Resets `submitting` to `false`

---

## Behavior Notes & Possible Improvements 💡

* Form validation is fully **client-side** via Yup
* `clearCart()` is awaited to ensure cart state is cleared before navigation

### Potential Enhancements

* Replace placeholder `customerId` with a real user identifier
* Use Zustand selectors:

  ```ts
  useCartStore(s => s.cart)
  ```

  to reduce unnecessary re-renders
* Replace `alert()` with a better error UI
* Add loading indicators or spinner feedback during submission

