import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getattemptedData } from '../../redux/attemptedDataSlice';
import { fetchUserTestSeriesRankSlice } from '../../redux/HomeSlice';

const AttemptedTestPage = () => {
  const [activeTab, setActiveTab] = useState('Test');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [test, setTest] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const fetchAttemptedData = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getattemptedData()).unwrap();
     
      setTest(res); // No need to filter, API structure is different now
    } catch (error) {
      console.error('Error fetching attempted data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttemptedData();
  }, []);

  // ✅ Parse date from new format "24-09-2025 12:11"
  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      // Format: "24-09-2025 12:11" -> "2025-09-24 12:11"
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-');
      const isoString = `${year}-${month}-${day}T${timePart}:00`;
      return new Date(isoString);
    } catch (error) {
      console.error('Date parsing error:', error);
      return null;
    }
  };

  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAttemptedDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return 'Attempted on Invalid Date';
    
    return `Attempted on ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })}`;
  };

  const calculateTotalQuestions = (testData) => {
    return (testData.total_attend_question || 0) + (testData.total_not_answer_question || 0);
  };

  const getRank = (testData) => {
    // Use actual rank data from API
    return `${testData.my_rank}/${testData.total_users} Rank`;
  };

  // Navigation handlers updated for new data structure
  const handleSolutionClick = (testData) => {
    if (!testData.test_id) {
      alert('Error: Test ID is missing');
      return;
    }

    navigate('/test-solutions', { 
      state: {
        testData: {
          my_detail: {
            test_id: testData.test_id
          },
          test_detail: {
            title: testData.test_title || 'Untitled Test'
          }
        },
        state: {
          testData: {
            my_detail: {
              test_id: testData.test_id
            }
          }
        }
      }
    });
  };

   // ✅ New function to fetch detailed analysis data
  const fetchAnalysisData = async (testId) => {
    try {
      setAnalysisLoading(true);
      const res = await dispatch(fetchUserTestSeriesRankSlice(testId)).unwrap();
      
      if (res.status_code === 200) {
        return res.data;
      } else {
        throw new Error('Failed to fetch analysis data');
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      throw error;
    } finally {
      setAnalysisLoading(false);
    }
  };


  // const handleAnalysisClick = (testData) => {
  //   if (!testData.test_id) {
  //     alert('Error: Test ID is missing');
  //     return;
  //   }

  //   navigate('/analysis', { 
  //     state: {
  //       testData: {
  //         my_detail: {
  //           test_id: testData.test_id
  //         },
  //         test_detail: {
  //           title: testData.test_title || 'Untitled Test'
  //         }
  //       },
  //       state: {
  //         testData: {
  //           my_detail: {
  //             test_id: testData.test_id
  //           }
  //         }
  //       }
  //     }
  //   });
  // };

  const handleAnalysisClick = async (testData) => {
    if (!testData.test_id) {
      alert('Error: Test ID is missing');
      return;
    }

    try {
      // ✅ Fetch complete analysis data first
      const analysisData = await fetchAnalysisData(testData.test_id);
      
      // ✅ Navigate with complete data structure that Screen6 expects
      navigate('/analysis', { 
        state: {
          // ✅ Complete data structure matching Screen6's expectations
          testInfo: {
            test_id: testData.test_id,
            id: testData.test_id
          },
          // ✅ Include the fetched analysis data directly
          preloadedData: analysisData,
          // ✅ Flag to indicate data is already loaded
          isDataPreloaded: true
        }
      });
    } catch (error) {
      console.error('Failed to load analysis data:', error);
      alert('Failed to load analysis data. Please try again.');
    }
  };
  
  const handleReattemptClick = (testData) => {
    if (!testData.test_id) {
      alert('Error: Test ID is missing');
      return;
    }
    
    navigate(`/test/${testData.test_id}`, { 
      state: { 
        testData: testData,
        isReattempt: true
      } 
    });
  };

  // Fixed date grouping for new date format
  const groupTestsByDate = (tests) => {
    const sortedTests = [...tests].sort((a, b) => {
      const dateA = parseDate(a.attended_at);
      const dateB = parseDate(b.attended_at);
      return dateB - dateA; // Most recent first
    });
    
    const grouped = {};
    const dateOrder = [];
    
    sortedTests.forEach(testData => {
      const dateKey = formatDate(testData.attended_at);
      
      // Skip invalid dates
      if (dateKey === 'Invalid Date') {
        console.warn('Skipping test with invalid date:', testData);
        return;
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
        dateOrder.push(dateKey);
      }
      grouped[dateKey].push(testData);
    });
    
    return { grouped, dateOrder };
  };

  const filters = [
    'SSC CGL',
    'Railways RRB NTPC', 
    'SSC STENOGRAPHER',
    'SSC CHSL',
    'SSC MTS'
  ];

  const toggleFilter = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const { grouped: groupedTests, dateOrder } = test.length > 0 ? groupTestsByDate(test) : { grouped: {}, dateOrder: [] };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your Attempted Tests & Quizzes
          </h1>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('Test')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'Test'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Test
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Focus+ Banner */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 mb-6 text-white relative overflow-hidden">
              <div className="absolute top-1 left-4">
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-[10px] font-medium">
                  NEW
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-xl font-bold mr-2">Revision24</span>
                    <span className="bg-yellow-600 text-black px-2 py-1 rounded text-xs font-medium">
                      Focus+
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">
                    All-in-One Pass for All Your Tests
                  </h2>

                  <div className="text-sm">
                    <p className="mb-2 font-medium">Which Includes</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        All Test Series
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Prev. Year Papers
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Practice
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Pro Live Tests
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Unlimited Test Reattempts
                      </span>
                    </div>
                  </div>
                </div>

                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium">
                  Get Focus+
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading tests...</span>
              </div>
            )}

            {/* Test Cards */}
            {!loading && (
              <div className="space-y-6">
                {dateOrder.map((date) => (
                  <div key={date}>
                    {/* Date Header */}
                    {date !== 'Invalid Date' && (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {date}
                        </h3>

                        {/* Tests for this date */}
                        <div className="space-y-4">
                          {groupedTests[date]
                            .sort((a, b) => {
                              const dateA = parseDate(a.attended_at);
                              const dateB = parseDate(b.attended_at);
                              return dateB - dateA; // Most recent first
                            })
                            .map((testData) => (
                              <div key={`${testData.test_id}-${testData.attended_at}`} className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    {/* PRO badge - you can add logic to determine this */}
                                    {testData.test_title.includes('Full Test') && (
                                      <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium mb-3">
                                        PRO
                                      </span>
                                    )}

                                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                                      {testData.test_title}
                                    </h4>

                                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                                      <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                        </svg>
                                        {getRank(testData)}
                                      </span>
                                      <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {testData.marks}/{calculateTotalQuestions(testData)} Marks
                                      </span>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                      {formatAttemptedDate(testData.attended_at)}
                                    </p>

                                    {/* Test Stats */}
                                    <div className="mt-3 text-xs text-gray-500 space-y-1">
                                      <div>
                                        Correct: {testData.correct} | 
                                        Incorrect: {testData.in_correct} | 
                                        Unattempted: {testData.total_not_answer_question}
                                      </div>
                                      <div>Status: {testData.status}</div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 ml-4">
                                    <button 
                                      className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
                                      onClick={() => handleSolutionClick(testData)}
                                    >
                                      Solution
                                    </button>
                                    <button 
                                      className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
                                      onClick={() => handleAnalysisClick(testData)}
                                    >
                                      Analysis
                                    </button>
                                    <button 
                                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center transition-colors"
                                      onClick={() => handleReattemptClick(testData)}
                                    >
                                      Reattempt
                                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* No tests message */}
                {!loading && test.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No attempted tests found</h3>
                    <p className="text-gray-500">Start taking tests to see your progress here</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80">
            {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

              <div className="space-y-3">
                {filters.map((filter) => (
                  <label key={filter} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedFilters.includes(filter)}
                      onChange={() => toggleFilter(filter)}
                    />
                    <span className="ml-3 text-sm text-gray-700">{filter}</span>
                  </label>
                ))}
              </div>

              <button className="text-blue-500 text-sm mt-4 hover:text-blue-600">
                +10 more Exams
              </button>
            </div> */}

            {/* Live Indicators */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium">LIVE</span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center text-blue-500">
                  <span className="mr-2">📊</span>
                  <span>QUIZZES</span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="mr-2">📝</span>
                  <span>TESTS</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <span className="mr-2">📚</span>
                  <span>CLASSES</span>
                </div>
              </div>
            </div>

            {/* Test Statistics Summary */}
            {!loading && test.length > 0 && (
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tests:</span>
                    <span className="font-medium">{test.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Tests:</span>
                    <span className="font-medium">{test.filter(t => t.test_title.includes('Full Test')).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chapter Tests:</span>
                    <span className="font-medium">{test.filter(t => t.test_title.includes('Chapter Test')).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Score:</span>
                    <span className="font-medium">
                      {test.length > 0 ? Math.round(test.reduce((acc, t) => acc + t.marks, 0) / test.length) : 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptedTestPage;
