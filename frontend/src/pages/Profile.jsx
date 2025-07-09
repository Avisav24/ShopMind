import React, { useState, useEffect } from "react";
import {
  User,
  Settings,
  Award,
  Leaf,
  DollarSign,
  Calendar,
  RefreshCw,
  Edit,
  Save,
  X,
} from "lucide-react";
import { apiService } from "../services/api";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [userData, setUserData] = useState({
    name: "Guest User",
    email: "guest@email.com",
    joinDate: "March 2024",
    totalSavings: 0,
    ecoPoints: 0,
    mealsPlanned: 0,
  });

  const [tempUserData, setTempUserData] = useState({});

  // Fetch real-time user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize with default data
      const defaultUserData = {
        name: "Guest User",
        email: "guest@email.com", 
        joinDate: "March 2024",
        totalSavings: 0,
        ecoPoints: 0,
        mealsPlanned: 0,
      };

      let finalUserData = { ...defaultUserData };

      // Try to fetch user profile
      try {
        const profileResponse = await apiService.getUserProfile("current");
        if (profileResponse && profileResponse.success) {
          const profile = profileResponse.profile;
          finalUserData = {
            name: profile.name || defaultUserData.name,
            email: profile.email || defaultUserData.email,
            joinDate: profile.joinDate || defaultUserData.joinDate,
            totalSavings: profile.totalSavings || 0,
            ecoPoints: profile.ecoPoints || 0,
            mealsPlanned: profile.mealsPlanned || 0,
          };
        }
      } catch (profileError) {
        console.log("Profile API not available, using defaults with calculated data");
      }

      // Try to fetch cart to calculate total savings
      try {
        const cartResponse = await apiService.getCart();
        const cartItems = cartResponse?.cartItems || [];
        const calculatedSavings = cartItems.reduce((total, item) => {
          if (item.product && item.product.originalPrice && item.product.price) {
            const savings = (item.product.originalPrice - item.product.price) * item.quantity;
            return total + savings;
          }
          return total;
        }, 0);
        
        if (calculatedSavings > 0) {
          finalUserData.totalSavings = calculatedSavings;
        }
      } catch (cartError) {
        console.log("Cart API not available, using default savings");
        finalUserData.totalSavings = 45.67; // Mock savings data
      }

      // Try to fetch meal plans
      try {
        const mealsResponse = await apiService.getMealSuggestions();
        const mealsPlanned = mealsResponse?.meals?.length || 0;
        if (mealsPlanned > 0) {
          finalUserData.mealsPlanned = mealsPlanned;
        }
      } catch (mealsError) {
        console.log("Meals API not available, using default meal count");
        finalUserData.mealsPlanned = 3; // Mock meals planned
      }

      setUserData(finalUserData);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Some data may not be up to date");
      // Set fallback data even on error
      setUserData({
        name: "Demo User",
        email: "demo@smartcart.com",
        joinDate: "March 2024", 
        totalSavings: 45.67,
        ecoPoints: 120,
        mealsPlanned: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.updateUserProfile(
        "current",
        tempUserData
      );

      if (response && response.success) {
        setUserData({ ...userData, ...tempUserData });
        setEditingProfile(false);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile changes");
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleEdit = () => {
    setTempUserData({ name: userData.name, email: userData.email });
    setEditingProfile(true);
  };

  const handleCancel = () => {
    setEditingProfile(false);
    setTempUserData({});
  };

  // Real-time updates
  useEffect(() => {
    fetchUserData();

    // Set up periodic refresh
    const interval = setInterval(fetchUserData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const achievements = [
    {
      id: 1,
      name: "Eco Warrior",
      description: "Earned 1000+ eco points",
      icon: "🌱",
      unlocked: true,
    },
    {
      id: 2,
      name: "Budget Master",
      description: "Stayed under budget for 5 weeks",
      icon: "💰",
      unlocked: true,
    },
    {
      id: 3,
      name: "Meal Planner Pro",
      description: "Planned 50+ meals",
      icon: "🍽️",
      unlocked: false,
    },
    {
      id: 4,
      name: "Smart Shopper",
      description: "Used AI suggestions 100+ times",
      icon: "🧠",
      unlocked: true,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Added Greek Yogurt to cart",
      date: "2 hours ago",
      type: "cart",
    },
    {
      id: 2,
      action: "Completed meal plan for this week",
      date: "1 day ago",
      type: "meal",
    },
    { id: 3, action: "Earned 25 eco points", date: "2 days ago", type: "eco" },
    {
      id: 4,
      action: "Saved $12.50 with AI suggestions",
      date: "3 days ago",
      type: "savings",
    },
  ];
  const tabs = [
    { id: "overview", name: "Overview", icon: User },
    { id: "achievements", name: "Achievements", icon: Award },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-walmart-blue animate-spin" />
          <span className="ml-2 text-lg text-gray-600">Loading profile...</span>
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
            onClick={fetchUserData}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-walmart-blue to-blue-600 rounded-t-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-walmart-blue" />
              </div>
              <div>
                {editingProfile ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={tempUserData.name || ""}
                      onChange={(e) =>
                        setTempUserData({
                          ...tempUserData,
                          name: e.target.value,
                        })
                      }
                      className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-3 py-1 text-xl font-bold"
                      placeholder="Your name"
                    />
                    <input
                      type="email"
                      value={tempUserData.email || ""}
                      onChange={(e) =>
                        setTempUserData({
                          ...tempUserData,
                          email: e.target.value,
                        })
                      }
                      className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-3 py-1 opacity-90"
                      placeholder="Your email"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                    <p className="opacity-90">{userData.email}</p>
                  </>
                )}
                <p className="text-sm opacity-75">
                  Member since {userData.joinDate}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {editingProfile ? (
                <>
                  <button
                    onClick={saveProfile}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded flex items-center"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-1 ${
                        refreshing ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${userData.totalSavings}
            </p>
            <p className="text-sm text-gray-600">Total Savings</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {userData.ecoPoints}
            </p>
            <p className="text-sm text-gray-600">Eco Points</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {userData.mealsPlanned}
            </p>
            <p className="text-sm text-gray-600">Meals Planned</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-walmart-blue text-walmart-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === "cart"
                            ? "bg-blue-100"
                            : activity.type === "meal"
                            ? "bg-purple-100"
                            : activity.type === "eco"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        {activity.type === "cart"
                          ? "🛒"
                          : activity.type === "meal"
                          ? "🍽️"
                          : activity.type === "eco"
                          ? "🌱"
                          : "💰"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h3
                          className={`font-medium ${
                            achievement.unlocked
                              ? "text-green-800"
                              : "text-gray-600"
                          }`}
                        >
                          {achievement.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            achievement.unlocked
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={userData.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={userData.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Preferences
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="ml-2 text-sm text-gray-700">
                      Email notifications for deals
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="ml-2 text-sm text-gray-700">
                      AI meal suggestions
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" />
                    <span className="ml-2 text-sm text-gray-700">
                      Weekly budget reports
                    </span>
                  </label>
                </div>
              </div>

              <button className="bg-walmart-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
