import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
  const [cartItems, setCartItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plannedMeals, setPlannedMeals] = useState([]);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [userName, setUserName] = useState("Guest");

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
      {
        id: 5,
        name: "Organic Spinach",
        price: 2.49,
        originalPrice: 2.99,
        discount: 17,
        image: "/images/products/product-5-spinach.svg",
        rating: 4.6,
        reviews: 198,
        ecoPoints: 22,
      },
      {
        id: 6,
        name: "Wild Salmon Fillet",
        price: 12.99,
        originalPrice: 15.99,
        discount: 19,
        image: "/images/products/product-6-salmon.svg",
        rating: 4.7,
        reviews: 167,
        ecoPoints: 25,
      },
      {
        id: 7,
        name: "Quinoa",
        price: 5.49,
        originalPrice: 6.99,
        discount: 21,
        image: "/images/products/product-7-quinoa.svg",
        rating: 4.3,
        reviews: 124,
        ecoPoints: 20,
      },
      {
        id: 8,
        name: "Avocados (3 pack)",
        price: 4.49,
        originalPrice: 5.49,
        discount: 18,
        image: "/images/products/product-8-avocado.svg",
        rating: 4.5,
        reviews: 203,
        ecoPoints: 16,
      },
      {
        id: 9,
        name: "Organic Chicken Breast",
        price: 8.99,
        originalPrice: 10.99,
        discount: 18,
        image: "/images/products/product-9-chicken.svg",
        rating: 4.4,
        reviews: 178,
        ecoPoints: 14,
      },
      {
        id: 10,
        name: "Sweet Potatoes",
        price: 1.99,
        originalPrice: 2.49,
        discount: 20,
        image: "/images/products/product-10-sweet-potato.svg",
        rating: 4.6,
        reviews: 145,
        ecoPoints: 18,
      },
      {
        id: 11,
        name: "Organic Blueberries",
        price: 5.99,
        originalPrice: 7.49,
        discount: 20,
        image: "/images/products/product-11-blueberries.svg",
        rating: 4.8,
        reviews: 189,
        ecoPoints: 24,
      },
      {
        id: 12,
        name: "Brown Rice",
        price: 3.99,
        originalPrice: 4.99,
        discount: 20,
        image: "/images/products/product-12-brown-rice.svg",
        rating: 4.3,
        reviews: 134,
        ecoPoints: 15,
      },
    ],
    []
  );

  // Calculate dynamic values based on real data
  const billEstimate = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate planned meals dynamically
  const weeklyMealsCount = plannedMeals.length;
  const totalWeeklyMeals = 21; // 3 meals per day × 7 days

  // Fetch all real-time data from API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        try {
          const profileResponse = await apiService.getUserProfile("current");
          if (profileResponse && profileResponse.success) {
            setUserName(profileResponse.profile.name || "Guest");
            setEcoPoints(profileResponse.profile.ecoPoints || 0);
          }
        } catch (profileError) {
          console.log("Using guest profile");
          setUserName("Guest");
          setEcoPoints(0);
        }

        // Fetch recommendations
        const response = await apiService.getRecommendations();
        console.log("API Response:", response);
        if (response.success && response.recommendations) {
          const formattedSuggestions = response.recommendations.map(
            (rec, index) => ({
              id: rec.product._id || index + 1,
              name: rec.product.name,
              price: rec.product.price,
              originalPrice: rec.product.price * 1.2,
              discount: rec.product.discount || 10,
              image: rec.product.image || "/api/placeholder/300/200",
              rating: rec.product.rating || 4.5,
              reviews: rec.product.reviews || 100,
              ecoPoints: rec.product.ecoScore || 15,
              reason: rec.reason,
            })
          );
          console.log("Formatted suggestions:", formattedSuggestions);
          setSuggestions(formattedSuggestions);
        } else {
          console.log("Using default suggestions");
          setSuggestions(defaultSuggestions);
        }

        // Fetch cart items
        try {
          const cartResponse = await apiService.getCart();
          console.log("Cart API response:", cartResponse);

          if (
            cartResponse &&
            cartResponse.success &&
            cartResponse.cartItems &&
            Array.isArray(cartResponse.cartItems)
          ) {
            const validItems = cartResponse.cartItems.filter(
              (item) =>
                item && item.product && item.product.name && item.quantity
            );

            const formattedCartItems = validItems.map((item) => ({
              id: item.product._id || item.productId,
              name: item.product.name,
              price: item.product.price || 0,
              quantity: item.quantity || 1,
              image: item.product.image || "/api/placeholder/300/200",
            }));

            console.log("Formatted cart items:", formattedCartItems);
            setCartItems(formattedCartItems);
          } else {
            console.log("No cart items found");
            setCartItems([]);
          }
        } catch (cartError) {
          console.error("Error fetching cart:", cartError);
          setCartItems([]);
        }

        // Fetch meal plans
        try {
          const mealsResponse = await apiService.getMealSuggestions();
          if (mealsResponse && mealsResponse.success && mealsResponse.meals) {
            setPlannedMeals(mealsResponse.meals);
          } else {
            setPlannedMeals([]);
          }
        } catch (mealsError) {
          console.log("No meal plans found");
          setPlannedMeals([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setSuggestions(defaultSuggestions);
        setCartItems([]);
        setPlannedMeals([]);
        setEcoPoints(0);
        setUserName("Guest");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [defaultSuggestions]);

  const handleAddToCart = async (product) => {
    try {
      console.log("Adding product to cart:", product);
      const productId = product._id || product.id;

      console.log("Using product ID:", productId);
      const response = await apiService.addToCart(productId, 1);
      console.log("Add to cart response:", response);

      if (response.success) {
        // Update cart items immediately
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

        // Update eco points if product has eco score
        if (product.ecoPoints) {
          setEcoPoints((prev) => prev + product.ecoPoints);
        }

        // Show success message
        alert(`${product.name} added to cart successfully!`);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  // Function to refresh all data
  const refreshAllData = async () => {
    setLoading(true);
    try {
      // Re-fetch all data
      const [cartResponse, profileResponse, mealsResponse] = await Promise.all([
        apiService.getCart().catch(() => ({ success: false })),
        apiService.getUserProfile("current").catch(() => ({ success: false })),
        apiService.getMealSuggestions().catch(() => ({ success: false })),
      ]);

      // Update cart
      if (cartResponse.success && cartResponse.cartItems) {
        const formattedCartItems = cartResponse.cartItems
          .filter(
            (item) => item && item.product && item.product.name && item.quantity
          )
          .map((item) => ({
            id: item.product._id || item.productId,
            name: item.product.name,
            price: item.product.price || 0,
            quantity: item.quantity || 1,
            image: item.product.image || "/api/placeholder/300/200",
          }));
        setCartItems(formattedCartItems);
      }

      // Update profile
      if (profileResponse.success && profileResponse.profile) {
        setUserName(profileResponse.profile.name || "Guest");
        setEcoPoints(profileResponse.profile.ecoPoints || 0);
      }

      // Update meals
      if (mealsResponse.success && mealsResponse.meals) {
        setPlannedMeals(mealsResponse.meals);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
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
            Loading your personalized dashboard...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Fetching cart items, recommendations, and meal plans
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
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-gray-600">
          {suggestions.length > 0
            ? "Here are your personalized recommendations for this week"
            : "Start shopping to get personalized recommendations"}
        </p>
        {error && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error} - Showing default suggestions
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/budget-estimator" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 card-hover hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Estimated Bill</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${billEstimate.toFixed(2)}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {billEstimate > 0
                    ? "View budget details →"
                    : "Start shopping to see estimate →"}
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/eco-rewards" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 card-hover hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Eco Points</p>
                <p className="text-2xl font-bold text-gray-900">{ecoPoints}</p>
                <p className="text-xs text-green-600 font-medium">
                  Click to learn more →
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/meal-planner" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 card-hover hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Planned Meals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weeklyMealsCount}/{totalWeeklyMeals}
                </p>
                <p className="text-xs text-purple-600 font-medium">
                  {weeklyMealsCount > 0
                    ? "Plan your meals →"
                    : "Start planning meals →"}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <Brain className="w-6 h-6 text-walmart-blue mr-2" />
          <h2 className="text-xl font-bold text-gray-900">
            {suggestions.length > 0
              ? "Discounted Products!"
              : "🛒 Start Shopping for Recommendations"}
          </h2>
        </div>

        {suggestions.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Brain className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start shopping and add items to your cart to get personalized AI
              recommendations based on your preferences.
            </p>
            <button
              onClick={refreshAllData}
              className="bg-walmart-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Refresh Recommendations
            </button>
          </div>
        )}

        {suggestions.length > 0 && (
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
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🍽️ Meal Planner</h3>
          <p className="mb-4">
            {weeklyMealsCount > 0
              ? `You have ${weeklyMealsCount} meals planned this week. Plan more meals and get smart shopping lists!`
              : "Plan your weekly meals and get smart shopping lists"}
          </p>
          <Link to="/meal-planner">
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              onClick={refreshAllData}
            >
              {weeklyMealsCount > 0 ? "View Meal Plan" : "Start Planning"}
            </button>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">♻️ Eco Rewards</h3>
          <p className="mb-4">
            {ecoPoints > 0
              ? `You have ${ecoPoints} eco points! Keep earning points for sustainable shopping choices.`
              : "Start earning points for sustainable shopping choices"}
          </p>
          <Link to="/eco-rewards">
            <button
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              onClick={refreshAllData}
            >
              {ecoPoints > 0 ? "View Rewards" : "Start Earning"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
