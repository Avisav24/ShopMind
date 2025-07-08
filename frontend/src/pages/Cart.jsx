import React, { useState, useEffect } from "react";
import CartSummary from "../components/CartSummary";
import { apiService } from "../services/api";
import { Sliders } from "lucide-react";
// Import cart debug helper
import { diagnoseCartDisplay, testCartApi } from "../cart-debug";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetLimit, setBudgetLimit] = useState(50);

  // State for error handling
  const [error, setError] = useState(null);
  const [retries, setRetries] = useState(0);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching cart items from API...");

        // Run cart API test for diagnostic purposes
        const apiTest = await testCartApi();
        if (!apiTest.success) {
          setError(
            "Unable to connect to the cart service. Please try again later."
          );
          setCartItems([]);
          setLoading(false);
          return;
        }

        const response = await apiService.getCart();
        console.log("Cart API response:", response);

        if (
          response &&
          response.success &&
          response.cartItems &&
          Array.isArray(response.cartItems)
        ) {
          // Validate cart items have required properties
          const validItems = response.cartItems.filter(
            (item) => item && item.product && item.product.name && item.quantity
          );

          console.log("Valid cart items found:", validItems.length);

          if (validItems.length === 0) {
            console.log("No valid cart items found in response");
            setCartItems([]);
            return;
          }

          // Transform API cart items to match UI format
          const formattedItems = validItems.map((item) => {
            console.log("Processing cart item:", item);
            return {
              id: item.product._id || item.productId, // Support both formats
              name: item.product.name,
              price: item.product.price || 0,
              quantity: item.quantity || 1,
              image:
                item.product.image ||
                "https://placehold.co/100x100/gray/white?text=Product",
            };
          });

          console.log("Formatted cart items:", formattedItems);

          // Run diagnostic to ensure UI and API are in sync
          diagnoseCartDisplay(formattedItems, response);

          setCartItems(formattedItems);
        } else {
          console.warn("Invalid cart response format:", response);
          if (retries < 2) {
            console.log(`Retrying cart fetch (attempt ${retries + 1}/2)...`);
            setRetries((prev) => prev + 1);
            setTimeout(fetchCartItems, 1000); // Try again after 1 second
            return;
          }
          setError("Unable to retrieve cart items. Please try again later.");
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError(
          "Error connecting to cart service. Please check your connection and try again."
        );
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [retries]);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const currentTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const isOverBudget = currentTotal > budgetLimit;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-walmart-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">{error}</p>
                    <button
                      className="text-sm font-medium text-yellow-700 underline mt-1"
                      onClick={() => window.location.reload()}
                    >
                      Refresh Page
                    </button>
                  </div>
                </div>
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-4">
                  Add some items to get started
                </p>
                <button className="bg-walmart-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <CartSummary
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            )}
          </div>

          {/* Debug Button - only visible in development */}
          {process.env.NODE_ENV === "development" && (
            <button
              onClick={async () => {
                console.log("Running cart diagnostics...");
                const apiTest = await testCartApi();
                diagnoseCartDisplay(cartItems, {
                  cartItems: apiTest.cartItems,
                });
              }}
              className="mt-4 px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
            >
              🔍 Run Cart Diagnostics
            </button>
          )}

          {/* Budget Simulator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <Sliders className="w-5 h-5 text-walmart-blue mr-2" />
                <h2 className="text-lg font-bold text-gray-900">
                  Budget Simulator
                </h2>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Limit: ${budgetLimit}
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$20</span>
                  <span>$200</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Total:</span>
                  <span
                    className={`font-medium ${
                      isOverBudget ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    ${currentTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget Limit:</span>
                  <span className="font-medium text-gray-900">
                    ${budgetLimit.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span
                    className={`font-medium ${
                      isOverBudget ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    ${(budgetLimit - currentTotal).toFixed(2)}
                  </span>
                </div>
              </div>

              {isOverBudget && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    ⚠️ You're over budget by $
                    {(currentTotal - budgetLimit).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isOverBudget ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (currentTotal / budgetLimit) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Savings Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">
                💡 Smart Savings Tips
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Switch to store brand for 15% savings</li>
                <li>• Buy in bulk for frequently used items</li>
                <li>• Check for digital coupons</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
