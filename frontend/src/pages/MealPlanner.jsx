import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  ChefHat,
  ShoppingCart,
  RefreshCw,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { apiService } from "../services/api";

const MealPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plannedMealsCount, setPlannedMealsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [addingMeal, setAddingMeal] = useState(null); // { date, mealType }

  // Fetch real-time meal data
  const fetchMealData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Default data as fallback
      const defaultMeals = {
        "2025-06-23": {
          breakfast: "Oatmeal with berries",
          lunch: "Grilled chicken salad",
          dinner: "Salmon with vegetables",
        },
        "2025-06-24": {
          breakfast: "Greek yogurt parfait",
          lunch: "Turkey sandwich",
          dinner: "Pasta with marinara",
        },
      };

      const defaultSuggestions = [
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
          name: "Berry Smoothie Bowl",
          type: "breakfast",
          ingredients: [
            "Mixed berries",
            "Banana",
            "Greek yogurt",
            "Granola",
            "Honey",
          ],
          cookTime: "5 min",
          calories: 320,
          image: "/api/placeholder/300/200",
        },
        {
          id: 4,
          name: "Avocado Toast",
          type: "breakfast",
          ingredients: [
            "Whole grain bread",
            "Avocado",
            "Tomato",
            "Lime",
            "Salt",
          ],
          cookTime: "10 min",
          calories: 280,
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
            "Spices",
          ],
          cookTime: "30 min",
          calories: 350,
          image: "/api/placeholder/300/200",
        },
        {
          id: 6,
          name: "Grilled Fish Tacos",
          type: "dinner",
          ingredients: [
            "White fish",
            "Corn tortillas",
            "Cabbage",
            "Lime",
            "Cilantro",
          ],
          cookTime: "20 min",
          calories: 480,
          image: "/api/placeholder/300/200",
        },
      ];

      // Try to fetch meal suggestions from API
      try {
        const suggestionsResponse = await apiService.getMealSuggestions();
        if (suggestionsResponse && suggestionsResponse.success) {
          const apiMeals = suggestionsResponse.meals || [];
          if (apiMeals.length > 0) {
            setSuggestions(apiMeals);
          } else {
            setSuggestions(defaultSuggestions);
          }

          // Create a meals object from the API response
          const mealsObj = {};
          if (suggestionsResponse.plannedMeals) {
            suggestionsResponse.plannedMeals.forEach((meal) => {
              const date = meal.date;
              if (!mealsObj[date]) mealsObj[date] = {};
              mealsObj[date][meal.mealType] = meal.name;
            });
          }
          setMeals(mealsObj);
        } else {
          setSuggestions(defaultSuggestions);
        }
      } catch (mealsError) {
        console.log("Meals API not available, using default suggestions");
        setSuggestions(defaultSuggestions);
        setMeals(defaultMeals);
        setPlannedMealsCount(
          Object.keys(defaultMeals).reduce((count, date) => {
            return count + Object.keys(defaultMeals[date]).length;
          }, 0)
        );
      }
    } catch (err) {
      console.error("Error fetching meal data:", err);
      setError("Some meal data may not be up to date");
      // Use basic fallback data
      setSuggestions([]);
      setMeals({});
      setPlannedMealsCount(0);
      setMeals({});
    } finally {
      setLoading(false);
    }
  }, []);

  // Add meal to a specific date and meal type
  const addMealToPlan = async (date, mealType, mealName) => {
    try {
      const dateStr = formatDate(date);

      // Update local state immediately
      setMeals((prev) => ({
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          [mealType]: mealName,
        },
      }));

      setPlannedMealsCount((prev) => prev + 1);
      setAddingMeal(null);

      // In a real app, this would save to the backend
      // Add meal to plan via API
      await apiService.addMealToPlan(dateStr, mealType, mealName);
    } catch (err) {
      console.error("Error adding meal:", err);
      setError("Failed to add meal to plan");
    }
  };

  // Remove meal from plan
  const removeMealFromPlan = async (date, mealType) => {
    try {
      const dateStr = formatDate(date);

      setMeals((prev) => {
        const newMeals = { ...prev };
        if (newMeals[dateStr]) {
          delete newMeals[dateStr][mealType];
          if (Object.keys(newMeals[dateStr]).length === 0) {
            delete newMeals[dateStr];
          }
        }
        return newMeals;
      });

      setPlannedMealsCount((prev) => Math.max(0, prev - 1));

      // In a real app, this would remove from the backend
      // Remove meal from plan via API
      await apiService.removeMealFromPlan(dateStr, mealType);
    } catch (err) {
      console.error("Error removing meal:", err);
      setError("Failed to remove meal from plan");
    }
  };

  // Refresh all meal data
  const refreshData = async () => {
    setRefreshing(true);
    await fetchMealData();
    setRefreshing(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Enhanced add meal to cart function
  const addMealToCart = async (meal) => {
    try {
      // In a real app, this would add meal ingredients to cart via API
      console.log("Adding meal to cart:", meal);

      // Add ingredients to cart via API
      for (const ingredient of meal.ingredients) {
        await apiService.addToCart(ingredient, 1);
      }

      alert(`Added ${meal.name} ingredients to cart!`);
    } catch (err) {
      console.error("Error adding meal to cart:", err);
      alert("Failed to add ingredients to cart. Please try again.");
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initData = async () => {
      await fetchMealData();
    };

    initData();

    // Set up periodic refresh
    const interval = setInterval(fetchMealData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchMealData]);

  const days = getDaysInMonth(selectedDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-walmart-blue animate-spin" />
          <span className="ml-2 text-lg text-gray-600">
            Loading meal plans...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchMealData}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <ChefHat className="w-8 h-8 text-walmart-blue mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
            <p className="text-gray-600 mt-1">
              {plannedMealsCount} meals planned • Plan your week ahead for
              smarter shopping
            </p>
          </div>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center bg-walmart-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {monthNames[selectedDate.getMonth()]}{" "}
                {selectedDate.getFullYear()}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() - 1
                      )
                    )
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() + 1
                      )
                    )
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayMeals = day ? meals[formatDate(day)] : null;
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border rounded-lg ${
                      day
                        ? "bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                        : "bg-gray-50"
                    }`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <div className="font-medium text-sm text-gray-900 mb-2">
                          {day.getDate()}
                        </div>

                        {/* Meal slots */}
                        <div className="space-y-1">
                          {["breakfast", "lunch", "dinner"].map((mealType) => (
                            <div key={mealType} className="text-xs">
                              {dayMeals && dayMeals[mealType] ? (
                                <div className="flex items-center justify-between bg-blue-100 text-blue-800 rounded p-1">
                                  <span
                                    className="truncate flex-1"
                                    title={dayMeals[mealType]}
                                  >
                                    {dayMeals[mealType]}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeMealFromPlan(day, mealType);
                                    }}
                                    className="ml-1 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAddingMeal({ date: day, mealType });
                                  }}
                                  className="w-full text-left text-gray-400 hover:text-gray-600 p-1 rounded border-dashed border hover:bg-gray-50"
                                >
                                  + {mealType}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Quick add button for the day */}
                        {(!dayMeals || Object.keys(dayMeals).length < 3) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Auto-suggest next meal type
                              const nextMealType = !dayMeals
                                ? "breakfast"
                                : !dayMeals.breakfast
                                ? "breakfast"
                                : !dayMeals.lunch
                                ? "lunch"
                                : "dinner";
                              setAddingMeal({
                                date: day,
                                mealType: nextMealType,
                              });
                            }}
                            className="mt-1 w-full text-xs text-walmart-blue hover:text-blue-700 flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Meal
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Auto-plan a week of meals
                  const today = new Date();
                  for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    const mealTypes = ["breakfast", "lunch", "dinner"];
                    mealTypes.forEach((mealType, index) => {
                      const suggestion =
                        suggestions[
                          Math.floor(Math.random() * suggestions.length)
                        ];
                      if (suggestion) {
                        addMealToPlan(date, mealType, suggestion.name);
                      }
                    });
                  }
                }}
                className="w-full bg-walmart-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🎯 Auto-Plan This Week
              </button>
              <button
                onClick={() => {
                  // Clear all meals
                  setMeals({});
                  setPlannedMealsCount(0);
                }}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                🗑️ Clear All Meals
              </button>
              <button
                onClick={() => {
                  // Generate shopping list
                  const allMeals = Object.values(meals).flatMap((dayMeals) =>
                    Object.values(dayMeals)
                  );
                  alert(
                    `Shopping list generated for ${allMeals.length} meals!`
                  );
                }}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                📝 Generate Shopping List
              </button>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              🤖 AI Meal Suggestions
            </h2>

            <div className="space-y-4">
              {suggestions.map((meal) => (
                <div
                  key={meal.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />

                  <h3 className="font-medium text-gray-900 mb-2">
                    {meal.name}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                      {meal.type}
                    </span>
                    <span>{meal.cookTime}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {meal.calories} calories
                  </p>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      {meal.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                        >
                          {ingredient}
                        </span>
                      ))}
                      {meal.ingredients.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{meal.ingredients.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (addingMeal) {
                          addMealToPlan(
                            addingMeal.date,
                            addingMeal.mealType,
                            meal.name
                          );
                        } else {
                          // Quick add for today
                          const today = new Date();
                          const todayStr = formatDate(today);
                          const todayMeals = meals[todayStr] || {};
                          const nextMealType = !todayMeals.breakfast
                            ? "breakfast"
                            : !todayMeals.lunch
                            ? "lunch"
                            : "dinner";
                          addMealToPlan(today, nextMealType, meal.name);
                        }
                      }}
                      className="flex-1 bg-walmart-blue hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>
                        {addingMeal
                          ? `Add to ${addingMeal.mealType}`
                          : "Add to Plan"}
                      </span>
                    </button>

                    <button
                      onClick={() => addMealToCart(meal)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                      title="Add ingredients to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              📊 This Week's Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Planned Meals:</span>
                <span className="font-medium">{plannedMealsCount}/21</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Cost:</span>
                <span className="font-medium">
                  ${(plannedMealsCount * 12.5).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Calories/Day:</span>
                <span className="font-medium">
                  {Math.round((plannedMealsCount * 400) / 7)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                // Generate shopping list from all planned meals
                const allIngredients = [];
                Object.values(meals).forEach((dayMeals) => {
                  Object.values(dayMeals).forEach((mealName) => {
                    const meal = suggestions.find((s) => s.name === mealName);
                    if (meal) {
                      allIngredients.push(...meal.ingredients);
                    }
                  });
                });
                const uniqueIngredients = [...new Set(allIngredients)];
                alert(
                  `Shopping list generated with ${uniqueIngredients.length} unique ingredients!`
                );
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mt-4 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Generate Shopping List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Meal Selection Modal */}
      {addingMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Select {addingMeal.mealType} for{" "}
                  {addingMeal.date.toLocaleDateString()}
                </h3>
                <button
                  onClick={() => setAddingMeal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions
                  .filter(
                    (meal) =>
                      meal.type === addingMeal.mealType || meal.type === "any"
                  )
                  .map((meal) => (
                    <div
                      key={meal.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        addMealToPlan(
                          addingMeal.date,
                          addingMeal.mealType,
                          meal.name
                        );
                      }}
                    >
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-medium text-gray-900 mb-2">
                        {meal.name}
                      </h4>
                      <div className="text-sm text-gray-600 mb-2">
                        🕒 {meal.cookTime} • 🔥 {meal.calories} cal
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {meal.ingredients
                          .slice(0, 3)
                          .map((ingredient, index) => (
                            <span
                              key={index}
                              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                            >
                              {ingredient}
                            </span>
                          ))}
                      </div>
                      <button className="w-full bg-walmart-blue text-white py-2 rounded-lg hover:bg-blue-700">
                        Select This Meal
                      </button>
                    </div>
                  ))}
              </div>

              {/* Quick custom meal input */}
              <div className="mt-6 border-t pt-6">
                <h4 className="font-medium mb-3">Or enter a custom meal:</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter meal name..."
                    className="flex-1 border rounded-lg px-3 py-2"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        addMealToPlan(
                          addingMeal.date,
                          addingMeal.mealType,
                          e.target.value.trim()
                        );
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      if (input.value.trim()) {
                        addMealToPlan(
                          addingMeal.date,
                          addingMeal.mealType,
                          input.value.trim()
                        );
                        input.value = "";
                      }
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MealPlanner;
