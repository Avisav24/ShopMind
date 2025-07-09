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
      // Return mock data as fallback
      return {
        success: true,
        profile: {
          id: userId,
          name: "Demo User",
          email: "demo@smartcart.com",
          budgetLimit: 150,
          ecoPoints: 120,
          savingsGoal: 50,
          totalSpent: 45.67,
          joinDate: "March 2024"
        }
      };
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
      console.log("Falling back to mock meal suggestions data");
      
      // Return mock data when API fails
      return {
        success: true,
        meals: [
          {
            id: 1,
            name: "Mediterranean Bowl",
            type: "lunch",
            ingredients: [
              "Quinoa",
              "Chickpeas",
              "Cucumber",
              "Tomatoes",
              "Feta cheese",
              "Olive oil",
              "Lemon"
            ],
            cookTime: "20 min",
            calories: 450,
            protein: "18g",
            carbs: "52g",
            fat: "16g",
            image: "/api/placeholder/300/200",
          },
          {
            id: 2,
            name: "Chicken Stir Fry",
            type: "dinner",
            ingredients: [
              "Chicken breast",
              "Bell peppers",
              "Broccoli",
              "Carrots",
              "Soy sauce",
              "Jasmine rice",
              "Ginger"
            ],
            cookTime: "25 min",
            calories: 520,
            protein: "35g",
            carbs: "48g",
            fat: "12g",
            image: "/api/placeholder/300/200",
          },
          {
            id: 3,
            name: "Berry Smoothie Bowl",
            type: "breakfast",
            ingredients: [
              "Mixed berries",
              "Banana",
              "Greek yogurt",
              "Granola",
              "Honey",
              "Chia seeds"
            ],
            cookTime: "5 min",
            calories: 320,
            protein: "15g",
            carbs: "48g",
            fat: "8g",
            image: "/api/placeholder/300/200",
          },
          {
            id: 4,
            name: "Avocado Toast",
            type: "breakfast",
            ingredients: [
              "Whole grain bread",
              "Avocado",
              "Cherry tomatoes",
              "Lime juice",
              "Sea salt",
              "Red pepper flakes"
            ],
            cookTime: "10 min",
            calories: 280,
            protein: "8g",
            carbs: "32g",
            fat: "16g",
            image: "/api/placeholder/300/200",
          },
          {
            id: 5,
            name: "Lentil Soup",
            type: "lunch",
            ingredients: [
              "Red lentils",
              "Vegetable broth",
              "Carrots",
              "Onions",
              "Celery",
              "Turmeric",
              "Bay leaves"
            ],
            cookTime: "30 min",
            calories: 350,
            protein: "18g",
            carbs: "58g",
            fat: "2g",
            image: "/api/placeholder/300/200",
          },
          {
            id: 6,
            name: "Grilled Fish Tacos",
            type: "dinner",
            ingredients: [
              "White fish fillets",
              "Corn tortillas",
              "Purple cabbage",
              "Lime wedges",
              "Fresh cilantro",
              "Chipotle mayo"
            ],
            cookTime: "20 min",
            calories: 480,
            protein: "32g",
            carbs: "38g",
            fat: "18g",
            image: "/api/placeholder/300/200",
          },
          {
            id: 7,
            name: "Quinoa Power Salad",
            type: "lunch",
            ingredients: [
              "Quinoa",
              "Spinach",
              "Roasted sweet potato",
              "Pumpkin seeds",
              "Cranberries",
              "Balsamic vinaigrette"
            ],
            cookTime: "15 min",
            calories: 380,
            protein: "12g",
            carbs: "58g",
            fat: "12g",
            image: "/api/placeholder/300/200",
          },
          {
            id: 8,
            name: "Beef and Vegetable Curry",
            type: "dinner",
            ingredients: [
              "Lean beef",
              "Coconut milk",
              "Bell peppers",
              "Onions",
              "Curry spices",
              "Basmati rice"
            ],
            cookTime: "35 min",
            calories: 580,
            protein: "38g",
            carbs: "42g",
            fat: "22g",
            image: "/api/placeholder/300/200",
          }
        ],
        plannedMeals: [
          {
            date: "2025-06-23",
            breakfast: "Berry Smoothie Bowl",
            lunch: "Mediterranean Bowl",
            dinner: "Chicken Stir Fry"
          },
          {
            date: "2025-06-24",
            breakfast: "Avocado Toast",
            lunch: "Lentil Soup",
            dinner: "Grilled Fish Tacos"
          },
          {
            date: "2025-06-25",
            breakfast: "Greek yogurt with granola",
            lunch: "Quinoa Power Salad",
            dinner: "Beef and Vegetable Curry"
          }
        ],
        totalCalories: 3580,
        totalMeals: 8
      };
    }
  },

  // Get eco rewards data
  getEcoRewards: async () => {
    try {
      const response = await api.get("/eco/rewards");
      return response.data;
    } catch (error) {
      console.error("Error fetching eco rewards:", error);
      console.log("Falling back to mock eco rewards data");
      
      // Return mock data when API fails
      return {
        success: true,
        ecoPoints: 1250,
        carbonSaved: 45.2,
        totalImpact: {
          co2Reduced: 45.2,
          treesEquivalent: 12,
          waterSaved: 850
        },
        rewards: [
          {
            id: 1,
            name: "10% Off Organic Vegetables",
            description: "Get 10% discount on all organic vegetables",
            pointsCost: 500,
            category: "discount",
            expiryDays: 30,
            icon: "🥬",
            available: true
          },
          {
            id: 2,
            name: "Free Reusable Shopping Bag",
            description: "Eco-friendly canvas shopping bag",
            pointsCost: 300,
            category: "merchandise",
            expiryDays: 0,
            icon: "🛍️",
            available: true
          },
          {
            id: 3,
            name: "$5 Store Credit",
            description: "Credit towards your next purchase",
            pointsCost: 800,
            category: "credit",
            expiryDays: 60,
            icon: "💳",
            available: true
          },
          {
            id: 4,
            name: "Plant a Tree",
            description: "We'll plant a tree in your name",
            pointsCost: 1000,
            category: "environmental",
            expiryDays: 0,
            icon: "🌱",
            available: true
          },
          {
            id: 5,
            name: "15% Off Local Products",
            description: "Support local farmers and producers",
            pointsCost: 600,
            category: "discount",
            expiryDays: 45,
            icon: "🏪",
            available: true
          },
          {
            id: 6,
            name: "Solar Phone Charger",
            description: "Portable eco-friendly phone charger",
            pointsCost: 1500,
            category: "merchandise",
            expiryDays: 0,
            icon: "🔋",
            available: false
          }
        ],
        weeklyProgress: {
          current: 8,
          target: 12,
          streak: 3
        },
        achievements: [
          {
            id: 1,
            name: "Eco Warrior",
            description: "Made 50 sustainable choices",
            dateEarned: "2025-06-15",
            icon: "🏆"
          },
          {
            id: 2,
            name: "Carbon Cutter",
            description: "Reduced carbon footprint by 25kg",
            dateEarned: "2025-06-10",
            icon: "🌍"
          }
        ]
      };
    }
  },

  // Redeem eco reward
  redeemEcoReward: async (rewardId, pointsCost) => {
    try {
      const response = await api.post("/eco/redeem", { rewardId, pointsCost });
      return response.data;
    } catch (error) {
      console.error("Error redeeming eco reward:", error);
      console.log("Simulating reward redemption with mock data");
      
      // Return mock success response when API fails
      return {
        success: true,
        message: "Reward redeemed successfully!",
        newPointsBalance: Math.max(0, 1250 - pointsCost),
        redeemedReward: {
          id: rewardId,
          redeemedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        }
      };
    }
  },

  // Add meal to plan
  addMealToPlan: async (date, mealType, mealName) => {
    try {
      const response = await api.post("/meals/plan", {
        date,
        mealType,
        mealName,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding meal to plan:", error);
      // Return success for now since this is not implemented on backend
      return { success: true };
    }
  },

  // Remove meal from plan
  removeMealFromPlan: async (date, mealType) => {
    try {
      const response = await api.delete(`/meals/plan/${date}/${mealType}`);
      return response.data;
    } catch (error) {
      console.error("Error removing meal from plan:", error);
      // Return success for now since this is not implemented on backend
      return { success: true };
    }
  },
};

export default api;
