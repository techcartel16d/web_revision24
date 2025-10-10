import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getpracticeBatchData, clearError, purchasePracticeBatchSlice, clearPurchaseState } from '../../redux/practiceBatchDataSlice';
import { getUserToken, isAuthenticated } from '../../utils/auth';
import { checkoutpaySlice } from '../../redux/HomeSlice';


const PracticeBatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    batches = [], 
    loading = false, 
    error = null, 
    message = null,
    purchasing = false,
    purchaseError = null,
    purchaseSuccess = false
  } = useSelector((state) => {
    console.log('Full Redux State:', state);
    console.log('Practice Batch State:', state.practiceBatch);
    return state.practiceBatch || {};
  });
  
  const [localError, setLocalError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [processingPurchase, setProcessingPurchase] = useState(null);

   // Fetch practice batches on component mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLocalError(null);
        if (clearError) dispatch(clearError());
        console.log('Dispatching getpracticeBatchData...');
        const result = await dispatch(getpracticeBatchData()).unwrap();
        console.log('API Response:', result);
      } catch (err) {
        console.error('Error fetching practice batches:', err);
        setLocalError(err.message || 'Failed to fetch practice batches');
      }
    };

    fetchBatches();
  }, [dispatch]);
  
   useEffect(() => {
      const checkAuth = async () => {
        const result = await isAuthenticated();
        setIsAuth(result);
      };
      checkAuth();
    }, []);
  

  // ✅ ADDED: Cashfree SDK loading (like your SubscriptionPlans)
  useEffect(() => {
     // Dynamically load Cashfree SDK
     const script = document.createElement('script');
     script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
     script.async = true;
     document.head.appendChild(script);
 
     return () => {
       if (document.head.contains(script)) {
         document.head.removeChild(script);
       }
     };
   }, []);

    const purchasePracticeBatch = async (item) => {
         if (item.is_purchased === 'yes') {
            navigate(`/purchased-batch`, { 
                state: { 
                item,
                playlistId: item.playlist_id 
                } 
            });
        }else{

            const planData = {
                amount: item.amount,
                practice_batch_id: parseInt(item.id),
            };
            console.log('planData', planData)
      
        try {
          const res = await dispatch(purchasePracticeBatchSlice(planData)).unwrap();
          console.log("checkout payment res", res)
          if (window.Cashfree) {
            const cashfree = window.Cashfree({ mode: "production" });
            cashfree.checkout({
              paymentSessionId: res.payment_session_id,
              redirectTarget: "_self",
            redirectUrl: "/cashfree-payment",
            });
          }
        } catch (error) {
          console.error("Checkout error", error);
        }

        }
     
  };


  
 



  const handleRetry = () => {
    setLocalError(null);
    if (clearError) dispatch(clearError());
    dispatch(getpracticeBatchData());
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const formatDuration = (duration) => {
    const dur = parseInt(duration);
    return `${dur} ${dur === 1 ? 'Month' : 'Months'}`;
  };

  // Loading state
  if (loading && (!batches || batches.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading practice batches...</p>
        </div>
      </div>
    );
  }

  // Error state
  if ((error || localError) && (!batches || batches.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-4">
            {localError || error || 'Unable to load practice batches'}
          </p>
          <button 
            onClick={handleRetry}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ ENHANCED DEBUG: Added Cashfree debug info */}
        {/* <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <strong>🔍 Enhanced Debug Info:</strong> 
          <div className="mt-2 grid grid-cols-1 gap-2 text-xs">
            <div>
              <strong>Authentication State:</strong>
              <br />• isAuthenticated: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {isAuthenticated ? 'Yes' : 'No'}
              </span>
              <br />• localStorage Token: <span className={localStorage.getItem('token') ? 'text-green-600' : 'text-red-600'}>
                {localStorage.getItem('token') ? 'Present' : 'Missing'}
              </span>
              <br />• localStorage Token Length: {localStorage.getItem('token')?.length || 0}
            </div>
            <div>
              <strong>Cashfree SDK:</strong>
              <br />• SDK Available: <span className={window.Cashfree ? 'text-green-600' : 'text-red-600'}>
                {window.Cashfree ? 'Yes' : 'No'}
              </span>
              <br />• SDK Type: {typeof window.Cashfree}
            </div>
            <div>
              <strong>Debug Actions:</strong>
              <button 
                onClick={async () => {
                  const token = await getUserToken();
                  console.log('Manual token check:', token);
                  alert(`Token: ${token ? 'Found' : 'Not found'}`);
                }}
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
              >
                Check Token
              </button>
              <button 
                onClick={() => {
                  setIsAuthenticated(!isAuthenticated);
                  console.log('Toggled isAuthenticated to:', !isAuthenticated);
                }}
                className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs"
              >
                Toggle Auth
              </button>
              <button 
                onClick={debugCashfree}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Debug Cashfree
              </button>
            </div>
          </div>
        </div> */}

        {/* Header Section with My Courses Button */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Practice Batches
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Choose from our comprehensive practice batches designed to help you excel in your exams
            </p>
          </div>
          
          {/* My Courses Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
            <button
              onClick={() => navigate('/purchased-batch')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              My Courses
            </button>
            
            <button
              onClick={handleRetry}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        {batches && batches.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-blue-600">{batches.length}</div>
                <div className="text-sm text-gray-600">Total Batches</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-green-600">
                  {batches.filter(b => b.is_purchased === 'yes').length}
                </div>
                <div className="text-sm text-gray-600">Purchased</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-orange-600">
                  {batches.filter(b => b.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Batches</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-purple-600">
                  {batches.filter(b => b.is_purchased === 'no' && b.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Success/Error Notifications */}
        {purchaseSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Purchase successful! Redirecting to payment...
            </div>
          </div>
        )}

        {purchaseError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {purchaseError}
            </div>
          </div>
        )}

        {/* Authentication Warning */}
        {!isAuth && (
          <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Please <button onClick={() => navigate('/login')} className="underline font-semibold">login</button> to purchase batches.
            </div>
          </div>
        )}

        {/* Batches Grid */}
        {batches && batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={batch.image}
                    alt={batch.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Practice+Batch';
                    }}
                  />
                  
                  {/* Status badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {batch.is_purchased === 'yes' && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Purchased
                      </div>
                    )}
                    {batch.status === 'active' && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                    {formatDuration(batch.duration)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 mr-4">
                      {batch.title}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatAmount(batch.amount)}
                      </div>
                      {batch.is_purchased === 'no' && (
                        <div className="text-sm text-gray-500">one-time</div>
                      )}
                    </div>
                  </div>

                  {batch.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {batch.description}
                    </p>
                  )}

                  {/* Features/Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDuration(batch.duration)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {batch.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  {/* Action Button with Payment Integration */}
                  <button
                    onClick={() => purchasePracticeBatch(batch)}
                    disabled={
                      batch.status !== 'active' || 
                      processingPurchase === batch.id
                    }
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      batch.status !== 'active' 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : processingPurchase === batch.id
                          ? 'bg-yellow-600 text-white cursor-not-allowed'
                          : batch.is_purchased === 'yes'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {batch.status !== 'active' ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                        Currently Inactive
                      </div>
                    ) : processingPurchase === batch.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </div>
                    ) : batch.is_purchased === 'yes' ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Access Videos
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Purchase Now
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Practice Batches Available</h3>
            <p className="text-gray-600 mb-6">New batches will be available soon. Check back later!</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleRetry}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button 
                onClick={() => navigate('/purchased-batch')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                View My Courses
              </button>
            </div>
          </div>
        )}

        {/* Quick Navigation Card */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Ready to continue learning?</h2>
              <p className="text-blue-100">
                Access your purchased courses and track your progress
              </p>
            </div>
            <button
              onClick={() => navigate('/purchased-batch')}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Go to My Courses
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose Our Practice Batches?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Learn from experienced instructors with proven track records</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Practice</h3>
              <p className="text-gray-600">Extensive question banks and mock tests for thorough preparation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Schedule</h3>
              <p className="text-gray-600">Study at your own pace with 24/7 access to materials</p>
            </div>
          </div>
        </div>

        {/* Additional CTA for non-authenticated users */}
        {!isAuth && (
          <div className="mt-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-xl mb-6 text-red-100">
                Create an account or login to access our premium practice batches
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Login Now
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-red-500 text-white hover:bg-red-400 font-semibold py-3 px-8 rounded-lg transition-all duration-200 border-2 border-white"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeBatch;
