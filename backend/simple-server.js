require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Mock data
const mockProducts = [
  {
    _id: "1",
    name: "Organic Bananas",
    price: 2.99,
    category: "fruits",
    isSustainable: true,
    ecoScore: 85,
    image: "/images/products/product-1-bananas.svg",
    rating: 4.5,
    reviews: 120,
    discount: 15,
  },
  {
    _id: "2",
    name: "Greek Yogurt",
    price: 4.99,
    category: "dairy",
    isSustainable: true,
    ecoScore: 75,
    image: "/images/products/product-2-yogurt.svg",
    rating: 4.8,
    reviews: 95,
    discount: 10,
  },
  {
    _id: "3",
    name: "Whole Grain Bread",
    price: 3.49,
    category: "bakery",
    isSustainable: true,
    ecoScore: 70,
    image: "/images/products/product-3-bread.svg",
    rating: 4.3,
    reviews: 85,
    discount: 5,
  },
  {
    _id: "4",
    name: "Almond Milk",
    price: 3.99,
    category: "dairy",
    isSustainable: true,
    ecoScore: 80,
    image: "/images/products/product-4-almond-milk.svg",
    rating: 4.6,
    reviews: 110,
    discount: 12,
  },
  {
    _id: "5",
    name: "Organic Chicken Breast",
    price: 12.99,
    category: "meat",
    isSustainable: true,
    ecoScore: 65,
    image: "/images/products/product-5-chicken.svg",
    rating: 4.2,
    reviews: 75,
    discount: 8,
  },
  {
    _id: "6",
    name: "Brown Rice",
    price: 2.49,
    category: "grains",
    isSustainable: true,
    ecoScore: 90,
    image: "/images/products/product-6-rice.svg",
    rating: 4.6,
    reviews: 201,
    discount: 0,
  },
  {
    _id: "7",
    name: "Fresh Spinach",
    price: 2.99,
    category: "vegetables",
    isSustainable: true,
    ecoScore: 95,
    image: "/images/products/product-7-spinach.svg",
    rating: 4.7,
    reviews: 62,
    discount: 15,
  },
  {
    _id: "8",
    name: "Quinoa",
    price: 5.99,
    category: "grains",
    isSustainable: true,
    ecoScore: 88,
    image: "/images/products/product-8-quinoa.svg",
    rating: 4.4,
    reviews: 45,
    discount: 10,
  },
  {
    _id: "9",
    name: "Milk",
    price: 3.29,
    category: "dairy",
    isSustainable: false,
    ecoScore: 60,
    image: "/images/products/product-9-milk.svg",
    rating: 4.0,
    reviews: 215,
    discount: 0,
  },
  {
    _id: "10",
    name: "Bread",
    price: 2.99,
    category: "bakery",
    isSustainable: false,
    ecoScore: 55,
    image: "/images/products/product-10-bread.svg",
    rating: 3.9,
    reviews: 126,
    discount: 0,
  },
  {
    _id: "11",
    name: "Butter",
    price: 4.49,
    category: "dairy",
    isSustainable: false,
    ecoScore: 50,
    image: "/images/products/product-11-butter.svg",
    rating: 4.2,
    reviews: 89,
    discount: 0,
  },
  {
    _id: "12",
    name: "Eggs",
    price: 3.99,
    category: "dairy",
    isSustainable: true,
    ecoScore: 75,
    image: "/images/products/product-12-eggs.svg",
    rating: 4.5,
    reviews: 167,
    discount: 5,
  },
];

// Simple recommendation logic
function getRecommendations(userHistory, userCart) {
  const recommendations = [];

  // Recommend products based on history
  userHistory.forEach((historyItem) => {
    const matchingProducts = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(historyItem.toLowerCase()) ||
        p.category.toLowerCase().includes(historyItem.toLowerCase())
    );

    matchingProducts.forEach((product) => {
      if (!recommendations.find((r) => r.name === product.name)) {
        recommendations.push({
          name: product.name,
          reason: `You've bought ${historyItem} before`,
          product: product,
        });
      }
    });
  });

  // Add some general recommendations if we don't have enough
  if (recommendations.length < 3) {
    mockProducts.slice(0, 3).forEach((product) => {
      if (!recommendations.find((r) => r.name === product.name)) {
        recommendations.push({
          name: product.name,
          reason: "Popular item",
          product: product,
        });
      }
    });
  }

  return recommendations.slice(0, 3);
}

