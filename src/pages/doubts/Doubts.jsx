import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaComment, FaEllipsisH, FaTimes, FaImage } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { 
  doubtSolutionData, 
  myDoubtSolutionData, 
  allDoubtSolutionData 
} from '../../redux/doubtSolutionSlice';

const Doubts = () => {
  const dispatch = useDispatch();
  
  // ✅ Redux state selectors with debugging
  const doubtSolutionState = useSelector((state) => state.doubtSolution || {});
  const { 
    allDoubts = [], 
    myDoubts = [], 
    loading = false, 
    error = null 
  } = doubtSolutionState;

  console.log('Redux State Debug:', {
    doubtSolutionState,
    allDoubts,
    myDoubts,
    loading,
    error
  });

  const [activeTab, setActiveTab] = useState('All Doubts');
  const [isAnswering, setIsAnswering] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isAskDoubtOpen, setIsAskDoubtOpen] = useState(false);
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = ['All Doubts', 'My Doubts'];

  // ✅ Enhanced fetch function with debugging
  const fetchDoubts = async () => {
    try {
      setRefreshing(true);
      console.log('Starting to fetch doubts...');
      
      // Dispatch both API calls simultaneously
      const [allDoubtsResult, myDoubtsResult] = await Promise.all([
        dispatch(allDoubtSolutionData()).unwrap(),
        dispatch(myDoubtSolutionData()).unwrap()
      ]);
      
      console.log('All Doubts API Result:', allDoubtsResult);
      console.log('My Doubts API Result:', myDoubtsResult);
      console.log('Doubts data fetched successfully');
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Fetch doubts on component mount
  useEffect(() => {
    fetchDoubts();
  }, [dispatch]);

  // ✅ Debug current doubts
  const getCurrentDoubts = () => {
    const currentDoubts = activeTab === 'All Doubts' ? allDoubts : myDoubts;
    console.log(`Current doubts for ${activeTab}:`, currentDoubts);
    return currentDoubts;
  };

  // ✅ Updated render doubt card with better data mapping
  const renderDoubtCard = (doubt) => {
    console.log('Rendering doubt card for:', doubt);
    
    return (
      <div key={doubt.id} className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {/* User Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {/* ✅ Handle both API response structures */}
              {(doubt.user?.profile || doubt.user_image) ? (
                <img 
                  src={doubt.user?.profile || doubt.user_image} 
                  alt={doubt.user?.name || doubt.user_name || 'User'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <span 
                className="text-gray-600 font-medium text-sm flex items-center justify-center w-full h-full"
                style={{ display: (doubt.user?.profile || doubt.user_image) ? 'none' : 'flex' }}
              >
                {(doubt.user?.name || doubt.user_name || doubt.username || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {doubt.user?.name || doubt.user_name || doubt.username || 'Anonymous'}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {doubt.category && <span className="px-2 py-1 bg-gray-100 rounded text-xs">{doubt.category}</span>}
                <span>{doubt.created_at || 'Recently'}</span>
                {/* ✅ Show status badge */}
                <span className={`px-2 py-1 rounded text-xs ${
                  doubt.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doubt.status === 'success' ? 'Answered' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            + Add to my doubts
          </button>
        </div>

        {/* Question */}
        <div className="mb-4">
          <p className="text-gray-800 mb-4 leading-relaxed">
            {doubt.text || doubt.question}
          </p>
          {doubt.image && (
            <div className="bg-gray-100 rounded-lg p-4">
              <img
                src={doubt.image}
                alt="Question"
                className="w-full max-w-2xl rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(doubt.image, '_blank')}
              />
            </div>
          )}
        </div>

        {/* ✅ Show solution if exists */}
        {doubt.solution && (
          <div className="mb-4 bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
            <div 
              className="text-gray-700" 
              dangerouslySetInnerHTML={{ __html: doubt.solution.text }}
            />
            {doubt.solution.image && (
              <div className="mt-3">
                <img
                  src={doubt.solution.image}
                  alt="Solution"
                  className="max-w-full h-auto rounded-lg cursor-pointer"
                  onClick={() => window.open(doubt.solution.image, '_blank')}
                />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <FaThumbsUp size={16} />
              <span className="text-sm font-medium">
                Upvote ({doubt.upvotes || doubt.likes || 0})
              </span>
            </button>
            <button 
              onClick={() => setIsAnswering(!isAnswering)}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <FaComment size={16} />
              <span className="text-sm font-medium">
                {doubt.solution ? '1' : '0'} Answer{doubt.solution ? '' : 's'}
              </span>
            </button>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FaEllipsisH size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Rest of your component code remains the same...
  // (handleImageUpload, removeImage, handleAskDoubtSubmit, etc.)

  // Image handling functions
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleAskDoubtSubmit = async () => {
    if (!doubtQuestion.trim()) {
      alert('Please enter your question');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('text', doubtQuestion.trim());
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      console.log('Submitting doubt:', {
        text: doubtQuestion.trim(),
        image: selectedImage ? selectedImage.name : 'No image'
      });

      const result = await dispatch(doubtSolutionData(formData)).unwrap();
      console.log('Doubt submitted successfully:', result);
      
      setDoubtQuestion('');
      setSelectedImage(null);
      setImagePreview(null);
      setIsAskDoubtOpen(false);
      
      await fetchDoubts();
      alert('Your doubt has been submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting doubt:', error);
      alert(error.message || 'Failed to submit doubt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerSubmit = () => {
    console.log('Answer submitted:', answer);
    setAnswer('');
    setIsAnswering(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between p-6">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      console.log(`Switching to tab: ${tab}`);
                      setActiveTab(tab);
                    }}
                    className={`pb-2 font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-cyan-500 border-b-2 border-cyan-500'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab}
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {tab === 'All Doubts' ? allDoubts.length : myDoubts.length}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={fetchDoubts}
                  disabled={refreshing}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Refresh"
                >
                  <svg 
                    className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsAskDoubtOpen(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Ask Doubt
                </button>
              </div>
            </div>
          </div>

       
          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                <span className="ml-3 text-gray-600">Loading doubts...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="text-red-500 text-lg mb-2">⚠️</div>
                <p className="text-red-600 mb-4">{error.message || JSON.stringify(error)}</p>
                <button 
                  onClick={fetchDoubts}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          {!loading && !error && (
            <div className="space-y-6">
              {getCurrentDoubts().length > 0 ? (
                getCurrentDoubts().map(renderDoubtCard)
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🤔</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab === 'All Doubts' ? 'No doubts found' : 'No doubts yet'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {activeTab === 'All Doubts' 
                        ? 'Be the first to ask a doubt!' 
                        : 'Your asked doubts will appear here'
                      }
                    </p>
                    <button 
                      onClick={() => setIsAskDoubtOpen(true)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      {activeTab === 'All Doubts' ? 'Ask First Doubt' : 'Ask Your First Doubt'}
                    </button>
                  </div>
                </div>
              )}

              {/* Answer Section */}
              {isAnswering && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-4">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Provide a detailed answer for complete clarity"
                      className="w-full h-32 p-4 border border-cyan-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                      <FaImage size={16} />
                      <span className="text-sm">Add Image</span>
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsAnswering(false)}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAnswerSubmit}
                        className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Post Answer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ask Doubt Modal - same as before */}
      {isAskDoubtOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Ask Doubt</h2>
              <button 
                onClick={() => {
                  if (!isSubmitting) {
                    setIsAskDoubtOpen(false);
                    setDoubtQuestion('');
                    setSelectedImage(null);
                    setImagePreview(null);
                  }
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
                disabled={isSubmitting}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <div className="mb-6">
                <textarea
                  value={doubtQuestion}
                  onChange={(e) => setDoubtQuestion(e.target.value)}
                  placeholder="Write your question here..."
                  className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700"
                  disabled={isSubmitting}
                />
                <div className="mt-2 text-xs text-gray-500">
                  {doubtQuestion.length}/500 characters
                </div>
              </div>

              {imagePreview && (
                <div className="mb-6">
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-48 object-contain rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <label className={`flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                    <FaImage size={16} />
                    <span className="text-sm font-medium">
                      {selectedImage ? 'Change Image' : 'Add Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>

                  {selectedImage && (
                    <span className="text-sm text-gray-500 max-w-40 truncate">
                      {selectedImage.name}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setIsAskDoubtOpen(false);
                      setDoubtQuestion('');
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleAskDoubtSubmit}
                    disabled={!doubtQuestion.trim() || isSubmitting}
                    className={`px-8 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      doubtQuestion.trim() && !isSubmitting
                        ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Doubt'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Doubts;
