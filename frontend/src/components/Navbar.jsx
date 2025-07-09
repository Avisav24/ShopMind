import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  Calendar,
  Leaf,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const cartItems = 3; // Mock cart count

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-walmart-blue rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">ShopMind</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/meal-planner"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/meal-planner")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Meal Planner</span>
            </Link>

            <Link
              to="/eco-rewards"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/eco-rewards")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue"
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>Eco Rewards</span>
            </Link>

            <Link
              to="/cart"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                isActive("/cart")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/profile")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-walmart-blue"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/meal-planner"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/meal-planner")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Meal Planner
            </Link>
            <Link
              to="/eco-rewards"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/eco-rewards")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Eco Rewards
            </Link>
            <Link
              to="/cart"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/cart")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Cart ({cartItems})
            </Link>
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/profile")
                  ? "text-walmart-blue bg-blue-50"
                  : "text-gray-700 hover:text-walmart-blue hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
