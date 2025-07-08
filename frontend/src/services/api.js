import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API service functions
export const apiService = {
  // Get AI recommendations
  getRecommendations: async () => {
    try {
      const response = await api.get("/recommendations");
      return response.data;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Add to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      console.log("Adding to cart API call:", { productId, quantity });
      // Make sure productId is a string (backend expects string IDs)
      const stringProductId = String(productId);
      const response = await api.post("/cart/add", {
        productId: stringProductId,
        quantity,
      });
      console.log("Add to cart API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  // Get cart items
  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  // Remove from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  // Get products
  getProducts: async (filters = {}) => {
    try {
      const response = await api.get("/products", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get meal suggestions
  getMealSuggestions: async (preferences = {}) => {
    try {
      const response = await api.get("/meals/suggestions", {
        params: preferences,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching meal suggestions:", error);
      throw error;
    }
  },
};

export default api;
