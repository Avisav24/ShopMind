import React, { useState } from "react";
import { Plus, ChefHat, ShoppingCart } from "lucide-react"; // Removed unused Calendar import

const MealPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Using a placeholder setter until meal editing is implemented
  const [meals] = useState({
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
  });

  const [suggestions] = useState([
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
  ]);

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

  const addMealToCart = (meal) => {
    // Logic to add meal ingredients to cart
    console.log("Adding meal to cart:", meal);
    alert(`Added ${meal.name} ingredients to cart!`);
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <ChefHat className="w-8 h-8 text-walmart-blue mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
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
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border rounded-lg ${
                    day
                      ? "bg-white hover:bg-gray-50 cursor-pointer"
                      : "bg-gray-50"
                  }`}
                >
                  {day && (
                    <>
                      <div className="font-medium text-sm text-gray-900 mb-1">
                        {day.getDate()}
                      </div>
                      {meals[formatDate(day)] && (
                        <div className="space-y-1">
                          {Object.entries(meals[formatDate(day)]).map(
                            ([mealType, meal]) => (
                              <div
                                key={mealType}
                                className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                                title={meal}
                              >
                                {meal}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
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
                    <button className="flex-1 bg-walmart-blue hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center space-x-1">
                      <Plus className="w-3 h-3" />
                      <span>Add to Plan</span>
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
                <span className="font-medium">5/21</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Cost:</span>
                <span className="font-medium">$87.50</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Calories/Day:</span>
                <span className="font-medium">1,850</span>
              </div>
            </div>

            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mt-4 flex items-center justify-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Generate Shopping List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MealPlanner;
