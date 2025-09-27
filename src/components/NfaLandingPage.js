import React from 'react';
import { useNavigate } from 'react-router-dom';

const NfaLandingPage = () => {
  const navigate = useNavigate();

  const handleShowHistory = () => {
    navigate('/nfa-history');
  };

  const handleCreateNew = () => {
    navigate('/nfa-form');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg p-2">
                <img 
                  src="/rv logo.jpeg" 
                  alt="RV University Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RV University</h1>
                <p className="text-sm text-gray-600">Note For Approval System</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <span className="text-4xl">📝</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Note For Approval</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your NFA requests and track their approval status. Choose an option below to get started.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Show History Button */}
          <div
            onClick={handleShowHistory}
            className="bg-white rounded-2xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Show History</h3>
              <p className="text-gray-600 mb-6">
                View all your previous NFA requests with filtering and search capabilities
              </p>
              <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                <span>View History</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Create New NFA Button */}
          <div
            onClick={handleCreateNew}
            className="bg-white rounded-2xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Create New NFA</h3>
              <p className="text-gray-600 mb-6">
                Generate a new Note For Approval document with our automated system
              </p>
              <div className="flex items-center justify-center text-green-600 font-semibold group-hover:text-green-700">
                <span>Create NFA</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 RV University. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NfaLandingPage;
