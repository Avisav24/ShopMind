const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// ANSI color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

async function testAPI() {
  console.log(`${colors.bright}🧪 TESTING SMARTCART API${colors.reset}\n`);

  try {
    // 1. Test the basic API connection
    console.log(`${colors.cyan}Testing API connection...${colors.reset}`);
    const testResponse = await axios.get(`${API_BASE_URL}/test`);
    console.log(
      `${colors.green}✅ API connection: ${testResponse.data.message}${colors.reset}\n`
    );

    // 2. Test recommendations API
    console.log(`${colors.cyan}Testing recommendations API...${colors.reset}`);
    const recommendationsResponse = await axios.get(
      `${API_BASE_URL}/recommendations`
    );
    if (
      recommendationsResponse.data.success &&
      recommendationsResponse.data.recommendations
    ) {
      console.log(
        `${colors.green}✅ Recommendations API: Found ${recommendationsResponse.data.recommendations.length} recommendations${colors.reset}`
      );
      console.log(
        `   First recommendation: ${recommendationsResponse.data.recommendations[0].name}`
      );
    } else {
      console.log(`${colors.red}❌ Recommendations API failed${colors.reset}`);
    }
    console.log();

    // 3. Clear the cart (for testing purposes)
    console.log(`${colors.cyan}Resetting cart for tests...${colors.reset}`);
    // No clear cart endpoint, so we'll check what's in the cart first
    const initialCartResponse = await axios.get(`${API_BASE_URL}/cart`);
    console.log(
      `${colors.yellow}ℹ️ Initial cart has ${initialCartResponse.data.cartItems.length} items${colors.reset}\n`
    );

    // 4. Test adding to cart
    console.log(`${colors.cyan}Testing add to cart...${colors.reset}`);
    const addToCartResponse = await axios.post(`${API_BASE_URL}/cart/add`, {
      productId: "1", // Organic Bananas
      quantity: 2,
    });

    if (addToCartResponse.data.success) {
      console.log(
        `${colors.green}✅ Add to cart: ${addToCartResponse.data.message}${colors.reset}`
      );
    } else {
      console.log(`${colors.red}❌ Add to cart failed${colors.reset}`);
    }
    console.log();

    // 5. Test getting cart
    console.log(`${colors.cyan}Testing get cart items...${colors.reset}`);
    const cartResponse = await axios.get(`${API_BASE_URL}/cart`);

    if (cartResponse.data.success && cartResponse.data.cartItems) {
      console.log(
        `${colors.green}✅ Get cart: Found ${cartResponse.data.cartItems.length} items${colors.reset}`
      );
      cartResponse.data.cartItems.forEach((item) => {
        console.log(
          `   - ${item.quantity}x ${item.product.name} ($${item.product.price})`
        );
      });
    } else {
      console.log(`${colors.red}❌ Get cart failed${colors.reset}`);
    }
    console.log();

    // 6. Test debug endpoint
    console.log(`${colors.cyan}Testing debug endpoint...${colors.reset}`);
    const debugResponse = await axios.get(`${API_BASE_URL}/debug/cart`);

    if (debugResponse.data.success) {
      console.log(
        `${colors.green}✅ Debug endpoint: Cart has ${debugResponse.data.cartItemCount} items${colors.reset}`
      );
    } else {
      console.log(`${colors.red}❌ Debug endpoint failed${colors.reset}`);
    }

    console.log(`\n${colors.bright}🎉 ALL TESTS COMPLETE${colors.reset}`);
    console.log(
      `${colors.yellow}If all tests passed, the backend API is functioning correctly.${colors.reset}`
    );
    console.log(
      `${colors.yellow}If cart items still don't display in the frontend:${colors.reset}`
    );
    console.log(
      `${colors.yellow}1. Check browser console for errors${colors.reset}`
    );
    console.log(
      `${colors.yellow}2. Ensure frontend is making requests to the correct API URL${colors.reset}`
    );
    console.log(`${colors.yellow}3. Check for CORS issues${colors.reset}`);
    console.log(
      `${colors.yellow}4. Verify the Cart.jsx component is displaying items correctly${colors.reset}`
    );
  } catch (error) {
    console.log(`${colors.red}❌ Error during API testing:${colors.reset}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, error.response.data);
    } else if (error.request) {
      console.log(`   No response received. Is the server running?`);
    } else {
      console.log(`   Error message: ${error.message}`);
    }
  }
}

testAPI();
