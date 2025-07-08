# Cart Functionality Troubleshooting Guide

If you're experiencing issues with the cart functionality in SmartCart-AI, follow this guide to diagnose and fix common problems.

## Common Issues

### 1. Products Not Appearing in Cart After Adding

This is one of the most common issues and can be caused by several factors:

#### Backend Issues:

- Backend server not running
- Backend server running but cart API endpoints not working
- Product IDs not matching between frontend and backend

#### Frontend Issues:

- API calls failing due to CORS or network issues
- Cart component not properly rendering items
- Data mapping issues between API response and UI

## Step-by-Step Troubleshooting

### Step 1: Verify Backend Server

```bash
# Test if the backend server is running
Invoke-RestMethod -Uri "http://localhost:5000/test" -Method GET
```

You should see a message confirming the server is running.

### Step 2: Test Cart API Directly

```bash
# Test getting cart items
Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method GET

# Test adding an item to cart
Invoke-RestMethod -Uri "http://localhost:5000/api/cart/add" -Method POST -Body '{"productId":"1","quantity":1}' -ContentType "application/json"
```

Examine the responses to ensure they return success and contain the expected data structure.

### Step 3: Debug Frontend

1. Open your browser's developer tools (F12)
2. Navigate to the Console tab
3. Add and inspect any errors

Alternatively, use the built-in diagnostic tool:

1. Go to the cart page
2. Click the "Run Cart Diagnostics" button (in development mode)
3. Check the console for diagnostic results

### Step 4: Inspect Network Requests

1. Open your browser's developer tools (F12)
2. Navigate to the Network tab
3. Click "Add to Cart" on a product
4. Look for the API request to `/api/cart/add`
5. Verify the request payload and response

### Step 5: Clear Browser Data

If all else fails, try:

1. Clearing browser cache
2. Restarting both servers
3. Opening the application in an incognito/private window

## Quick Fixes

### Backend Not Starting

```bash
# Make sure you're in the project root directory
cd SmartCart-AI-main

# Install dependencies if needed
npm install

# Start the server
node simple-server.js
```

### Frontend Not Connecting to Backend

Check `frontend/src/services/api.js` to ensure the API base URL is correctly set to `http://localhost:5000/api`.

### Cart Empty After Adding Items

This often indicates a data structure mismatch. Verify that:

1. The backend is returning cart items with the correct structure
2. The Cart.jsx component is correctly mapping API data to UI format
3. The productId used matches the expected format

## Using the Built-in Diagnostic Tools

We've included several diagnostic tools to help identify cart issues:

1. **Browser Console Diagnostic**: Copy and paste the script from `DIAGNOSTIC.md` into your browser console
2. **Backend API Test Script**: Run `node test-api.js` from the project root
3. **Debug Button**: Click "Run Cart Diagnostics" on the cart page (in development mode)

These tools will help identify specific issues with your cart functionality.

## Still Having Issues?

If you've followed all the steps above and are still experiencing problems:

1. Check the `CART_FIX_DETAILS.md` file for technical details about the cart implementation
2. Review the browser console for any React-specific errors
3. Try using the startup scripts (`start-smartcart.bat` or `start-smartcart.sh`) to ensure both servers are started correctly
