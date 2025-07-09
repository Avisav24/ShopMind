import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../services/api";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ShoppingCart,
  PieChart,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Edit,
  Save,
} from "lucide-react";

const BudgetEstimator = () => {
  const [budgetData, setBudgetData] = useState({
    monthlyBudget: 400,
    currentSpent: 0,
    weeklyGoal: 100,
    categoryBudgets: {
      groceries: { budget: 200, spent: 0 },
      household: { budget: 80, spent: 0 },
      personal: { budget: 60, spent: 0 },
      health: { budget: 60, spent: 0 },
    },
  });

  const [savingsGoal, setSavingsGoal] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(400);

  const remainingBudget = budgetData.monthlyBudget - budgetData.currentSpent;
  const budgetUsagePercent =
    (budgetData.currentSpent / budgetData.monthlyBudget) * 100;
  const projectedSpending =
    budgetData.currentSpent * (30 / new Date().getDate());

  // Fetch real-time data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch cart data to calculate current spending
      const cartData = await apiService.getCart();
      const currentSpent =
        cartData.items?.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ) || 0;

      // Fetch user profile for future personalization
      await apiService.getUserProfile(1);

      // Update budget data with real spending
      setBudgetData((prev) => ({
        ...prev,
        currentSpent,
        categoryBudgets: {
          ...prev.categoryBudgets,
          groceries: {
            ...prev.categoryBudgets.groceries,
            spent: currentSpent * 0.6,
          },
          household: {
            ...prev.categoryBudgets.household,
            spent: currentSpent * 0.2,
          },
          personal: {
            ...prev.categoryBudgets.personal,
            spent: currentSpent * 0.15,
          },
          health: {
            ...prev.categoryBudgets.health,
            spent: currentSpent * 0.05,
          },
        },
      }));
    } catch (err) {
      console.error("Error fetching budget data:", err);
      setError("Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (newBudget) => {
    try {
      // In a real app, this would update the user's budget in the backend
      setBudgetData((prev) => ({ ...prev, monthlyBudget: newBudget }));
      setEditingBudget(false);

      // Update category budgets proportionally
      setBudgetData((prev) => ({
        ...prev,
        monthlyBudget: newBudget,
        weeklyGoal: newBudget / 4,
        categoryBudgets: {
          groceries: {
            ...prev.categoryBudgets.groceries,
            budget: Math.round(newBudget * 0.5),
          },
          household: {
            ...prev.categoryBudgets.household,
            budget: Math.round(newBudget * 0.2),
          },
          personal: {
            ...prev.categoryBudgets.personal,
            budget: Math.round(newBudget * 0.15),
          },
          health: {
            ...prev.categoryBudgets.health,
            budget: Math.round(newBudget * 0.15),
          },
        },
      }));
    } catch (err) {
      console.error("Error updating budget:", err);
    }
  };

  const handleBudgetEdit = () => {
    setTempBudget(budgetData.monthlyBudget);
    setEditingBudget(true);
  };

  const handleBudgetSave = () => {
    updateBudget(tempBudget);
  };

  const handleBudgetCancel = () => {
    setEditingBudget(false);
    setTempBudget(budgetData.monthlyBudget);
  };

  const budgetTips = [
    {
      icon: Target,
      title: "Set Realistic Goals",
      description:
        "Aim for 80% of your budget to allow for unexpected purchases",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Calendar,
      title: "Weekly Planning",
      description: "Break down your monthly budget into weekly spending limits",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: PieChart,
      title: "Category Tracking",
      description:
        "Monitor spending across different categories for better control",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: TrendingUp,
      title: "Smart Shopping",
      description: "Use ShopMind's AI recommendations to find the best deals",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const monthlyHistory = [
    { month: "Jan", budget: 400, spent: 378, saved: 22 },
    { month: "Feb", budget: 400, spent: 412, saved: -12 },
    { month: "Mar", budget: 400, spent: 356, saved: 44 },
    { month: "Apr", budget: 400, spent: 389, saved: 11 },
    { month: "May", budget: 400, spent: 345, saved: 55 },
    {
      month: "Jun",
      budget: budgetData.monthlyBudget,
      spent: budgetData.currentSpent,
      saved: budgetData.monthlyBudget - budgetData.currentSpent,
    },
  ];

  useEffect(() => {
    fetchData();

    // Set up real-time updates
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Add loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-walmart-blue animate-spin" />
          <span className="ml-2 text-lg text-gray-600">
            Loading budget data...
          </span>
        </div>
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calculator className="w-8 h-8 text-walmart-blue mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Budget Estimator
            </h1>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center bg-walmart-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        <p className="text-gray-600">
          Track your spending, set goals, and optimize your shopping budget with
          AI insights
        </p>
      </div>

      {/* Current Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Current Budget
              </h3>
            </div>
            <div className="flex items-center">
              {editingBudget ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(Number(e.target.value))}
                    className="w-20 text-right text-xl font-bold border rounded px-2 py-1"
                  />
                  <button
                    onClick={handleBudgetSave}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleBudgetCancel}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    ${budgetData.monthlyBudget}
                  </span>
                  <button
                    onClick={handleBudgetEdit}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Spent so far</span>
              <span className="font-medium">
                ${budgetData.currentSpent.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span
                className={`font-medium ${
                  remainingBudget > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${remainingBudget.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  budgetUsagePercent > 90
                    ? "bg-red-500"
                    : budgetUsagePercent > 75
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Projected Total
              </h3>
            </div>
            <span
              className={`text-2xl font-bold ${
                projectedSpending > budgetData.monthlyBudget
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              ${projectedSpending.toFixed(2)}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">vs Budget</span>
              <span
                className={`font-medium ${
                  projectedSpending > budgetData.monthlyBudget
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {projectedSpending > budgetData.monthlyBudget ? "+" : "-"}$
                {Math.abs(projectedSpending - budgetData.monthlyBudget).toFixed(
                  2
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Days remaining</span>
              <span className="font-medium">{30 - new Date().getDate()}</span>
            </div>
            {projectedSpending > budgetData.monthlyBudget && (
              <div className="flex items-center text-sm text-red-600 mt-2">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span>Over budget projection</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Target className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Savings Goal
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                ${savingsGoal}
              </div>
              <div className="text-sm text-gray-600">
                {budgetUsagePercent < 80 ? (
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    On track
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    At risk
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">
              Monthly savings target
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Status Alert */}
      {budgetUsagePercent > 90 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h4 className="font-semibold text-red-800">Budget Alert</h4>
          </div>
          <p className="text-red-700 mt-1">
            You've used {budgetUsagePercent.toFixed(0)}% of your monthly budget.
            Consider reviewing your spending.
          </p>
        </div>
      )}

      {budgetUsagePercent < 50 && new Date().getDate() > 15 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-green-800">Great Job!</h4>
          </div>
          <p className="text-green-700 mt-1">
            You're on track with your budget. Keep up the good spending habits!
          </p>
        </div>
      )}

      {/* Spending by Category */}

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Spending by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(budgetData.categoryBudgets).map(
            ([category, data]) => {
              const percentage = (data.spent / data.budget) * 100;
              return (
                <div key={category} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {category}
                    </h3>
                    <span className="text-sm text-gray-600">
                      ${data.spent.toFixed(2)}/${data.budget}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage > 90
                          ? "bg-red-500"
                          : percentage > 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span
                      className={
                        percentage > 100 ? "text-red-600" : "text-green-600"
                      }
                    >
                      ${(data.budget - data.spent).toFixed(2)} left
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Budget Tips */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Smart Budgeting Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetTips.map((tip, index) => (
            <div key={index} className={`${tip.bgColor} rounded-lg p-4`}>
              <div className="flex items-start">
                <tip.icon
                  className={`w-6 h-6 ${tip.color} mr-3 mt-1 flex-shrink-0`}
                />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly History Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Monthly Spending History
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {monthlyHistory.map((month, index) => (
            <div key={index} className="text-center">
              <div className="relative h-32 bg-gray-100 rounded-lg mb-2 flex items-end justify-center">
                <div
                  className="bg-blue-500 rounded-t w-8 transition-all"
                  style={{ height: `${(month.spent / month.budget) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {month.month}
              </div>
              <div className="text-xs text-gray-600">${month.spent}</div>
              <div
                className={`text-xs font-medium ${
                  month.saved >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {month.saved >= 0 ? "+" : ""}${month.saved}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-walmart-blue to-blue-600 rounded-xl text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Take Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/cart"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 mb-2" />
            <h3 className="font-semibold mb-1">View Cart</h3>
            <p className="text-sm text-blue-100">
              Check your current items and total
            </p>
          </Link>

          <Link
            to="/meal-planner"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <Calendar className="w-6 h-6 mb-2" />
            <h3 className="font-semibold mb-1">Plan Meals</h3>
            <p className="text-sm text-blue-100">
              Budget-friendly meal planning
            </p>
          </Link>

          <Link
            to="/"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <TrendingUp className="w-6 h-6 mb-2" />
            <h3 className="font-semibold mb-1">Smart Shopping</h3>
            <p className="text-sm text-blue-100">
              AI recommendations to save money
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BudgetEstimator;
