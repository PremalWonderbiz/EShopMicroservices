import axios, { type AxiosError, type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://localhost:6064';

// Create axios instance 
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    //do something before request is sent
    // Add authentication token if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (error.response?.status === 404) {
      // Handle not found
      console.error('Resource not found');
    } else if (error.response && error.response.status >= 500) {
      // Handle server errors
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

export default apiClient;


//response interceptor error handling exploaration
// Nice question. This is **exactly the right place** to think about error strategy — even if you implement it later.

// I’ll give you a **big-picture mental model first**, then concrete **patterns you can choose from**. No pressure to code now.

// ---

// ## First: what is a response interceptor *meant* for?

// Think of this interceptor as:

// > **“Cross-cutting, app-wide error behavior”**

// Not screen-specific logic.
// Not UI alerts.
// Not business rules.

// This layer should:

// * **Normalize errors**
// * **Decide what is global**
// * **Attach metadata**
// * **Trigger global side effects**

// ---

// ## 1️⃣ The MOST IMPORTANT improvement (foundation)

// ### Normalize all Axios errors into **one shape**

// Right now, every caller still has to understand Axios internals.

// Instead, convert Axios errors into a **domain-friendly error object**.

// ### Example concept (not mandatory code)

// ```ts
// {
//   type: 'unauthorized' | 'not-found' | 'server' | 'network' | 'timeout',
//   status?: number,
//   message: string,
//   originalError: AxiosError
// }
// ```

// So the rest of your app never checks:

// ```ts
// error.response?.status
// ```

// That logic lives **only here**.

// ---

// ## 2️⃣ Categorize errors (this is gold)

// Think in **error categories**, not status codes.

// ### Suggested categories

// | Category       | Meaning                        |
// | -------------- | ------------------------------ |
// | `unauthorized` | Auth expired / invalid         |
// | `forbidden`    | Logged in but no permission    |
// | `not-found`    | Wrong route / missing resource |
// | `validation`   | 400 / 422                      |
// | `server`       | 5xx                            |
// | `network`      | No internet / CORS / DNS       |
// | `timeout`      | Request took too long          |
// | `cancelled`    | Request was aborted            |

// Your interceptor’s job is to **detect and tag** these.

// ---

// ## 3️⃣ Global side effects (what belongs HERE)

// These are things you should **only do once**, globally.

// ### Good fits for interceptor

// * 🔐 **401**

//   * Clear auth tokens
//   * Redirect to login
//   * Trigger “session expired” event

// * 🌐 **Network / offline**

//   * Show “You are offline” banner
//   * Queue requests (optional)

// * 🔥 **5xx**

//   * Send logs to monitoring (Sentry, AppInsights)
//   * Show generic “Something went wrong”

// * ⏱ **Timeout**

//   * Retry (maybe)
//   * Show “Server is slow” message

// ---

// ## 4️⃣ What should NOT go here (very important)

// ❌ UI toasts / alerts
// ❌ Page-specific messaging
// ❌ Business logic decisions

// Why?

// Because:

// * Interceptor has **no UI context**
// * It runs for **every request**
// * It becomes impossible to reason about later

// Instead, return a **clean error** and let UI decide presentation.

// ---

// ## 5️⃣ Practical patterns (pick what fits your future)

// ### Pattern A — **Error mapping only (cleanest)**

// Interceptor:

// * Detects error
// * Converts it
// * Rejects with normalized error

// UI:

// * Decides what to show

// Best for:

// * Large apps
// * Clean architecture
// * Testability

// ---

// ### Pattern B — **Global + local combo (most common)**

// Interceptor handles:

// * Auth logout
// * Logging
// * Retry logic

// UI handles:

// * Messages
// * Navigation
// * UX reactions

// This is probably where you’ll land.

// ---

// ### Pattern C — **Event-driven errors (advanced)**

// Interceptor emits events:

// ```ts
// eventBus.emit('unauthorized');
// eventBus.emit('network-down');
// ```

// Other parts of app listen and react.

// Great for:

// * Micro-frontends
// * Large teams
// * Decoupled systems

// ---

// ## 6️⃣ Axios-specific improvements you’ll want later

// ### 🔁 Retry only safe requests

// * Retry `GET`
// * Retry on timeout / 5xx
// * Never retry `POST` blindly

// ### 🧠 Attach request metadata

// ```ts
// (error.config as any).skipGlobalErrorHandler
// ```

// Useful for:

// * Silent background calls
// * Polling APIs

// ---

// ## 7️⃣ One thing you should definitely add

// ### Detect non-response errors

// ```ts
// if (!error.response) {
//   // network error, CORS, DNS, offline
// }
// ```

// This is **more common** than people think.

// ---

// ## Mental model to keep

// > **Interceptors don’t solve UX — they create consistency.**

// You’re building:

// * A **single source of truth** for errors
// * A predictable contract for the rest of the app

// ---

// ## TL;DR (bookmark this)

// Your response interceptor should:

// 1. Categorize errors
// 2. Normalize them
// 3. Trigger global side effects
// 4. Never touch UI directly
// 5. Always rethrow a clean error

// ---

// When you’re ready later, I can:

// * Design a **perfect error type** for your app
// * Show a **retry + backoff** strategy
// * Map backend ProblemDetails → frontend errors
// * Show how this scales in microfrontends
