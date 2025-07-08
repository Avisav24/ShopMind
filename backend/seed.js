require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/product");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleProducts = [
  {
    name: "Organic Bananas",
    price: 2.99,
    category: "fruits",
    isSustainable: true,
    ecoScore: 85,
  },
  {
    name: "Greek Yogurt",
    price: 4.99,
    category: "dairy",
    isSustainable: true,
    ecoScore: 75,
  },
  {
    name: "Whole Grain Bread",
    price: 3.49,
    category: "bakery",
    isSustainable: true,
    ecoScore: 70,
  },
  {
    name: "Almond Milk",
    price: 3.99,
    category: "dairy",
    isSustainable: true,
    ecoScore: 80,
  },
  {
    name: "Organic Chicken Breast",
    price: 12.99,
    category: "meat",
    isSustainable: true,
    ecoScore: 65,
  },
  {
    name: "Brown Rice",
    price: 2.49,
    category: "grains",
    isSustainable: true,
    ecoScore: 90,
  },
  {
    name: "Fresh Spinach",
    price: 2.99,
    category: "vegetables",
    isSustainable: true,
    ecoScore: 95,
  },
  {
    name: "Quinoa",
    price: 5.99,
    category: "grains",
    isSustainable: true,
    ecoScore: 88,
  },
];

async function seedDatabase() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log("Sample products inserted successfully");

    // Verify insertion
    const count = await Product.countDocuments();
    console.log(`Total products in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
