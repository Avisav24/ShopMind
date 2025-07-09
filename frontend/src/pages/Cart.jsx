import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import {
  Sliders,
  ShoppingCart,
  RefreshCw,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
// Import cart debug helper
import { diagnoseCartDisplay, testCartApi } from "../cart-debug";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [updating, setUpdating] = useState(false);

  // State for error handling
  const [error, setError] = useState(null);
  const [retries, setRetries] = useState(0);

  // Fetch all cart and user data from API
  useEffect(() => {
    const fetchAllCartData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching cart and user data from API...");

        // Fetch user profile for budget and eco points
        try {
          const profileResponse = await apiService.getUserProfile("current");
          if (profileResponse && profileResponse.success) {
            setBudgetLimit(profileResponse.profile.budgetLimit || 100);
          }
        } catch (profileError) {
          console.log("Using default profile settings");
          setBudgetLimit(100);
        }

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
              id: item.product._id || item.productId,
              name: item.product.name,
              price: item.product.price || 0,
              quantity: item.quantity || 1,
              image:
                item.product.image ||
                "https://placehold.co/100x100/gray/white?text=Product",
              ecoPoints: item.product.ecoScore || 0,
              discount: item.product.discount || 0,
            };
          });

          console.log("Formatted cart items:", formattedItems);
          diagnoseCartDisplay(formattedItems, response);
          setCartItems(formattedItems);
        } else {
          console.warn("Invalid cart response format:", response);
          if (retries < 2) {
            console.log(`Retrying cart fetch (attempt ${retries + 1}/2)...`);
            setRetries((prev) => prev + 1);
            setTimeout(fetchAllCartData, 1000);
            return;
          }
          setError("Unable to retrieve cart items. Please try again later.");
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart data:", err);
        setError(
          "Error connecting to cart service. Please check your connection and try again."
        );
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCartData();
  }, [retries]);

  // Real-time interactive functions
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(id);
      return;
    }

    setUpdating(true);
    try {
      await apiService.updateCartItem(id, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (id) => {
    setUpdating(true);
    try {
      await apiService.removeFromCart(id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));

      // Item removed successfully
      const removedItem = cartItems.find((item) => item.id === id);
      console.log("Item removed from cart:", removedItem);
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleBudgetChange = async (newBudget) => {
    setBudgetLimit(newBudget);
    try {
      await apiService.updateUserProfile("current", { budgetLimit: newBudget });
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const refreshCart = async () => {
    setRetries((prev) => prev + 1);
  };

  // Calculate dynamic values
  const currentTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalEcoPoints = cartItems.reduce(
    (sum, item) => sum + (item.ecoPoints || 0) * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isOverBudget = currentTotal > budgetLimit;
  const budgetRemaining = budgetLimit - currentTotal;
  const totalSavings = cartItems.reduce(
    (sum, item) =>
      sum + ((item.originalPrice || item.price) - item.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with real-time stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
          <span>•</span>
          <span>${currentTotal.toFixed(2)} total</span>
          <span>•</span>
          <span className="text-green-600">{totalEcoPoints} eco points</span>
          {totalSavings > 0 && (
            <>
              <span>•</span>
              <span className="text-green-600">
                ${totalSavings.toFixed(2)} saved
              </span>
            </>
          )}
        </div>
      </div>

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
                <div className="flex justify-between items-start">
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
                    </div>
                  </div>
                  <button
                    onClick={refreshCart}
                    className="text-yellow-700 hover:text-yellow-900"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add some items to get started with your shopping
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="w-full bg-walmart-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={refreshCart}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Cart
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Real-time Cart Items List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg font-bold text-walmart-blue">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.discount > 0 && (
                              <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                {item.discount}% off
                              </span>
                            )}
                            {item.ecoPoints > 0 && (
                              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                +{item.ecoPoints} eco
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={updating}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-center min-w-[3rem] border-x border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={updating}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updating}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Dynamic Budget & Summary Sidebar */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1 space-y-6">
              {/* Budget Tracker */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Budget Tracker
                  </h2>
                  <Sliders className="w-5 h-5 text-walmart-blue" />
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Budget Limit
                    </label>
                    <span className="text-sm font-bold text-gray-900">
                      ${budgetLimit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    value={budgetLimit}
                    onChange={(e) => handleBudgetChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$20</span>
                    <span>$500</span>
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
                    <span className="text-gray-600">Budget Remaining:</span>
                    <span
                      className={`font-medium ${
                        budgetRemaining < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ${budgetRemaining.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eco Points:</span>
                    <span className="font-medium text-green-600">
                      +{totalEcoPoints}
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Savings:</span>
                      <span className="font-medium text-green-600">
                        ${totalSavings.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {isOverBudget && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      You're ${(currentTotal - budgetLimit).toFixed(2)} over
                      budget!
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
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
                  <p className="text-xs text-gray-500 text-center">
                    {((currentTotal / budgetLimit) * 100).toFixed(1)}% of budget
                    used
                  </p>
                </div>
              </div>

              {/* Checkout Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items):</span>
                    <span>${currentTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax:</span>
                    <span>${(currentTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>
                      ${(currentTotal + currentTotal * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full mt-4 bg-walmart-blue hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  disabled={updating || cartItems.length === 0}
                >
                  {updating ? "Updating..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
