import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MealPlanner from "./pages/MealPlanner";
import EcoRewards from "./pages/EcoRewards";
import BudgetEstimator from "./pages/BudgetEstimator";
import ImageTest from "./components/ImageTest";
import "./styles/index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/eco-rewards" element={<EcoRewards />} />
          <Route path="/budget-estimator" element={<BudgetEstimator />} />
          <Route path="/image-test" element={<ImageTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
