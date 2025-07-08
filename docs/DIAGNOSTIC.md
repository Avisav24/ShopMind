# Frontend-Backend Communication Diagnostic Tool

This script should be run from the browser console when you're experiencing issues with cart functionality. It will help diagnose communication issues between the frontend and backend.

```javascript
// Run this in your browser console when on the SmartCart website

console.log("🔍 Running SmartCart Diagnostics...");

// Check if axios is loaded properly
console.log("📚 Checking if axios is loaded...");
if (window.axios) {
  console.log("✅ Axios is loaded properly");
} else {
  console.error("❌ Axios is not loaded - this will prevent API calls");
}

// Check API base URL
console.log("🌐 Checking API configuration...");
try {
  // This assumes apiService is accessible from the window object
  // You may need to adjust this based on your actual implementation
  const apiBaseUrl = window.apiService?.baseURL || "Not accessible";
  console.log(`API Base URL: ${apiBaseUrl}`);
  if (apiBaseUrl !== "http://localhost:5000/api") {
    console.warn(
      "⚠️ API Base URL might be incorrect. Expected: http://localhost:5000/api"
    );
  } else {
    console.log("✅ API Base URL is correctly configured");
  }
} catch (error) {
  console.error("❌ Error accessing API configuration:", error);
}

// Test the API connection
console.log("🔌 Testing API connection...");
fetch("http://localhost:5000/api/test")
  .then((response) => {
    if (response.ok) {
      console.log("✅ Backend API is reachable");
      return response.json();
    }
    throw new Error(`Server responded with ${response.status}`);
  })
  .then((data) => {
    console.log("📡 API Response:", data);
  })
  .catch((error) => {
    console.error("❌ Cannot reach backend API:", error);
    console.error("Please check if backend server is running on port 5000");
  });

// Test the cart API
console.log("🛒 Testing cart API...");
fetch("http://localhost:5000/api/cart")
  .then((response) => {
    if (response.ok) {
      console.log("✅ Cart API is reachable");
      return response.json();
    }
    throw new Error(`Server responded with ${response.status}`);
  })
  .then((data) => {
    console.log("🛒 Cart contains:", data);
    if (data.cartItems && data.cartItems.length > 0) {
      console.log(`✅ Cart has ${data.cartItems.length} items`);
      console.table(
        data.cartItems.map((item) => ({
          productId: item.productId,
          name: item.product?.name || "Unknown",
          quantity: item.quantity,
          price: item.product?.price || "Unknown",
        }))
      );
    } else {
      console.warn("⚠️ Cart is empty or cartItems array is missing");
    }
  })
  .catch((error) => {
    console.error("❌ Cannot reach cart API:", error);
    console.error(
      "Please check if backend server is running and cart endpoint is implemented"
    );
  });

// Examine localStorage for any cart-related data
console.log("🔍 Checking localStorage for cart data...");
try {
  const localStorageItems = Object.keys(localStorage)
    .filter((key) => key.toLowerCase().includes("cart"))
    .reduce((obj, key) => {
      obj[key] = localStorage.getItem(key);
      return obj;
    }, {});

  if (Object.keys(localStorageItems).length > 0) {
    console.log(
      "📦 Found cart-related items in localStorage:",
      localStorageItems
    );
  } else {
    console.log("ℹ️ No cart-related items found in localStorage");
  }
} catch (error) {
  console.error("❌ Error accessing localStorage:", error);
}

console.log(
  "✨ SmartCart Diagnostic complete. Check console output above for issues."
);
```

## How to Use This Tool

1. Open your browser and navigate to the SmartCart application
2. Open Developer Tools (F12 or Ctrl+Shift+I)
3. Navigate to the Console tab
4. Copy and paste the entire script above into the console
5. Press Enter to run the diagnostic
6. Review the output in the console for issues

## Common Issues and Solutions

### No Connection to Backend

If you see "Cannot reach backend API", check:

- Is the backend server running? Start it with `node simple-server.js`
- Is the backend running on port 5000?
- Are there any CORS issues? (Look for related errors in console)

### Empty Cart

If the cart API returns successfully but the cart is empty:

- Try adding products again
- Check the browser console when clicking "Add to Cart" for any errors
- Verify the productId being sent to the server matches a product in the mockProducts array

### Cart Items Not Displaying

If items exist in the cart API but don't show in the UI:

- Check if the Cart.jsx component is properly mapping and rendering cart items
- Verify that the frontend Cart component is correctly calling the getCart API
- Look for any errors when rendering the cart items

## Further Debugging

If issues persist:

1. Add `console.log` statements to key functions in Cart.jsx and api.js
2. Inspect network requests when adding items to cart
3. Try clearing browser cache and localStorage
4. Ensure both backend and frontend are running the latest code
cd c:\Users\abhin\Downloads\SmartCart-AI-main\SmartCart-AI-main
## Installation and Setup Instructions

To install and set up the SmartCart project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Avisav24/SmartCart.git
   ```

2. Navigate to the project directory:

   ```bash
   cd SmartCart
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:3000` to see the app in action.

### Running the Backend Server

To run the backend server separately, follow these steps:

1. Navigate to the backend directory (if applicable):

   ```bash
   cd backend
   ```

2. Install backend dependencies (if any):

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   node simple-server.js
   ```

4. Ensure the backend is running on port 5000, and the frontend is configured to communicate with the correct API base URL.

### Note

- Ensure you have Node.js and npm installed on your machine before starting the installation process.
- If you encounter any issues, refer to the troubleshooting section or seek help from the repository's issue tracker.