// Middleware
app.use(cors());
app.use(express.json());

// Get all products API endpoint
app.get("/api/products/all", (req, res) => {
  console.log("Getting all products");
  res.json({
    success: true,
    products: mockProducts,
  });
});

// Placeholder image API route - use real URLs in production
app.get("/api/placeholder/:width/:height", (req, res) => {
  const { width, height } = req.params;
  res.redirect(
    `https://placehold.co/${width}x${height}/gray/white?text=Product`
  );
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "SmartCart Backend is running!" });
});

app.get("/test", (req, res) => {
  res.json({ message: "Test route working!" });
});

// API routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API test route working!" });
});

// Debug routes
app.get("/api/debug/cart", (req, res) => {
  console.log("🔍 DEBUG: Current cart state:", cartItems);
  res.json({
    success: true,
    cartItems: cartItems,
    cartItemCount: cartItems.length,
    mockProducts: mockProducts,
  });
});

// Recommendations endpoint
app.get("/api/recommendations", (req, res) => {
  try {
    console.log("🤖 Fetching AI recommendations...");

    // Mock user data (you can replace this with actual user data)
    const userData = {
      history: ["milk", "bread", "butter", "eggs"],
      cart: ["milk", "bread"],
    };

    const recommendations = getRecommendations(userData.history, userData.cart);

    console.log("✅ Generated recommendations:", recommendations);

    res.json({
      success: true,
      recommendations: recommendations,
    });
  } catch (error) {
    console.error("❌ Error generating recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
    });
  }
});

// Store cart items in memory for testing
let cartItems = [];

// Add to cart route
app.post("/api/cart/add", (req, res) => {
  const { productId, quantity } = req.body;
  console.log("Add to cart request:", { productId, quantity });

  // Find the product details
  const product = mockProducts.find((p) => p._id === productId);
  if (!product) {
    console.log(`Product not found with ID: ${productId}`);
    console.log("Available products:", mockProducts);
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Check if product already exists in cart
  const existingItemIndex = cartItems.findIndex(
    (item) => item.productId === productId
  );

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cartItems[existingItemIndex].quantity += quantity;
    console.log(
      `Updated quantity for product ${productId}:`,
      cartItems[existingItemIndex]
    );
  } else {
    // Add new item to cart
    const newCartItem = {
      productId,
      quantity,
      addedAt: new Date().toISOString(),
      product: product, // This now includes image, rating, etc.
    };
    cartItems.push(newCartItem);
    console.log("Added new item to cart:", newCartItem);
  }

  console.log("Current cart items:", cartItems);

  res.json({
    success: true,
    message: "Item added to cart successfully!",
    cartItems: cartItems,
  });
});

// Get cart items route
app.get("/api/cart", (req, res) => {
  console.log("Getting cart items:", cartItems);

  // Ensure all cart items have the correct structure with product details
  const validCartItems = cartItems.map((item) => {
    // Always get the latest product data to ensure images and other properties are up-to-date
    const product = mockProducts.find((p) => p._id === item.productId);
    if (product) {
      return {
        ...item,
        product: product,
      };
    }
    return item;
  });

  console.log("Sending formatted cart items:", validCartItems);

  res.json({
    success: true,
    cartItems: validCartItems,
  });
});

// Remove from cart route
app.delete("/api/cart/remove/:itemId", (req, res) => {
  const { itemId } = req.params;
  console.log("Remove from cart request for item:", itemId);

  // Filter out the item with the matching productId
  const initialLength = cartItems.length;
  cartItems = cartItems.filter((item) => item.productId !== itemId);

  if (cartItems.length < initialLength) {
    console.log("Item removed successfully");
    res.json({
      success: true,
      message: "Item removed from cart successfully",
      cartItems: cartItems,
    });
  } else {
    console.log("Item not found in cart");
    res.status(404).json({
      success: false,
      message: "Item not found in cart",
    });
  }
});

