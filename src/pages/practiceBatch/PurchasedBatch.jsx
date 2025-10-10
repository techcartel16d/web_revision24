import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getpracticeBatchData, clearError } from '../../redux/practiceBatchDataSlice';

const PurchasedBatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from Redux store
  const { 
    batches: allBatches = [], 
    loading = false, 
    error = null 
  } = useSelector((state) => {
    console.log('PurchasedBatch Redux State:', state.practiceBatch);
    return state.practiceBatch || {};
  });
  
  const [filter, setFilter] = useState('all'); // all, active, expired
  
  // ✅ Filter only purchased batches (is_purchased === 'yes')
  const purchasedBatches = allBatches.filter(batch => batch.is_purchased === 'yes');
  
  // ✅ Map API data to expected format with mock progress data
  const batches = purchasedBatches.map(batch => ({
    ...batch,
    // Add missing fields with mock data since API doesn't provide these
    purchased_at: batch.created_at || new Date().toISOString(),
    expires_at: getExpiryDate(batch.start_date, batch.duration),
    progress: Math.floor(Math.random() * 100), // Mock progress - replace with actual
    total_videos: Math.floor(Math.random() * 50) + 10, // Mock total videos
    watched_videos: Math.floor(Math.random() * 30), // Mock watched videos
    last_watched: new Date().toISOString() // Mock last watched
  }));
  
  // Helper function to calculate expiry date
  function getExpiryDate(startDate, duration) {
    const start = new Date(startDate);
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + parseInt(duration));
    return expiry.toISOString();
  }
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        if (clearError) dispatch(clearError());
        console.log('Fetching practice batch data...');
        await dispatch(getpracticeBatchData()).unwrap();
      } catch (err) {
        console.error('Error fetching practice batches:', err);
      }
    };

    fetchBatches();
  }, [dispatch]);

  const handleBatchClick = (batch) => {
    if (batch.status === 'active') {
      navigate(`/batch-videos/${batch.slug}`, { 
        state: { 
          batch,
          playlistId: batch.playlist_id 
        } 
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBatches = batches.filter(batch => {
    if (filter === 'all') return true;
    if (filter === 'active') return batch.status === 'active';
    if (filter === 'expired') return batch.status === 'inactive' || getDaysRemaining(batch.expires_at) <= 0;
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your batches...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Batches</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Purchased Batches</h1>
              <p className="text-gray-600 mt-1">
                Track your progress and continue learning from your purchased courses
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-medium">
                {batches.length} Total Batches
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info - Remove in production
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <strong>🔍 Debug Info:</strong>
          <br />• Total API batches: {allBatches.length}
          <br />• Purchased batches: {purchasedBatches.length}
          <br />• Showing: {filteredBatches.length} batches
        </div> */}

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { 
                key: 'all', 
                label: 'All Batches', 
                count: batches.length 
              },
              { 
                key: 'active', 
                label: 'Active', 
                count: batches.filter(b => b.status === 'active').length 
              },
              { 
                key: 'expired', 
                label: 'Expired', 
                count: batches.filter(b => b.status === 'inactive' || getDaysRemaining(b.expires_at) <= 0).length 
              }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Batches Grid */}
        {filteredBatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => handleBatchClick(batch)}
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={batch.image}
                    alt={batch.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Practice+Batch';
                    }}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(batch.status)}`}>
                      {batch.status === 'active' ? '✓ Active' : '⏰ Expired'}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3">
                    <div className="flex items-center justify-between text-white text-sm mb-1">
                      <span>Progress: {batch.progress}%</span>
                      <span>{batch.watched_videos}/{batch.total_videos} videos</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${batch.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-2">
                      {batch.title}
                    </h3>
                    <div className="text-right text-sm text-gray-500">
                      {formatAmount(batch.amount)}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {batch.description}
                  </p>

                  {/* Batch Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{batch.duration} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Purchased:</span>
                      <span className="font-medium">{formatDate(batch.purchased_at)}</span>
                    </div>
                    {batch.status === 'active' && (
                      <div className="flex justify-between">
                        <span>Expires in:</span>
                        <span className={`font-medium ${getDaysRemaining(batch.expires_at) < 30 ? 'text-red-600' : 'text-green-600'}`}>
                          {getDaysRemaining(batch.expires_at)} days
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Last watched:</span>
                      <span className="font-medium">{formatDate(batch.last_watched)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {batch.status === 'active' ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBatchClick(batch);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                          <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Continue Learning
                          </div>
                        </button>
                        {batch.progress < 100 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBatchClick(batch);
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                          >
                            <div className="flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                              </svg>
                              Resume from where you left
                            </div>
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-gray-600 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Batch Expired
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No Purchased Batches' : `No ${filter} Batches`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't purchased any batches yet. Browse our available courses to get started!" 
                : `You don't have any ${filter} batches.`
              }
            </p>
            {filter === 'all' && (
              <button 
                onClick={() => navigate('/all-batches')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Browse Available Batches
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Section */}
      {batches.length > 0 && (
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{batches.length}</p>
                    <p className="text-blue-600 font-medium">Total Batches</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {batches.filter(b => b.status === 'active').length}
                    </p>
                    <p className="text-green-600 font-medium">Active Batches</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {batches.reduce((sum, batch) => sum + batch.watched_videos, 0)}
                    </p>
                    <p className="text-purple-600 font-medium">Videos Watched</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {batches.length > 0 ? Math.round(batches.reduce((sum, batch) => sum + batch.progress, 0) / batches.length) : 0}%
                    </p>
                    <p className="text-yellow-600 font-medium">Avg. Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedBatch;
