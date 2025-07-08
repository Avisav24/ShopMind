/**
 * SmartCart Cart Debug Helper
 *
 * This file contains debugging functions for the cart functionality.
 * Import and use these functions in your components to help diagnose cart issues.
 */

/**
 * Tests the cart API connection and returns the results
 */
export const testCartApi = async () => {
  console.group("🛒 SmartCart Cart API Test");

  try {
    // Test basic API connection
    console.log("Testing API connection...");
    const testResponse = await fetch("http://localhost:5000/api/test");
    const testData = await testResponse.json();

    if (testResponse.ok) {
      console.log("✅ API connection successful:", testData);
    } else {
      console.error("❌ API connection failed:", testData);
      return { success: false, error: "API connection failed" };
    }

    // Test cart API
    console.log("Testing cart API...");
    const cartResponse = await fetch("http://localhost:5000/api/cart");
    const cartData = await cartResponse.json();

    if (cartResponse.ok && cartData.success) {
      console.log("✅ Cart API successful. Items:", cartData.cartItems);

      if (cartData.cartItems && cartData.cartItems.length > 0) {
        console.log(`✅ Cart contains ${cartData.cartItems.length} items`);
        console.table(
          cartData.cartItems.map((item) => ({
            productId: item.productId,
            name: item.product?.name || "Unknown",
            price: item.product?.price || "Unknown",
            quantity: item.quantity,
          }))
        );
      } else {
        console.warn("⚠️ Cart is empty or cartItems array is missing");
      }
    } else {
      console.error("❌ Cart API failed:", cartData);
      return { success: false, error: "Cart API failed" };
    }

    return {
      success: true,
      cartItems: cartData.cartItems,
      itemCount: cartData.cartItems.length,
    };
  } catch (error) {
    console.error("❌ Error testing cart API:", error);
    return { success: false, error: error.message };
  } finally {
    console.groupEnd();
  }
};

/**
 * Tests adding an item to the cart
 */
export const testAddToCart = async (productId = "1", quantity = 1) => {
  console.group("🛒 SmartCart Add to Cart Test");

  try {
    console.log(
      `Testing add to cart for product ID ${productId}, quantity ${quantity}...`
    );

    const response = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log("✅ Add to cart successful:", data.message);

      if (data.cartItems && data.cartItems.length > 0) {
        console.log(`✅ Cart now contains ${data.cartItems.length} items`);

        // Find the item we just added
        const addedItem = data.cartItems.find(
          (item) => item.productId === productId
        );
        if (addedItem) {
          console.log("✅ Added item:", {
            productId: addedItem.productId,
            name: addedItem.product?.name || "Unknown",
            price: addedItem.product?.price || "Unknown",
            quantity: addedItem.quantity,
          });
        } else {
          console.warn("⚠️ Added item not found in cart response");
        }
      }

      return { success: true, cartItems: data.cartItems };
    } else {
      console.error("❌ Add to cart failed:", data);
      return { success: false, error: data.message || "Add to cart failed" };
    }
  } catch (error) {
    console.error("❌ Error testing add to cart:", error);
    return { success: false, error: error.message };
  } finally {
    console.groupEnd();
  }
};

/**
 * Diagnoses cart display issues in the UI
 */
export const diagnoseCartDisplay = (cartItems, apiResponse) => {
  console.group("🛒 SmartCart Cart Display Diagnostic");

  try {
    console.log("Comparing UI cart items with API response...");

    if (!cartItems || cartItems.length === 0) {
      console.error("❌ UI cart items array is empty or undefined");
    } else {
      console.log("✅ UI has", cartItems.length, "cart items");
    }

    if (
      !apiResponse ||
      !apiResponse.cartItems ||
      apiResponse.cartItems.length === 0
    ) {
      console.error("❌ API response cart items array is empty or undefined");
      return { success: false, error: "API cart items missing" };
    } else {
      console.log("✅ API has", apiResponse.cartItems.length, "cart items");
    }

    // Check for mapping issues
    if (cartItems && apiResponse && apiResponse.cartItems) {
      const apiCount = apiResponse.cartItems.length;
      const uiCount = cartItems.length;

      if (apiCount !== uiCount) {
        console.warn(
          `⚠️ UI shows ${uiCount} items but API has ${apiCount} items`
        );

        // Find missing items
        const uiIds = cartItems.map((item) => item.id);
        const apiIds = apiResponse.cartItems.map(
          (item) => item.product?._id || item.productId
        );

        const missingInUI = apiIds.filter((id) => !uiIds.includes(id));
        if (missingInUI.length > 0) {
          console.error("❌ Products in API but missing from UI:", missingInUI);
        }

        const missingInAPI = uiIds.filter((id) => !apiIds.includes(id));
        if (missingInAPI.length > 0) {
          console.error(
            "❌ Products in UI but missing from API:",
            missingInAPI
          );
        }
      } else {
        console.log("✅ UI and API have the same number of items");
      }
    }

    return {
      success: true,
      uiCount: cartItems?.length || 0,
      apiCount: apiResponse?.cartItems?.length || 0,
    };
  } catch (error) {
    console.error("❌ Error diagnosing cart display:", error);
    return { success: false, error: error.message };
  } finally {
    console.groupEnd();
  }
};

/**
 * Run a complete cart diagnostic
 */
export const runCartDiagnostic = async () => {
  console.group("🔍 SmartCart Cart Complete Diagnostic");

  try {
    // Check API connection
    const apiTest = await testCartApi();
    if (!apiTest.success) {
      console.error(
        "❌ API connection issues detected. Please check that the backend server is running."
      );
      return false;
    }

    // Test adding an item
    const addTest = await testAddToCart();
    if (!addTest.success) {
      console.error(
        "❌ Add to cart issues detected. Check backend logs for more details."
      );
      return false;
    }

    console.log(
      "✅ Cart diagnostics passed! If you still have issues, please check:"
    );
    console.log("1. Browser console for any React errors");
    console.log("2. Network tab for any failed API requests");
    console.log("3. Cart.jsx component for proper rendering of items");

    return true;
  } catch (error) {
    console.error("❌ Error running cart diagnostic:", error);
    return false;
  } finally {
    console.groupEnd();
  }
};
