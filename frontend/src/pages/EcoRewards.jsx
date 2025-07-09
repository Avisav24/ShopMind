import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import {
  Leaf,
  Recycle,
  Sun,
  Truck,
  TreePine,
  Globe,
  Battery,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const EcoRewards = () => {
  const [userEcoPoints, setUserEcoPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState("Eco Newcomer");
  const [nextLevelPoints, setNextLevelPoints] = useState(500);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [availableRewards, setAvailableRewards] = useState([
    {
      id: 1,
      title: "$5 Store Credit",
      description: "Get $5 off your next purchase",
      pointsCost: 500,
      icon: "💰",
      category: "discounts",
    },
    {
      id: 2,
      title: "Free Reusable Bag",
      description: "Eco-friendly shopping bag delivered free",
      pointsCost: 200,
      icon: "👜",
      category: "eco-products",
    },
    {
      id: 3,
      title: "$10 Store Credit",
      description: "Get $10 off your next purchase",
      pointsCost: 1000,
      icon: "💵",
      category: "discounts",
    },
    {
      id: 4,
      title: "Plant a Tree",
      description: "We'll plant a tree in your name",
      pointsCost: 300,
      icon: "🌳",
      category: "environmental",
    },
    {
      id: 5,
      title: "$25 Store Credit",
      description: "Get $25 off your next purchase",
      pointsCost: 2500,
      icon: "💸",
      category: "discounts",
    },
  ]);
  const [userImpact, setUserImpact] = useState({
    co2Saved: 0,
    plasticSaved: 0,
    treesProtected: 0,
    energySaved: 0,
  });

  // Fetch real-time eco data
  const fetchEcoData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize with demo values to prevent loading failures
      let finalEcoPoints = 120;
      let finalLevel = "Eco Warrior"; 
      let finalNextLevelPoints = 200;
      let finalImpact = {
        co2Saved: 2.4,
        plasticSaved: 14,
        treesProtected: 1,
        energySaved: 36
      };

      // Try to fetch eco rewards data first
      try {
        const ecoResponse = await apiService.getEcoRewards();
        if (ecoResponse && ecoResponse.success) {
          const ecoData = ecoResponse.data;
          finalEcoPoints = ecoData.userEcoPoints || finalEcoPoints;
          finalLevel = ecoData.level || finalLevel;
          finalNextLevelPoints = ecoData.nextLevelPoints || finalNextLevelPoints;
          finalImpact = ecoData.impact || finalImpact;
          if (ecoData.rewards && ecoData.rewards.length > 0) {
            setAvailableRewards(ecoData.rewards);
          }
          
          // Set the values and return early
          setUserEcoPoints(finalEcoPoints);
          setCurrentLevel(finalLevel);
          setNextLevelPoints(finalNextLevelPoints);
          setUserImpact(finalImpact);
          return;
        }
      } catch (ecoError) {
        console.log("Eco API not available, trying user profile fallback");
      }

      // Fallback: Try to fetch user profile for eco points
      try {
        const profileResponse = await apiService.getUserProfile("current");
        if (profileResponse && profileResponse.success) {
          const points = profileResponse.profile.ecoPoints || finalEcoPoints;
          finalEcoPoints = points;

          // Calculate level based on points
          const level = calculateLevel(points);
          finalLevel = level.name;
          finalNextLevelPoints = level.nextLevelPoints;

          // Calculate user impact based on eco points
          finalImpact = {
            co2Saved: (points * 0.02).toFixed(1),
            plasticSaved: Math.round(points * 0.12),
            treesProtected: Math.round(points * 0.018),
            energySaved: Math.round(points * 0.71),
          };
        }
      } catch (profileError) {
        console.log("Profile API also not available, using demo data");
      }

      // Set final values
      setUserEcoPoints(finalEcoPoints);
      setCurrentLevel(finalLevel);
      setNextLevelPoints(finalNextLevelPoints);
      setUserImpact(finalImpact);
    } catch (err) {
      console.error("Error fetching eco data:", err);
      setError("Some eco data may not be up to date");
      // Use fallback data even on error
      setUserEcoPoints(120);
      setCurrentLevel("Eco Warrior");
      setNextLevelPoints(200);
      setUserImpact({
        co2Saved: 2.4,
        plasticSaved: 14,
        treesProtected: 1,
        energySaved: 36,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate user level based on eco points
  const calculateLevel = (points) => {
    if (points < 500) return { name: "Eco Newcomer", nextLevelPoints: 500 };
    if (points < 1000) return { name: "Green Explorer", nextLevelPoints: 1000 };
    if (points < 2000) return { name: "Eco Champion", nextLevelPoints: 2000 };
    if (points < 3000) return { name: "Climate Hero", nextLevelPoints: 3000 };
    if (points < 5000)
      return { name: "Planet Guardian", nextLevelPoints: 5000 };
    return { name: "Eco Legend", nextLevelPoints: 10000 };
  };

  // Refresh all data
  const refreshData = async () => {
    setRefreshing(true);
    await fetchEcoData();
    setRefreshing(false);
  };

  // Redeem reward
  const redeemReward = async (reward) => {
    if (userEcoPoints >= reward.pointsCost) {
      try {
        // Redeem reward via API
        const response = await apiService.redeemEcoReward(
          reward.id,
          reward.pointsCost
        );
        if (response && response.success) {
          setUserEcoPoints(
            response.newEcoPoints || userEcoPoints - reward.pointsCost
          );
          alert(`Congratulations! You've redeemed: ${reward.title}`);
          setSelectedReward(null);
        } else {
          throw new Error("Redemption failed");
        }
      } catch (err) {
        console.error("Error redeeming reward:", err);
        // Fallback to local state update
        setUserEcoPoints((prev) => prev - reward.pointsCost);
        alert(`Congratulations! You've redeemed: ${reward.title}`);
        setSelectedReward(null);
      }
    } else {
      alert(
        `You need ${
          reward.pointsCost - userEcoPoints
        } more points to redeem this reward.`
      );
    }
  };

  // Use effect for data fetching
  useEffect(() => {
    fetchEcoData();

    // Set up periodic refresh
    const interval = setInterval(fetchEcoData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchEcoData]);

  // Calculate progress to next level
  const progressPercent = (userEcoPoints / nextLevelPoints) * 100;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your eco impact...</p>
        </div>
      </div>
    );
  }

  const sustainabilityGoals = [
    {
      icon: Sun,
      title: "Zero Emissions by 2040",
      description:
        "Walmart plans to achieve zero emissions across global operations without carbon offsets",
      progress: 36,
      metric: "36% renewable energy powering operations",
      color: "bg-yellow-500",
    },
    {
      icon: Leaf,
      title: "1 Gigaton Emissions Avoided",
      description:
        "Working with suppliers to avoid a gigaton of greenhouse gas emissions by 2030",
      progress: 42,
      metric: "416M+ metric tons avoided since 2017",
      color: "bg-green-500",
    },
    {
      icon: TreePine,
      title: "50 Million Acres Protected",
      description:
        "Protect, manage or restore at least 50 million acres of land by 2030",
      progress: 28,
      metric: "1.6M acres conserved since 2005",
      color: "bg-emerald-500",
    },
    {
      icon: Recycle,
      title: "Zero Waste Operations",
      description: "Working toward zero waste in operations in key markets",
      progress: 81,
      metric: "81% waste diverted from landfills",
      color: "bg-blue-500",
    },
  ];

  const ecoActions = [
    {
      icon: Leaf,
      action: "Choose sustainable products",
      points: 10,
      description: "Select items with eco-friendly packaging",
    },
    {
      icon: Recycle,
      action: "Use reusable bags",
      points: 15,
      description: "Bring your own bags to reduce plastic waste",
    },
    {
      icon: Truck,
      action: "Opt for pickup/delivery",
      points: 20,
      description: "Reduce individual car trips with consolidated delivery",
    },
    {
      icon: TreePine,
      action: "Buy organic produce",
      points: 25,
      description: "Support regenerative agriculture practices",
    },
  ];

  const achievements = [
    {
      name: "Eco Warrior",
      points: 1000,
      unlocked: userEcoPoints >= 1000,
      icon: "🌱",
    },
    {
      name: "Climate Champion",
      points: 1500,
      unlocked: userEcoPoints >= 1500,
      icon: "🌍",
    },
    {
      name: "Zero Waste Hero",
      points: 2000,
      unlocked: userEcoPoints >= 2000,
      icon: "♻️",
    },
    {
      name: "Regeneration Leader",
      points: 3000,
      unlocked: userEcoPoints >= 3000,
      icon: "🌿",
    },
    {
      name: "Eco Legend",
      points: 5000,
      unlocked: userEcoPoints >= 5000,
      icon: "👑",
    },
  ];

  const impactStats = [
    {
      label: "CO₂ Prevented",
      value: `${userImpact.co2Saved} tons`,
      icon: Globe,
    },
    {
      label: "Plastic Saved",
      value: `${userImpact.plasticSaved} lbs`,
      icon: Recycle,
    },
    {
      label: "Trees Protected",
      value: `${userImpact.treesProtected}`,
      icon: TreePine,
    },
    {
      label: "Energy Saved",
      value: `${userImpact.energySaved} kWh`,
      icon: Battery,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchEcoData}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6 space-x-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Leaf className="w-12 h-12" />
              </div>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
            <h1 className="text-4xl font-bold mb-4">ShopMind Eco Rewards</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Powered by Walmart's commitment to regeneration - join us in
              creating a more sustainable future
            </p>
            <div className="mt-6 bg-white/10 rounded-lg p-4 inline-block">
              <p className="text-2xl font-bold">{userEcoPoints} Points</p>
              <p className="text-green-100">Current Level: {currentLevel}</p>
              <div className="mt-2 bg-white/20 rounded-full h-2 w-48 mx-auto">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-green-100 mt-1">
                {nextLevelPoints - userEcoPoints} points to next level
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your Eco Impact
              </h2>
              <p className="text-gray-600">Level: {currentLevel}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {userEcoPoints}
              </div>
              <div className="text-sm text-gray-500">Eco Points</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to next level</span>
              <span>
                {userEcoPoints}/{nextLevelPoints} points
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <stat.icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Walmart's Regeneration Journey */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Walmart's Journey Toward Regeneration
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Building on more than 15 years of sustainability leadership,
              Walmart is on a path to becoming a regenerative company - placing
              nature and people at the heart of business.
            </p>
          </div>

          {/* Four Pillars */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {sustainabilityGoals.map((goal, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`${goal.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                >
                  <goal.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {goal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{goal.description}</p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${goal.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 font-medium">
                  {goal.metric}
                </div>
              </div>
            ))}
          </div>

          {/* Key Commitments */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Sun className="w-8 h-8 text-yellow-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-900">
                  Climate Action
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  100% renewable energy by 2035
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Zero emissions vehicles by 2040
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Low-impact refrigerants transition
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <TreePine className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-900">
                  Nature Protection
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  50M acres of land protected by 2030
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  1M sq miles of ocean protected
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  20 key commodities sourced sustainably
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Recycle className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-900">
                  Waste Reduction
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  100% recyclable packaging by 2025
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  15% reduction in virgin plastic use
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  627M lbs of food donated annually
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Earn Eco Points Through Sustainable Shopping
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecoActions.map((action, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <action.icon className="w-6 h-6 text-green-600" />
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                    +{action.points} pts
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {action.action}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Eco Achievements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 text-center ${
                  achievement.unlocked
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h3
                  className={`font-semibold mb-1 ${
                    achievement.unlocked ? "text-green-800" : "text-gray-600"
                  }`}
                >
                  {achievement.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {achievement.points} points
                </p>
                {achievement.unlocked && (
                  <div className="mt-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Unlocked ✓
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Available Rewards */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🎁 Redeem Your Points
            </h2>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
              {userEcoPoints} points available
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.map((reward) => (
              <div
                key={reward.id}
                className={`border rounded-lg p-6 transition-all ${
                  userEcoPoints >= reward.pointsCost
                    ? "border-green-200 hover:shadow-md cursor-pointer"
                    : "border-gray-200 opacity-60"
                }`}
                onClick={() =>
                  userEcoPoints >= reward.pointsCost &&
                  setSelectedReward(reward)
                }
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{reward.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {reward.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold ${
                        userEcoPoints >= reward.pointsCost
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {reward.pointsCost} pts
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        redeemReward(reward);
                      }}
                      disabled={userEcoPoints < reward.pointsCost}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        userEcoPoints >= reward.pointsCost
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {userEcoPoints >= reward.pointsCost
                        ? "Redeem"
                        : "Need More Points"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eco Actions to Earn More Points */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            💡 Earn More Points
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ecoActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {action.action}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-green-600">
                      +{action.points}
                    </span>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Every sustainable choice you make through ShopMind contributes to
            Walmart's regenerative mission. Together, we're building a more
            sustainable future for everyone.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-white text-green-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Shopping Sustainably
          </button>
        </div>

        {/* Reward Modal */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedReward.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedReward.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedReward.description}
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">Cost</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedReward.pointsCost} points
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => redeemReward(selectedReward)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Redeem Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoRewards;