// Update cart item quantity route
app.put("/api/cart/update/:itemId", (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  console.log(`Update cart item ${itemId} quantity to ${quantity}`);

  // Find the item in the cart
  const itemIndex = cartItems.findIndex((item) => item.productId === itemId);

  if (itemIndex >= 0) {
    // Update the quantity
    cartItems[itemIndex].quantity = quantity;
    console.log("Item updated successfully:", cartItems[itemIndex]);

    res.json({
      success: true,
      message: "Cart item quantity updated successfully",
      cartItems: cartItems,
    });
  } else {
    console.log("Item not found in cart");
    res.status(404).json({
      success: false,
      message: "Item not found in cart",
    });
  }
});

// Meals API endpoints
app.get("/api/meals/suggestions", (req, res) => {
  try {
    // Mock meal suggestions
    const suggestions = [
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
        ],
        cookTime: "20 min",
        calories: 450,
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
          "Soy sauce",
          "Rice",
        ],
        cookTime: "25 min",
        calories: 520,
        image: "/api/placeholder/300/200",
      },
      {
        id: 3,
        name: "Avocado Toast",
        type: "breakfast",
        ingredients: [
          "Whole grain bread",
          "Avocado",
          "Tomato",
          "Salt",
          "Pepper",
        ],
        cookTime: "10 min",
        calories: 320,
        image: "/api/placeholder/300/200",
      },
    ];

    res.json({
      success: true,
      meals: suggestions,
      plannedMeals: [], // Empty for now, can be populated with user's planned meals
    });
  } catch (err) {
    console.error("Error fetching meal suggestions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add meal to plan (mock implementation)
app.post("/api/meals/plan", (req, res) => {
  const { date, mealType, mealName } = req.body;
  console.log(`Adding meal plan: ${mealName} for ${mealType} on ${date}`);

  res.json({
    success: true,
    message: "Meal added to plan successfully",
  });
});

// Remove meal from plan (mock implementation)
app.delete("/api/meals/plan/:date/:mealType", (req, res) => {
  const { date, mealType } = req.params;
  console.log(`Removing meal plan for ${mealType} on ${date}`);

  res.json({
    success: true,
    message: "Meal removed from plan successfully",
  });
});

// Eco Rewards API endpoints
app.get("/api/eco/rewards", (req, res) => {
  try {
    // Mock eco rewards data
    const ecoData = {
      success: true,
      data: {
        userEcoPoints: 150,
        level: "Eco Warrior",
        nextLevelPoints: 200,
        impact: {
          co2Saved: 3.0,
          plasticSaved: 18,
          treesProtected: 2,
          energySaved: 45,
        },
        rewards: [
          {
            id: 1,
            title: "$5 Store Credit",
            description: "Get $5 off your next purchase",
            pointsCost: 100,
            icon: "💰",
            category: "discounts",
          },
          {
            id: 2,
            title: "Free Reusable Bag",
            description: "High-quality eco-friendly shopping bag",
            pointsCost: 75,
            icon: "🛍️",
            category: "eco-products",
          },
          {
            id: 3,
            title: "Plant a Tree",
            description: "We'll plant a tree in your name",
            pointsCost: 200,
            icon: "🌳",
            category: "environmental",
          },
        ],
      },
    };

    res.json(ecoData);
  } catch (err) {
    console.error("Error fetching eco rewards:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Redeem eco reward (mock implementation)
app.post("/api/eco/redeem", (req, res) => {
  try {
    const { rewardId, pointsCost } = req.body;
    console.log(`Redeeming reward ${rewardId} for ${pointsCost} points`);

    // Mock redemption logic
    res.json({
      success: true,
      message: "Reward redeemed successfully!",
      newEcoPoints: 150 - pointsCost, // Mock calculation
    });
  } catch (err) {
    console.error("Error redeeming reward:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// User profile endpoints
app.get("/api/users/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Getting user profile for: ${userId}`);

    // Mock user profile data
    const userProfile = {
      success: true,
      profile: {
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
        budgetLimit: 150,
        ecoPoints: 120,
        savingsGoal: 50,
        totalSpent: 45.67,
      },
    };

    res.json(userProfile);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update user profile
app.put("/api/users/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    console.log(`Updating user profile for: ${userId}`, updateData);

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        id: userId,
        ...updateData,
      },
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/test`);
  console.log(`🛒 Add to cart URL: http://localhost:${PORT}/api/cart/add`);
});
