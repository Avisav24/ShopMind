import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { apiService } from "../services/api";
import {
  ChevronLeft,
  ChevronRight,
  Brain,
  DollarSign,
  Leaf,
  Calendar,
} from "lucide-react";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Using CartContext would be better, but for simplicity we'll keep local state
  const [, setCartItems] = useState([]); // Only using the setter
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default suggestions as fallback, using useMemo to avoid recreating on every render
  const defaultSuggestions = useMemo(
    () => [
      {
        id: 1,
        name: "Organic Bananas",
        price: 2.99,
        originalPrice: 3.49,
        discount: 15,
        image: "/images/products/product-1-bananas.svg",
        rating: 4.5,
        reviews: 234,
        ecoPoints: 15,
      },
      {
        id: 2,
        name: "Greek Yogurt",
        price: 4.99,
        originalPrice: 5.99,
        discount: 17,
        image: "/images/products/product-2-yogurt.svg",
        rating: 4.8,
        reviews: 156,
        ecoPoints: 20,
      },
      {
        id: 3,
        name: "Whole Grain Bread",
        price: 3.49,
        originalPrice: 3.99,
        discount: 13,
        image: "/images/products/product-3-bread.svg",
        rating: 4.2,
        reviews: 89,
        ecoPoints: 12,
      },
      {
        id: 4,
        name: "Almond Milk",
        price: 3.99,
        originalPrice: 4.99,
        discount: 20,
        image: "/images/products/product-4-almond-milk.svg",
        rating: 4.4,
        reviews: 142,
        ecoPoints: 18,
      },
    ],
    []
  );

  const billEstimate = 127.45;
  const ecoPoints = 1250;
  const weeklyMeals = 5;

  // Fetch recommendations from API
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await apiService.getRecommendations();
        console.log("API Response:", response); // Debug log
        if (response.success && response.recommendations) {
          // Transform API recommendations to match UI format
          const formattedSuggestions = response.recommendations.map(
            (rec, index) => ({
              id: rec.product._id || index + 1,
              name: rec.product.name,
              price: rec.product.price,
              originalPrice: rec.product.price * 1.2, // 20% markup for original price
              discount: rec.product.discount || 10,
              image: rec.product.image || "/api/placeholder/300/200",
              rating: rec.product.rating || 4.5,
              reviews: rec.product.reviews || 100,
              ecoPoints: rec.product.ecoScore || 15,
              reason: rec.reason,
            })
          );
          console.log("🖼️ Debug: Image URLs in formatted suggestions:");
          formattedSuggestions.forEach(item => {
            console.log(`- ${item.name}: ${item.image}`);
          });
          console.log("Formatted suggestions:", formattedSuggestions); // Debug log
          setSuggestions(formattedSuggestions);
        } else {
          console.log("Using default suggestions");
          setSuggestions(defaultSuggestions);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations");
        setSuggestions(defaultSuggestions);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [defaultSuggestions]); // Added defaultSuggestions as a dependency

  const handleAddToCart = async (product) => {
    try {
      console.log("Adding product to cart:", product);

      // Ensure we're using the correct ID format
      // In our case, the API expects product._id, but our formatted suggestions use product.id
      const productId = product._id || product.id;

      console.log("Using product ID:", productId);
      const response = await apiService.addToCart(productId, 1);
      console.log("Add to cart response:", response);

      if (response.success) {
        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === productId);
          if (existing) {
            return prev.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...prev, { ...product, id: productId, quantity: 1 }];
        });

        // Show success message with product name
        alert(`${product.name} added to cart successfully!`);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % suggestions.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + suggestions.length) % suggestions.length
    );
  };

  useEffect(() => {
    if (suggestions.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % suggestions.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [suggestions.length]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-walmart-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading your personalized recommendations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Sarah! 👋
        </h1>
        <p className="text-gray-600">
          Here are your personalized recommendations for this week
        </p>
        {error && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error} - Showing default suggestions
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 card-hover">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Estimated Bill</p>
              <p className="text-2xl font-bold text-gray-900">
                ${billEstimate}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 card-hover">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Eco Points</p>
              <p className="text-2xl font-bold text-gray-900">{ecoPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 card-hover">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Planned Meals</p>
              <p className="text-2xl font-bold text-gray-900">
                {weeklyMeals}/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <Brain className="w-6 h-6 text-walmart-blue mr-2" />
          <h2 className="text-xl font-bold text-gray-900">
            🧠 AI Personalized Suggestions
          </h2>
        </div>

        {suggestions.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {suggestions.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0 px-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex justify-center mt-4 space-x-2">
          {suggestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-walmart-blue" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🍽️ Meal Planner</h3>
          <p className="mb-4">
            Plan your weekly meals and get smart shopping lists
          </p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Plan Meals
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">♻️ Eco Rewards</h3>
          <p className="mb-4">Earn points for sustainable shopping choices</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            View Rewards
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
