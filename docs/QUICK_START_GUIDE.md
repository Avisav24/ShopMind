# 🚀 ShopMind Quick Start Guide

This guide will help you get the ShopMind application up and running on your local machine.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Running the Application

### Step 1: Start the Backend Server

The backend server provides APIs for cart management, product recommendations, and other features.

```bash
# Navigate to project root
cd SmartCart-AI-main

# Install backend dependencies (if not already done)
npm install

# Start the simple backend server
node simple-server.js
```

You should see a message indicating that the server is running on port 5000.

### Step 2: Start the Frontend Application

```bash
# Open a new terminal and navigate to the frontend directory
cd SmartCart-AI-main/frontend

# Install frontend dependencies (if not already done)
npm install

# Start the development server
npm start
```

The React app should open automatically in your default browser at http://localhost:3000.

## Verifying Everything Works

1. **Check the backend server**: Visit http://localhost:5000/test in your browser. You should see a message confirming that the test route is working.

2. **Check the homepage**: The main page should display product recommendations and other features.

3. **Add items to cart**: Click "Add to Cart" on any product. You should see a success message.

4. **View cart**: Click the cart icon in the navigation bar. Your added items should appear in the cart.

## Troubleshooting Common Issues

### Cart Items Not Appearing

If items don't appear in your cart after adding them:

1. Make sure both backend and frontend servers are running
2. Check your browser console (F12) for any errors
3. Try refreshing the browser
4. Restart the backend server
5. Ensure there are no CORS errors in the console

### API Connection Issues

If the frontend can't connect to the backend:

1. Verify the backend is running on port 5000
2. Check that the API base URL in frontend/src/services/api.js is set to http://localhost:5000/api
3. Check network requests in your browser's developer tools

### Other Issues

- Clear your browser cache
- Try using incognito/private mode
- Check terminal output for both servers for any error messages

## Need More Help?

Refer to the full documentation in the README.md file or open an issue on the project repository.
