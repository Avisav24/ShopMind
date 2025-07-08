require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const apiRoutes = require("./routes/api");

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend server is working!" });
});

// Routes
app.use("/api", apiRoutes);

// Database connection
require("./database/mongo");

const PORT = process.env.PORT || 5000; // Use port 5000 for backend
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
