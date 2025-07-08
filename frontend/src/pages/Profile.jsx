import React, { useState } from 'react';
import { User, Settings, Award, Leaf, DollarSign, Calendar } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const userData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    joinDate: 'March 2024',
    totalSavings: 234.50,
    ecoPoints: 1250,
    mealsPlanned: 47
  };
 
  const achievements = [
    { id: 1, name: 'Eco Warrior', description: 'Earned 1000+ eco points', icon: '🌱', unlocked: true },
    { id: 2, name: 'Budget Master', description: 'Stayed under budget for 5 weeks', icon: '💰', unlocked: true },
    { id: 3, name: 'Meal Planner Pro', description: 'Planned 50+ meals', icon: '🍽️', unlocked: false },
    { id: 4, name: 'Smart Shopper', description: 'Used AI suggestions 100+ times', icon: '🧠', unlocked: true }
  ];

  const recentActivity = [
    { id: 1, action: 'Added Greek Yogurt to cart', date: '2 hours ago', type: 'cart' },
    { id: 2, action: 'Completed meal plan for this week', date: '1 day ago', type: 'meal' },
    { id: 3, action: 'Earned 25 eco points', date: '2 days ago', type: 'eco' },
    { id: 4, action: 'Saved $12.50 with AI suggestions', date: '3 days ago', type: 'savings' }
  ];
 const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-walmart-blue to-blue-600 rounded-t-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-walmart-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="opacity-90">{userData.email}</p>
              <p className="text-sm opacity-75">Member since {userData.joinDate}</p>
            </div>
          </div>
        </div>


        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${userData.totalSavings}</p>
            <p className="text-sm text-gray-600">Total Savings</p>
          </div>
              <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{userData.ecoPoints}</p>
            <p className="text-sm text-gray-600">Eco Points</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{userData.mealsPlanned}</p>
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
                      ? 'border-walmart-blue text-walmart-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'cart' ? 'bg-blue-100' :
                        activity.type === 'meal' ? 'bg-purple-100' :
                        activity.type === 'eco' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {activity.type === 'cart' ? '🛒' :
                         activity.type === 'meal' ? '🍽️' :
                         activity.type === 'eco' ? '🌱' : '💰'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h3 className={`font-medium ${
                          achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${
                          achievement.unlocked ? 'text-green-600' : 'text-gray-500'
                        }`}>
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

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h2>
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="ml-2 text-sm text-gray-700">Email notifications for deals</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="ml-2 text-sm text-gray-700">AI meal suggestions</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" />
                    <span className="ml-2 text-sm text-gray-700">Weekly budget reports</span>
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
