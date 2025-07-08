const express = require("express");
const router = express.Router();
const recommendProducts = require("../utils/recommendation");
const Product = require("../models/product");
const mockProducts = require("../utils/mockData");
const fs = require("fs");
const path = require("path");

// GET /api/recommendations
router.get("/recommendations", async (req, res) => {
  try {
    // 1. Load user data from file (ensure correct path)
    const userFilePath = path.join(__dirname, "..", "user.json");
    const userData = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));

    // 2. Try to fetch products from MongoDB, fallback to mock data
    let productDB;
    try {
      productDB = await Product.find({}).lean();
      if (!productDB || productDB.length === 0) {
        throw new Error("No products found in database");
      }
    } catch (dbError) {
      console.log("Using mock data instead of database");
      productDB = mockProducts;
    }

    // 3. Call AI logic
    const recommendations = recommendProducts(
      userData.history || [],
      userData.cart || [],
      productDB
    );

    // 4. Send response
    res.json({ success: true, recommendations });
  } catch (err) {
    console.error("Detailed Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/products
router.get("/products", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query);
    res.json({ success: true, products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/cart/add
router.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Read current cart from user.json
    const userFilePath = path.join(__dirname, "..", "user.json");
    const userData = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));

    // Initialize cart as array of objects if it doesn't exist or is in old format
    if (!userData.cartItems || Array.isArray(userData.cart)) {
      userData.cartItems = [];
    }

    // Check if product already exists in cart
    const existingItemIndex = userData.cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      userData.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      userData.cartItems.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    // Save back to file
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));

    res.json({
      success: true,
      message: "Added to cart successfully",
      cartItems: userData.cartItems,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/cart
router.get("/cart", async (req, res) => {
  try {
    const userFilePath = path.join(__dirname, "..", "user.json");
    const userData = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));

    // Get cart items with product details
    const cartItems = userData.cartItems || [];

    // Get product details for each cart item
    let cartWithDetails = [];

    try {
      // Try to get from database first
      const productDB = await Product.find({}).lean();
      if (productDB && productDB.length > 0) {
        cartWithDetails = cartItems.map((cartItem) => {
          const product = productDB.find(
            (p) => p._id.toString() === cartItem.productId
          );
          return {
            ...cartItem,
            product: product || null,
          };
        });
      } else {
        throw new Error("No products in database");
      }
    } catch (dbError) {
      // Fallback to mock data
      cartWithDetails = cartItems.map((cartItem) => {
        const product = mockProducts.find((p) => p._id === cartItem.productId);
        return {
          ...cartItem,
          product: product || null,
        };
      });
    }

    res.json({
      success: true,
      cartItems: cartWithDetails.filter((item) => item.product !== null),
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/meals/suggestions
router.get("/meals/suggestions", (req, res) => {
  try {
    // Mock meal suggestions for now
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
    ];

    res.json({ success: true, suggestions });
  } catch (err) {
    console.error("Error fetching meal suggestions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
