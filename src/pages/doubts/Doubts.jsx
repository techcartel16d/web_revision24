// import React, { useState, useEffect } from 'react';
// import { FaThumbsUp, FaComment, FaEllipsisH, FaTimes, FaImage } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   doubtSolutionData, 
//   myDoubtSolutionData, 
//   allDoubtSolutionData, 
//   likeDoubtData
// } from '../../redux/doubtSolutionSlice';

// const Doubts = () => {
//   const dispatch = useDispatch();

//   // ✅ Redux state selectors with debugging
//   const doubtSolutionState = useSelector((state) => state.doubtSolution || {});
//   const { 
//     allDoubts = [], 
//     myDoubts = [], 
//     loading = false, 
//     error = null 
//   } = doubtSolutionState;

//   console.log('Redux State Debug:', {
//     doubtSolutionState,
//     allDoubts,
//     myDoubts,
//     loading,
//     error
//   });

//   const [activeTab, setActiveTab] = useState('All Doubts');
//   const [isAnswering, setIsAnswering] = useState(false);
//   const [answer, setAnswer] = useState('');
//   const [isAskDoubtOpen, setIsAskDoubtOpen] = useState(false);
//   const [doubtQuestion, setDoubtQuestion] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [likeDoubt,setLikeDoubt]=useState(null);

//   const tabs = ['All Doubts', 'My Doubts'];

//   // ✅ Enhanced fetch function with debugging
//   const fetchDoubts = async () => {
//     try {
//       setRefreshing(true);
//       console.log('Starting to fetch doubts...');

//       // Dispatch both API calls simultaneously
//       const [allDoubtsResult, myDoubtsResult] = await Promise.all([
//         dispatch(allDoubtSolutionData()).unwrap(),
//         dispatch(myDoubtSolutionData()).unwrap()
//       ]);


//     } catch (error) {
//       console.error('Error fetching doubts:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // ✅ Fetch doubts on component mount
//   useEffect(() => {
//     fetchDoubts();
//   }, [dispatch]);

//   // ✅ Debug current doubts
//   const getCurrentDoubts = () => {
//     const currentDoubts = activeTab === 'All Doubts' ? allDoubts : myDoubts;

//     return currentDoubts;
//   };

//   // ✅ Updated render doubt card with better data mapping
//   const renderDoubtCard = (doubt) => {


//     return (
//       <div key={doubt.id} className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         {/* User Info */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
//               {/* ✅ Handle both API response structures */}
//               {(doubt.user?.profile || doubt.user_image) ? (
//                 <img 
//                   src={doubt.user?.profile || doubt.user_image} 
//                   alt={doubt.user?.name || doubt.user_name || 'User'} 
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.nextSibling.style.display = 'flex';
//                   }}
//                 />
//               ) : null}
//               <span 
//                 className="text-gray-600 font-medium text-sm flex items-center justify-center w-full h-full"
//                 style={{ display: (doubt.user?.profile || doubt.user_image) ? 'none' : 'flex' }}
//               >
//                 {(doubt.user?.name || doubt.user_name || doubt.username || 'U').charAt(0).toUpperCase()}
//               </span>
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">
//                 {doubt.user?.name || doubt.user_name || doubt.username || 'Anonymous'}
//               </h3>
//               <div className="flex items-center space-x-2 text-sm text-gray-500">
//                 {doubt.category && <span className="px-2 py-1 bg-gray-100 rounded text-xs">{doubt.category}</span>}
//                 <span>{doubt.created_at || 'Recently'}</span>
//                 {/* ✅ Show status badge */}
//                 <span className={`px-2 py-1 rounded text-xs ${
//                   doubt.status === 'success' 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {doubt.status === 'success' ? 'Answered' : 'Pending'}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <button className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
//             + Add to my doubts
//           </button>
//         </div>

//         {/* Question */}
//         <div className="mb-4">
//           <p className="text-gray-800 mb-4 leading-relaxed">
//             {doubt.text || doubt.question}
//           </p>
//           {doubt.image && (
//             <div className="bg-gray-100 rounded-lg p-4">
//               <img
//                 src={doubt.image}
//                 alt="Question"
//                 className="w-full max-w-2xl rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
//                 onClick={() => window.open(doubt.image, '_blank')}
//               />
//             </div>
//           )}
//         </div>

//         {/* ✅ Show solution if exists */}
//         {doubt.solution && (
//           <div className="mb-4 bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
//             <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
//             <div 
//               className="text-gray-700" 
//               dangerouslySetInnerHTML={{ __html: doubt.solution.text }}
//             />
//             {doubt.solution.image && (
//               <div className="mt-3">
//                 <img
//                   src={doubt.solution.image}
//                   alt="Solution"
//                   className="max-w-full h-auto rounded-lg cursor-pointer"
//                   onClick={() => window.open(doubt.solution.image, '_blank')}
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex items-center justify-between pt-4 border-t">
//           <div className="flex items-center space-x-6">
//             <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
//               <FaThumbsUp size={16} />
//               <span className="text-sm font-medium">
//                 Upvote ({doubt.upvotes || doubt.likes || 0})
//               </span>
//             </button>
//             {/* <button 
//               onClick={() => setIsAnswering(!isAnswering)}
//               className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
//             >
//               <FaComment size={16} />
//               <span className="text-sm font-medium">
//                 {doubt.solution ? '1' : '0'} Answer{doubt.solution ? '' : 's'}
//               </span>
//             </button> */}
//           </div>
//           <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
//             <FaEllipsisH size={16} />
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Rest of your component code remains the same...
//   // (handleImageUpload, removeImage, handleAskDoubtSubmit, etc.)

//   // Image handling functions
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size should be less than 5MB');
//         return;
//       }
//       if (!file.type.startsWith('image/')) {
//         alert('Please select a valid image file');
//         return;
//       }
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeImage = () => {
//     setSelectedImage(null);
//     setImagePreview(null);
//   };

//   const handleAskDoubtSubmit = async () => {
//     if (!doubtQuestion.trim()) {
//       alert('Please enter your question');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const formData = new FormData();
//       formData.append('text', doubtQuestion.trim());
//       if (selectedImage) {
//         formData.append('image', selectedImage);
//       }

//       console.log('Submitting doubt:', {
//         text: doubtQuestion.trim(),
//         image: selectedImage ? selectedImage.name : 'No image'
//       });

//       const result = await dispatch(doubtSolutionData(formData)).unwrap();


//       setDoubtQuestion('');
//       setSelectedImage(null);
//       setImagePreview(null);
//       setIsAskDoubtOpen(false);

//       await fetchDoubts();
//       alert('Your doubt has been submitted successfully!');

//     } catch (error) {
//       console.error('Error submitting doubt:', error);
//       alert(error.message || 'Failed to submit doubt. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAnswerSubmit = () => {
//     console.log('Answer submitted:', answer);
//     setAnswer('');
//     setIsAnswering(false);
//   };

// // ✅ Like Doubt Handler
//   const handleLikeDoubt = async (doubtId) => {
//     try {
//       setLikingDoubtId(doubtId);

//       // ✅ Optimistic update
//       dispatch(updateDoubtLikes({ doubtId, increment: true }));

//       // ✅ API call
//       await dispatch(likeDoubtData(doubtId)).unwrap();

//       console.log('Doubt liked successfully:', doubtId);
//     } catch (error) {
//       console.error('Error liking doubt:', error);

//       // ✅ Revert optimistic update on error
//       dispatch(updateDoubtLikes({ doubtId, increment: false }));

//       alert(error.message || 'Failed to like doubt');
//     } finally {
//       setLikingDoubtId(null);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Navigation Tabs */}
//           <div className="bg-white rounded-lg shadow-sm mb-6">
//             <div className="flex items-center justify-between p-6">
//               <div className="flex space-x-8">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => {
//                       console.log(`Switching to tab: ${tab}`);
//                       setActiveTab(tab);
//                     }}
//                     className={`pb-2 font-medium transition-colors ${
//                       activeTab === tab
//                         ? 'text-cyan-500 border-b-2 border-cyan-500'
//                         : 'text-gray-600 hover:text-gray-800'
//                     }`}
//                   >
//                     {tab}
//                     <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
//                       {tab === 'All Doubts' ? allDoubts.length : myDoubts.length}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//               <div className="flex items-center space-x-3">
//                 <button 
//                   onClick={fetchDoubts}
//                   disabled={refreshing}
//                   className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
//                   title="Refresh"
//                 >
//                   <svg 
//                     className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                 </button>
//                 <button 
//                   onClick={() => setIsAskDoubtOpen(true)}
//                   className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   Ask Doubt
//                 </button>
//               </div>
//             </div>
//           </div>


//           {/* Loading State */}
//           {loading && (
//             <div className="bg-white rounded-lg shadow-sm p-12">
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
//                 <span className="ml-3 text-gray-600">Loading doubts...</span>
//               </div>
//             </div>
//           )}

//           {/* Error State */}
//           {error && (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <div className="text-center">
//                 <div className="text-red-500 text-lg mb-2">⚠️</div>
//                 <p className="text-red-600 mb-4">{error.message || JSON.stringify(error)}</p>
//                 <button 
//                   onClick={fetchDoubts}
//                   className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Content based on active tab */}
//           {!loading && !error && (
//             <div className="space-y-6">
//               {getCurrentDoubts().length > 0 ? (
//                 getCurrentDoubts().map(renderDoubtCard)
//               ) : (
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 text-6xl mb-4">🤔</div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">
//                       {activeTab === 'All Doubts' ? 'No doubts found' : 'No doubts yet'}
//                     </h3>
//                     <p className="text-gray-500 mb-6">
//                       {activeTab === 'All Doubts' 
//                         ? 'Be the first to ask a doubt!' 
//                         : 'Your asked doubts will appear here'
//                       }
//                     </p>
//                     <button 
//                       onClick={() => setIsAskDoubtOpen(true)}
//                       className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                     >
//                       {activeTab === 'All Doubts' ? 'Ask First Doubt' : 'Ask Your First Doubt'}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Answer Section */}
//               {isAnswering && (
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <div className="mb-4">
//                     <textarea
//                       value={answer}
//                       onChange={(e) => setAnswer(e.target.value)}
//                       placeholder="Provide a detailed answer for complete clarity"
//                       className="w-full h-32 p-4 border border-cyan-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
//                       <FaImage size={16} />
//                       <span className="text-sm">Add Image</span>
//                     </button>

//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setIsAnswering(false)}
//                         className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleAnswerSubmit}
//                         className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
//                       >
//                         Post Answer
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Ask Doubt Modal - same as before */}
//       {isAskDoubtOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//             <div className="flex items-center justify-between p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-900">Ask Doubt</h2>
//               <button 
//                 onClick={() => {
//                   if (!isSubmitting) {
//                     setIsAskDoubtOpen(false);
//                     setDoubtQuestion('');
//                     setSelectedImage(null);
//                     setImagePreview(null);
//                   }
//                 }}
//                 className="text-gray-400 hover:text-gray-600 p-1"
//                 disabled={isSubmitting}
//               >
//                 <FaTimes size={20} />
//               </button>
//             </div>

//             <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
//               <div className="mb-6">
//                 <textarea
//                   value={doubtQuestion}
//                   onChange={(e) => setDoubtQuestion(e.target.value)}
//                   placeholder="Write your question here..."
//                   className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700"
//                   disabled={isSubmitting}
//                 />
//                 <div className="mt-2 text-xs text-gray-500">
//                   {doubtQuestion.length}/500 characters
//                 </div>
//               </div>

//               {imagePreview && (
//                 <div className="mb-6">
//                   <div className="relative inline-block">
//                     <img 
//                       src={imagePreview} 
//                       alt="Preview" 
//                       className="max-w-full h-48 object-contain rounded-lg border border-gray-200"
//                     />
//                     <button
//                       onClick={removeImage}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                       disabled={isSubmitting}
//                     >
//                       <FaTimes size={12} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <label className={`flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
//                     <FaImage size={16} />
//                     <span className="text-sm font-medium">
//                       {selectedImage ? 'Change Image' : 'Add Image'}
//                     </span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                       disabled={isSubmitting}
//                     />
//                   </label>

//                   {selectedImage && (
//                     <span className="text-sm text-gray-500 max-w-40 truncate">
//                       {selectedImage.name}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={() => {
//                       setIsAskDoubtOpen(false);
//                       setDoubtQuestion('');
//                       setSelectedImage(null);
//                       setImagePreview(null);
//                     }}
//                     className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     onClick={handleAskDoubtSubmit}
//                     disabled={!doubtQuestion.trim() || isSubmitting}
//                     className={`px-8 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
//                       doubtQuestion.trim() && !isSubmitting
//                         ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
//                         : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     {isSubmitting && (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     )}
//                     <span>{isSubmitting ? 'Submitting...' : 'Submit Doubt'}</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Doubts;


// import React, { useState, useEffect } from 'react';
// import { FaThumbsUp, FaComment, FaEllipsisH, FaTimes, FaImage } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   doubtSolutionData, 
//   myDoubtSolutionData, 
//   allDoubtSolutionData, 
//   likeDoubtData,

// } from '../../redux/doubtSolutionSlice';

// const Doubts = () => {
//   const dispatch = useDispatch();

//   // ✅ Redux state selectors
//   const doubtSolutionState = useSelector((state) => state.doubtSolution || {});
//   const { 
//     allDoubts = [], 
//     myDoubts = [], 
//     loading = false, 
//     error = null,
//     likeLoading = false,
//     likeSuccess = false
//   } = doubtSolutionState;

//   console.log('Redux State Debug:', {
//     doubtSolutionState,
//     allDoubts,
//     myDoubts,
//     loading,
//     error
//   });

//   // ✅ Component State
//   const [activeTab, setActiveTab] = useState('All Doubts');
//   const [isAnswering, setIsAnswering] = useState(false);
//   const [answer, setAnswer] = useState('');
//   const [isAskDoubtOpen, setIsAskDoubtOpen] = useState(false);
//   const [doubtQuestion, setDoubtQuestion] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [likingDoubtId, setLikingDoubtId] = useState(null);

//   const tabs = ['All Doubts', 'My Doubts'];

//   // ✅ Fetch doubts function
//   const fetchDoubts = async () => {
//     try {
//       setRefreshing(true);
//       console.log('Starting to fetch doubts...');

//       const [allDoubtsResult, myDoubtsResult] = await Promise.all([
//         dispatch(allDoubtSolutionData()).unwrap(),
//         dispatch(myDoubtSolutionData()).unwrap()
//       ]);

//       console.log('All Doubts fetched:', allDoubtsResult);
//       console.log('My Doubts fetched:', myDoubtsResult);
//     } catch (error) {
//       console.error('Error fetching doubts:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // ✅ Fetch on component mount
//   useEffect(() => {
//     fetchDoubts();
//   }, [dispatch]);

//   // ✅ Get current doubts based on active tab
//   const getCurrentDoubts = () => {
//     const currentDoubts = activeTab === 'All Doubts' ? allDoubts : myDoubts;
//     console.log(`Current tab: ${activeTab}, Doubts count:`, currentDoubts.length);
//     return currentDoubts;
//   };

//   // ✅ Handle Like Doubt
//   const handleLikeDoubt = async (doubtId) => {
//     try {
//       setLikingDoubtId(doubtId);

//       // Optimistic update


//       // API call
//       await dispatch(likeDoubtData(doubtId)).unwrap();

//       console.log('Doubt liked successfully:', doubtId);
//     } catch (error) {
//       console.error('Error liking doubt:', error);

//       // Revert optimistic update on error

//       alert(error.message || 'Failed to like doubt');
//     } finally {
//       setLikingDoubtId(null);
//     }
//   };

//   // ✅ Handle image upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size should be less than 5MB');
//         return;
//       }
//       if (!file.type.startsWith('image/')) {
//         alert('Please select a valid image file');
//         return;
//       }
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // ✅ Remove image
//   const removeImage = () => {
//     setSelectedImage(null);
//     setImagePreview(null);
//   };

//   // ✅ Handle Ask Doubt Submit
//   const handleAskDoubtSubmit = async () => {
//     if (!doubtQuestion.trim()) {
//       alert('Please enter your question');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const formData = new FormData();
//       formData.append('text', doubtQuestion.trim());
//       if (selectedImage) {
//         formData.append('image', selectedImage);
//       }

//       console.log('Submitting doubt:', {
//         text: doubtQuestion.trim(),
//         image: selectedImage ? selectedImage.name : 'No image'
//       });

//       const result = await dispatch(doubtSolutionData(formData)).unwrap();
//       console.log('Doubt submitted successfully:', result);

//       // Reset form
//       setDoubtQuestion('');
//       setSelectedImage(null);
//       setImagePreview(null);
//       setIsAskDoubtOpen(false);

//       // Refresh doubts list
//       await fetchDoubts();
//       alert('Your doubt has been submitted successfully!');

//     } catch (error) {
//       console.error('Error submitting doubt:', error);
//       alert(error.message || 'Failed to submit doubt. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ✅ Handle Answer Submit
//   const handleAnswerSubmit = () => {
//     console.log('Answer submitted:', answer);
//     setAnswer('');
//     setIsAnswering(false);
//   };

//   // ✅ Render doubt card with like functionality
//   const renderDoubtCard = (doubt) => {
//     const isLiking = likingDoubtId === doubt.id;
//     const doubtLikes = doubt.likes || doubt.upvotes || 0;
//     const isLiked = doubt.isLiked || false;

//     return (
//       <div key={doubt.id} className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         {/* User Info */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
//               {(doubt.user?.profile || doubt.user_image) ? (
//                 <img 
//                   src={doubt.user?.profile || doubt.user_image} 
//                   alt={doubt.user?.name || doubt.user_name || 'User'} 
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.nextSibling.style.display = 'flex';
//                   }}
//                 />
//               ) : null}
//               <span 
//                 className="text-gray-600 font-medium text-sm flex items-center justify-center w-full h-full"
//                 style={{ display: (doubt.user?.profile || doubt.user_image) ? 'none' : 'flex' }}
//               >
//                 {(doubt.user?.name || doubt.user_name || doubt.username || 'U').charAt(0).toUpperCase()}
//               </span>
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">
//                 {doubt.user?.name || doubt.user_name || doubt.username || 'Anonymous'}
//               </h3>
//               <div className="flex items-center space-x-2 text-sm text-gray-500">
//                 {doubt.category && (
//                   <span className="px-2 py-1 bg-gray-100 rounded text-xs">
//                     {doubt.category}
//                   </span>
//                 )}
//                 <span>{doubt.created_at || 'Recently'}</span>
//                 <span className={`px-2 py-1 rounded text-xs ${
//                   doubt.status === 'success' 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {doubt.status === 'success' ? 'Answered' : 'Pending'}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <button className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
//             + Add to my doubts
//           </button>
//         </div>

//         {/* Question */}
//         <div className="mb-4">
//           <p className="text-gray-800 mb-4 leading-relaxed">
//             {doubt.text || doubt.question}
//           </p>
//           {doubt.image && (
//             <div className="bg-gray-100 rounded-lg p-4">
//               <img
//                 src={doubt.image}
//                 alt="Question"
//                 className="w-full max-w-2xl rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
//                 onClick={() => window.open(doubt.image, '_blank')}
//               />
//             </div>
//           )}
//         </div>

//         {/* Solution */}
//         {doubt.solution && (
//           <div className="mb-4 bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
//             <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
//             <div 
//               className="text-gray-700" 
//               dangerouslySetInnerHTML={{ __html: doubt.solution.text }}
//             />
//             {doubt.solution.image && (
//               <div className="mt-3">
//                 <img
//                   src={doubt.solution.image}
//                   alt="Solution"
//                   className="max-w-full h-auto rounded-lg cursor-pointer"
//                   onClick={() => window.open(doubt.solution.image, '_blank')}
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex items-center justify-between pt-4 border-t">
//           <div className="flex items-center space-x-6">
//             {/* ✅ Like Button */}
//             <button 
//               onClick={() => handleLikeDoubt(doubt.id)}
//               disabled={isLiking}
//               className={`flex items-center space-x-2 transition-colors ${
//                 isLiked 
//                   ? 'text-blue-600' 
//                   : 'text-gray-600 hover:text-blue-600'
//               } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//               {isLiking ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//               ) : (
//                 <FaThumbsUp 
//                   size={16} 
//                   className={isLiked ? 'fill-current' : ''} 
//                 />
//               )}
//               <span className="text-sm font-medium">
//                 {isLiked ? 'Liked' : 'Upvote'} ({doubtLikes})
//               </span>
//             </button>

//             {/* Comment Button */}
//             <button 
//               onClick={() => setIsAnswering(!isAnswering)}
//               className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
//             >
//               <FaComment size={16} />
//               <span className="text-sm font-medium">
//                 {doubt.solution ? '1' : '0'} Answer{doubt.solution ? '' : 's'}
//               </span>
//             </button>
//           </div>
//           <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
//             <FaEllipsisH size={16} />
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Navigation Tabs */}
//           <div className="bg-white rounded-lg shadow-sm mb-6">
//             <div className="flex items-center justify-between p-6">
//               <div className="flex space-x-8">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => {
//                       console.log(`Switching to tab: ${tab}`);
//                       setActiveTab(tab);
//                     }}
//                     className={`pb-2 font-medium transition-colors ${
//                       activeTab === tab
//                         ? 'text-cyan-500 border-b-2 border-cyan-500'
//                         : 'text-gray-600 hover:text-gray-800'
//                     }`}
//                   >
//                     {tab}
//                     <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
//                       {tab === 'All Doubts' ? allDoubts.length : myDoubts.length}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//               <div className="flex items-center space-x-3">
//                 <button 
//                   onClick={fetchDoubts}
//                   disabled={refreshing}
//                   className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
//                   title="Refresh"
//                 >
//                   <svg 
//                     className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                   >
//                     <path 
//                       strokeLinecap="round" 
//                       strokeLinejoin="round" 
//                       strokeWidth={2} 
//                       d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
//                     />
//                   </svg>
//                 </button>
//                 <button 
//                   onClick={() => setIsAskDoubtOpen(true)}
//                   className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   Ask Doubt
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="bg-white rounded-lg shadow-sm p-12">
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
//                 <span className="ml-3 text-gray-600">Loading doubts...</span>
//               </div>
//             </div>
//           )}

//           {/* Error State */}
//           {error && (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <div className="text-center">
//                 <div className="text-red-500 text-lg mb-2">⚠️</div>
//                 <p className="text-red-600 mb-4">
//                   {error.message || JSON.stringify(error)}
//                 </p>
//                 <button 
//                   onClick={fetchDoubts}
//                   className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Content based on active tab */}
//           {!loading && !error && (
//             <div className="space-y-6">
//               {getCurrentDoubts().length > 0 ? (
//                 getCurrentDoubts().map(renderDoubtCard)
//               ) : (
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 text-6xl mb-4">🤔</div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">
//                       {activeTab === 'All Doubts' ? 'No doubts found' : 'No doubts yet'}
//                     </h3>
//                     <p className="text-gray-500 mb-6">
//                       {activeTab === 'All Doubts' 
//                         ? 'Be the first to ask a doubt!' 
//                         : 'Your asked doubts will appear here'
//                       }
//                     </p>
//                     <button 
//                       onClick={() => setIsAskDoubtOpen(true)}
//                       className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                     >
//                       {activeTab === 'All Doubts' ? 'Ask First Doubt' : 'Ask Your First Doubt'}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Answer Section */}
//               {isAnswering && (
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <div className="mb-4">
//                     <textarea
//                       value={answer}
//                       onChange={(e) => setAnswer(e.target.value)}
//                       placeholder="Provide a detailed answer for complete clarity"
//                       className="w-full h-32 p-4 border border-cyan-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
//                       <FaImage size={16} />
//                       <span className="text-sm">Add Image</span>
//                     </button>

//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setIsAnswering(false)}
//                         className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleAnswerSubmit}
//                         className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
//                       >
//                         Post Answer
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Ask Doubt Modal */}
//       {isAskDoubtOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-900">Ask Doubt</h2>
//               <button 
//                 onClick={() => {
//                   if (!isSubmitting) {
//                     setIsAskDoubtOpen(false);
//                     setDoubtQuestion('');
//                     setSelectedImage(null);
//                     setImagePreview(null);
//                   }
//                 }}
//                 className="text-gray-400 hover:text-gray-600 p-1"
//                 disabled={isSubmitting}
//               >
//                 <FaTimes size={20} />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
//               {/* Question Input */}
//               <div className="mb-6">
//                 <textarea
//                   value={doubtQuestion}
//                   onChange={(e) => setDoubtQuestion(e.target.value)}
//                   placeholder="Write your question here..."
//                   className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700"
//                   disabled={isSubmitting}
//                   maxLength={500}
//                 />
//                 <div className="mt-2 text-xs text-gray-500">
//                   {doubtQuestion.length}/500 characters
//                 </div>
//               </div>

//               {/* Image Preview */}
//               {imagePreview && (
//                 <div className="mb-6">
//                   <div className="relative inline-block">
//                     <img 
//                       src={imagePreview} 
//                       alt="Preview" 
//                       className="max-w-full h-48 object-contain rounded-lg border border-gray-200"
//                     />
//                     <button
//                       onClick={removeImage}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                       disabled={isSubmitting}
//                     >
//                       <FaTimes size={12} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <label className={`flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
//                     <FaImage size={16} />
//                     <span className="text-sm font-medium">
//                       {selectedImage ? 'Change Image' : 'Add Image'}
//                     </span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                       disabled={isSubmitting}
//                     />
//                   </label>

//                   {selectedImage && (
//                     <span className="text-sm text-gray-500 max-w-40 truncate">
//                       {selectedImage.name}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={() => {
//                       setIsAskDoubtOpen(false);
//                       setDoubtQuestion('');
//                       setSelectedImage(null);
//                       setImagePreview(null);
//                     }}
//                     className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     onClick={handleAskDoubtSubmit}
//                     disabled={!doubtQuestion.trim() || isSubmitting}
//                     className={`px-8 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
//                       doubtQuestion.trim() && !isSubmitting
//                         ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
//                         : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     {isSubmitting && (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     )}
//                     <span>{isSubmitting ? 'Submitting...' : 'Submit Doubt'}</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Doubts;






// import React, { useState, useEffect } from 'react';
// import { FaThumbsUp, FaComment, FaEllipsisH, FaTimes, FaImage } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   doubtSolutionData,
//   myDoubtSolutionData,
//   allDoubtSolutionData,
//   likeDoubtData,
// } from '../../redux/doubtSolutionSlice';

// const Doubts = () => {
//   const dispatch = useDispatch();

//   // ✅ Redux state selectors
//   const doubtSolutionState = useSelector((state) => state.doubtSolution || {});
//   const {
//     allDoubts = [],
//     myDoubts = [],
//     loading = false,
//     error = null,
//     likeLoading = false,
//   } = doubtSolutionState;

//   console.log('Redux State:', { allDoubts, myDoubts, loading, error });

//   // ✅ Component State
//   const [activeTab, setActiveTab] = useState('All Doubts');
//   const [isAnswering, setIsAnswering] = useState(false);
//   const [answer, setAnswer] = useState('');
//   const [isAskDoubtOpen, setIsAskDoubtOpen] = useState(false);
//   const [doubtQuestion, setDoubtQuestion] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [likingSolveId, setLikingSolveId] = useState(null);
//   const [localLikes, setLocalLikes] = useState({}); // ✅ Track likes locally for instant UI update

//   const tabs = ['All Doubts', 'My Doubts'];

//   // ✅ Fetch doubts from API
//   // const fetchDoubts = async () => {
//   //   try {
//   //     setRefreshing(true);
//   //     console.log('Fetching doubts...');

//   //     await Promise.all([
//   //       dispatch(allDoubtSolutionData()).unwrap(),
//   //       dispatch(myDoubtSolutionData()).unwrap()
//   //     ]);

//   //     console.log('Doubts fetched successfully');
//   //   } catch (error) {
//   //     console.error('Error fetching doubts:', error);
//   //   } finally {
//   //     setRefreshing(false);
//   //   }
//   // };

//   // Add debug logs
// const fetchDoubts = async () => {
//   try {
//     setRefreshing(true);
//     console.log('Fetching doubts...');

//     const [allDoubtsResult, myDoubtsResult] = await Promise.all([
//       dispatch(allDoubtSolutionData()).unwrap(),
//       dispatch(myDoubtSolutionData()).unwrap()
//     ]);

//     console.log('✅ All Doubts Response:', allDoubtsResult);
//     console.log('✅ My Doubts Response:', myDoubtsResult);
    
//     // Check if solution.likes exists
//     allDoubtsResult?.data?.forEach(doubt => {
//       if (doubt.solution) {
//         console.log(`Doubt ${doubt.id} solution likes:`, doubt.solution.likes);
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching doubts:', error);
//   } finally {
//     setRefreshing(false);
//   }
// };

//   // ✅ Fetch on mount
//   useEffect(() => {
//     fetchDoubts();
//   }, []);

//   // ✅ Get current doubts based on tab
//   const getCurrentDoubts = () => {
//     const doubts = activeTab === 'All Doubts' ? allDoubts : myDoubts;
//     console.log(`${activeTab} count:`, doubts.length);
//     return doubts;
//   };

//   // ✅ Handle Like Solution with immediate UI update
//   const handleLikeSolution = async (solveId) => {
//     console.log('=== Like Solution Debug ===');
//     console.log('1. solveId received:', solveId);
//     console.log('2. solveId type:', typeof solveId);
//     console.log('3. solveId is valid:', solveId != null && solveId !== undefined);

//     if (!solveId) {
//       console.error('❌ Invalid solve_id');
//       alert('Invalid solution ID');
//       return;
//     }

//     try {
//       setLikingSolveId(solveId);

//       console.log('4. Dispatching likeDoubtData with:', solveId);
//       const result = await dispatch(likeDoubtData(solveId)).unwrap();
//       console.log('5. ✅ Like Success:', result);

//       // ✅ Immediate local update for instant UI feedback
//       setLocalLikes(prev => ({
//         ...prev,
//         [solveId]: result.likes
//       }));

//       // Refresh to sync with server
//       await fetchDoubts();

//       console.log('6. ✅ Likes updated successfully');
//     } catch (error) {
//       console.error('7. ❌ Like Error:', error);

//       // Show detailed error
//       if (error.errors) {
//         console.error('Validation Errors:', error.errors);
//         const errorMessages = Object.entries(error.errors)
//           .map(([key, msgs]) => `${key}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
//           .join('\n');
//         alert(`Validation Error:\n${errorMessages}`);
//       } else {
//         alert(error?.message || 'Failed to like solution');
//       }
//     } finally {
//       setLikingSolveId(null);
//     }
//   };

//   // ✅ Handle image upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size should be less than 5MB');
//         return;
//       }
//       if (!file.type.startsWith('image/')) {
//         alert('Please select a valid image file');
//         return;
//       }
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // ✅ Remove image
//   const removeImage = () => {
//     setSelectedImage(null);
//     setImagePreview(null);
//   };

//   // ✅ Handle Ask Doubt Submit
//   const handleAskDoubtSubmit = async () => {
//     if (!doubtQuestion.trim()) {
//       alert('Please enter your question');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const formData = new FormData();
//       formData.append('text', doubtQuestion.trim());
//       if (selectedImage) {
//         formData.append('image', selectedImage);
//       }

//       console.log('Submitting doubt...');
//       await dispatch(doubtSolutionData(formData)).unwrap();
//       console.log('Doubt submitted successfully');

//       // Reset form
//       setDoubtQuestion('');
//       setSelectedImage(null);
//       setImagePreview(null);
//       setIsAskDoubtOpen(false);

//       // Refresh doubts
//       await fetchDoubts();
//       alert('Your doubt has been submitted successfully!');

//     } catch (error) {
//       console.error('Submit Error:', error);
//       alert(error.message || 'Failed to submit doubt');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ✅ Handle Answer Submit
//   const handleAnswerSubmit = () => {
//     console.log('Answer submitted:', answer);
//     setAnswer('');
//     setIsAnswering(false);
//   };

//   // ✅ Render Doubt Card with working like functionality
//   const renderDoubtCard = (doubt) => {
//     const hasSolution = doubt.solution && doubt.solution.id;
//     const solveId = doubt.solution?.id;
//     const isLiking = likingSolveId === solveId;
    
//     // ✅ Use local likes first (instant update), then fall back to API data
//     const solutionLikes = localLikes[solveId] ?? doubt.solution?.likes ?? 0;
//     const isLiked = doubt.solution?.isLiked || (localLikes[solveId] !== undefined);

//     console.log(`📊 Rendering solution ${solveId}: likes=${solutionLikes}, localLikes=${localLikes[solveId]}, dbLikes=${doubt.solution?.likes}`);

//     return (
//       <div key={doubt.id} className="bg-white rounded-lg shadow-sm p-6 mb-6 hover:shadow-md transition-shadow">
//         {/* User Info */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center overflow-hidden">
//               {(doubt.user?.profile || doubt.user_image) ? (
//                 <img
//                   src={doubt.user?.profile || doubt.user_image}
//                   alt={doubt.user?.name || doubt.user_name || 'User'}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.nextSibling.style.display = 'flex';
//                   }}
//                 />
//               ) : null}
//               <span
//                 className="text-white font-bold text-sm flex items-center justify-center w-full h-full"
//                 style={{ display: (doubt.user?.profile || doubt.user_image) ? 'none' : 'flex' }}
//               >
//                 {(doubt.user?.name || doubt.user_name || doubt.username || 'U').charAt(0).toUpperCase()}
//               </span>
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">
//                 {doubt.user?.name || doubt.user_name || doubt.username || 'Anonymous'}
//               </h3>
//               <div className="flex items-center space-x-2 text-sm text-gray-500">
//                 {doubt.category && (
//                   <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
//                     {doubt.category}
//                   </span>
//                 )}
//                 <span>{doubt.created_at || 'Recently'}</span>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${doubt.status === 'success'
//                   ? 'bg-green-100 text-green-800'
//                   : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                   {doubt.status === 'success' ? '✓ Answered' : '⏳ Pending'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Question */}
//         <div className="mb-4">
//           <p className="text-gray-800 mb-4 leading-relaxed text-base">
//             {doubt.text || doubt.question}
//           </p>
//           {doubt.image && (
//             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <img
//                 src={doubt.image}
//                 alt="Question"
//                 className="w-full max-w-2xl rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
//                 onClick={() => window.open(doubt.image, '_blank')}
//               />
//             </div>
//           )}
//         </div>

//         {/* Solution */}
//         {doubt.solution && (
//           <div className="mb-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border-l-4 border-green-500">
//             <div className="flex items-center mb-3">
//               <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
//                 <span className="text-white text-sm font-bold">✓</span>
//               </div>
//               <h4 className="font-bold text-green-800 text-lg">Solution</h4>
//             </div>

//             <div
//               className="text-gray-700 leading-relaxed mb-3"
//               dangerouslySetInnerHTML={{ __html: doubt.solution.text }}
//             />

//             {doubt.solution.image && (
//               <div className="mt-3">
//                 <img
//                   src={doubt.solution.image}
//                   alt="Solution"
//                   className="max-w-full h-auto rounded-lg cursor-pointer border border-green-200"
//                   onClick={() => window.open(doubt.solution.image, '_blank')}
//                 />
//               </div>
//             )}

//             {/* ✅ Like Button for Solution - WORKING VERSION */}
//             {hasSolution && (
//               <div className="mt-4 pt-4 border-t border-green-200">
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     handleLikeSolution(solveId);
//                   }}
//                   disabled={isLiking}
//                   className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isLiked
//                     ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                     : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                     } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
//                 >
//                   {isLiking ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                       <span className="text-sm font-medium">Liking...</span>
//                     </>
//                   ) : (
//                     <>
//                       <FaThumbsUp
//                         size={16}
//                         className={isLiked ? 'fill-current' : ''}
//                       />
//                       <span className="text-sm font-medium">
//                         {isLiked ? 'Liked' : 'Like this solution'}
//                       </span>
//                       {/* ✅ Shows updated likes count immediately */}
//                       <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-semibold">
//                         {solutionLikes}
//                       </span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Actions */}
//         {/* <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//           <div className="flex items-center space-x-6">
//             <button
//               onClick={() => setIsAnswering(!isAnswering)}
//               className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
//             >
//               <FaComment size={16} />
//               <span className="text-sm font-medium">
//                 {doubt.solution ? '1 Answer' : 'No Answers'}
//               </span>
//             </button>
//           </div>
//           <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
//             <FaEllipsisH size={16} />
//           </button>
//         </div> */}
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Header Card */}
//           <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
//             <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
//               <h1 className="text-2xl font-bold mb-2">💬 Doubt Solution Forum</h1>
//               <p className="text-cyan-100">Ask your doubts and help others solve theirs!</p>
//             </div>

//             {/* Navigation Tabs */}
//             <div className="flex items-center justify-between p-6 border-b">
//               <div className="flex space-x-8">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`pb-2 font-semibold transition-all ${activeTab === tab
//                       ? 'text-cyan-600 border-b-3 border-cyan-600 scale-105'
//                       : 'text-gray-600 hover:text-gray-800'
//                       }`}
//                   >
//                     {tab}
//                     <span className={`ml-2 text-xs px-2 py-1 rounded-full ${activeTab === tab
//                       ? 'bg-cyan-100 text-cyan-700'
//                       : 'bg-gray-200 text-gray-600'
//                       }`}>
//                       {tab === 'All Doubts' ? allDoubts.length : myDoubts.length}
//                     </span>
//                   </button>
//                 ))}
//               </div>

//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={fetchDoubts}
//                   disabled={refreshing}
//                   className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                   title="Refresh"
//                 >
//                   <svg
//                     className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                 </button>

//                 <button
//                   onClick={() => setIsAskDoubtOpen(true)}
//                   className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
//                 >
//                   <span>➕</span>
//                   <span>Ask Doubt</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="bg-white rounded-xl shadow-sm p-12">
//               <div className="flex flex-col items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
//                 <span className="mt-4 text-gray-600 font-medium">Loading doubts...</span>
//               </div>
//             </div>
//           )}

//           {/* Error State */}
//           {error && (
//             <div className="bg-white rounded-xl shadow-sm p-8">
//               <div className="text-center">
//                 <div className="text-red-500 text-5xl mb-4">⚠️</div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
//                 <p className="text-red-600 mb-6">{error.message || JSON.stringify(error)}</p>
//                 <button
//                   onClick={fetchDoubts}
//                   className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-md"
//                 >
//                   🔄 Try Again
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Content */}
//           {!loading && !error && (
//             <div className="space-y-6">
//               {getCurrentDoubts().length > 0 ? (
//                 getCurrentDoubts().map(renderDoubtCard)
//               ) : (
//                 <div className="bg-white rounded-xl shadow-sm p-8">
//                   <div className="text-center py-12">
//                     <div className="text-gray-300 text-8xl mb-6">🤔</div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                       {activeTab === 'All Doubts' ? 'No doubts found' : 'You haven\'t asked any doubts yet'}
//                     </h3>
//                     <p className="text-gray-500 mb-8 text-lg">
//                       {activeTab === 'All Doubts'
//                         ? 'Be the first one to ask a doubt!'
//                         : 'Start by asking your first doubt'
//                       }
//                     </p>
//                     <button
//                       onClick={() => setIsAskDoubtOpen(true)}
//                       className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
//                     >
//                       <span>➕</span>
//                       <span>Ask Your First Doubt</span>
//                     </button>
//                   </div>
//                 </div>
//               )}

            
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Ask Doubt Modal */}
//       {isAskDoubtOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
//           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-cyan-500 to-blue-600">
//               <div>
//                 <h2 className="text-2xl font-bold text-white">Ask Your Doubt</h2>
//                 <p className="text-cyan-100 text-sm">Get help from the community</p>
//               </div>
//               <button
//                 onClick={() => {
//                   if (!isSubmitting) {
//                     setIsAskDoubtOpen(false);
//                     setDoubtQuestion('');
//                     setSelectedImage(null);
//                     setImagePreview(null);
//                   }
//                 }}
//                 className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
//                 disabled={isSubmitting}
//               >
//                 <FaTimes size={24} />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
//               {/* Question Input */}
//               <div className="mb-6">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Your Question *
//                 </label>
//                 <textarea
//                   value={doubtQuestion}
//                   onChange={(e) => setDoubtQuestion(e.target.value)}
//                   placeholder="Write your question in detail here..."
//                   className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
//                   disabled={isSubmitting}
//                   maxLength={500}
//                 />
//                 <div className="mt-2 flex justify-between items-center">
//                   <span className="text-xs text-gray-500">
//                     {doubtQuestion.length}/500 characters
//                   </span>
//                   {doubtQuestion.trim() && (
//                     <span className="text-xs text-green-600 font-medium">✓ Looking good!</span>
//                   )}
//                 </div>
//               </div>

//               {/* Image Preview */}
//               {imagePreview && (
//                 <div className="mb-6">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Image Preview
//                   </label>
//                   <div className="relative inline-block">
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="max-w-full h-64 object-contain rounded-xl border-2 border-gray-200 shadow-md"
//                     />
//                     <button
//                       onClick={removeImage}
//                       className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
//                       disabled={isSubmitting}
//                     >
//                       <FaTimes size={14} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex items-center justify-between pt-4 border-t">
//                 <div className="flex items-center space-x-3">
//                   <label className={`flex items-center space-x-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-medium ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md'}`}>
//                     <FaImage size={18} />
//                     <span className="text-sm">
//                       {selectedImage ? 'Change Image' : 'Add Image'}
//                     </span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                       disabled={isSubmitting}
//                     />
//                   </label>

//                   {selectedImage && (
//                     <span className="text-sm text-green-600 font-medium max-w-48 truncate flex items-center">
//                       <span className="mr-1">✓</span>
//                       {selectedImage.name}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={() => {
//                       setIsAskDoubtOpen(false);
//                       setDoubtQuestion('');
//                       setSelectedImage(null);
//                       setImagePreview(null);
//                     }}
//                     className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     onClick={handleAskDoubtSubmit}
//                     disabled={!doubtQuestion.trim() || isSubmitting}
//                     className={`px-8 py-2.5 rounded-lg font-bold transition-all flex items-center space-x-2 shadow-md ${doubtQuestion.trim() && !isSubmitting
//                       ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white hover:shadow-lg'
//                       : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                       }`}
//                   >
//                     {isSubmitting && (
//                       <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                     )}
//                     <span>{isSubmitting ? 'Submitting...' : '✓ Submit Doubt'}</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Custom CSS Animations */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes slideUp {
//           from { 
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to { 
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
        
//         .animate-slideUp {
//           animation: slideUp 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Doubts;


import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaComment, FaEllipsisH, FaTimes, FaImage } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  doubtSolutionData,
  myDoubtSolutionData,
  allDoubtSolutionData,
  likeDoubtData,
} from '../../redux/doubtSolutionSlice';

const Doubts = () => {
  const dispatch = useDispatch();

  const doubtSolutionState = useSelector((state) => state.doubtSolution || {});
  const {
    allDoubts = [],
    myDoubts = [],
    loading = false,
    error = null,
    likeLoading = false,
  } = doubtSolutionState;

  const [activeTab, setActiveTab] = useState('All Doubts');
  const [isAnswering, setIsAnswering] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isAskDoubtOpen, setIsAskDoubtOpen] = useState(false);
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likingSolveId, setLikingSolveId] = useState(null);
  const [localLikes, setLocalLikes] = useState({});

  const tabs = ['All Doubts', 'My Doubts'];

  const fetchDoubts = async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        dispatch(allDoubtSolutionData()).unwrap(),
        dispatch(myDoubtSolutionData()).unwrap()
      ]);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const getCurrentDoubts = () => {
    return activeTab === 'All Doubts' ? allDoubts : myDoubts;
  };

  const handleLikeSolution = async (solveId) => {
    if (!solveId) {
      alert('Invalid solution ID');
      return;
    }

    try {
      setLikingSolveId(solveId);
      const result = await dispatch(likeDoubtData(solveId)).unwrap();
      
      setLocalLikes(prev => ({
        ...prev,
        [solveId]: result.likes
      }));

      await fetchDoubts();
    } catch (error) {
      console.error('Like Error:', error);
      alert(error?.message || 'Failed to like solution');
    } finally {
      setLikingSolveId(null);
    }
  };

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

      await dispatch(doubtSolutionData(formData)).unwrap();
      
      setDoubtQuestion('');
      setSelectedImage(null);
      setImagePreview(null);
      setIsAskDoubtOpen(false);
      
      await fetchDoubts();
      alert('Your doubt has been submitted successfully!');
    } catch (error) {
      console.error('Submit Error:', error);
      alert(error.message || 'Failed to submit doubt');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Responsive Doubt Card
  const renderDoubtCard = (doubt) => {
    const hasSolution = doubt.solution && doubt.solution.id;
    const solveId = doubt.solution?.id;
    const isLiking = likingSolveId === solveId;
    const solutionLikes = localLikes[solveId] ?? doubt.solution?.likes ?? 0;
    const isLiked = doubt.solution?.isLiked || (localLikes[solveId] !== undefined);

    return (
      <div key={doubt.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 hover:shadow-md transition-shadow">
        {/* ✅ Responsive User Info */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                className="text-white font-bold text-xs sm:text-sm flex items-center justify-center w-full h-full"
                style={{ display: (doubt.user?.profile || doubt.user_image) ? 'none' : 'flex' }}
              >
                {(doubt.user?.name || doubt.user_name || doubt.username || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {doubt.user?.name || doubt.user_name || doubt.username || 'Anonymous'}
              </h3>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                {doubt.category && (
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium">
                    {doubt.category}
                  </span>
                )}
                <span className="hidden sm:inline">{doubt.created_at || 'Recently'}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  doubt.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doubt.status === 'success' ? '✓ Answered' : '⏳ Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Responsive Question */}
        <div className="mb-4">
          <p className="text-gray-800 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base break-words">
            {doubt.text || doubt.question}
          </p>
          {doubt.image && (
            <div className="bg-gray-50 rounded-lg p-2 sm:p-4 border border-gray-200">
              <img
                src={doubt.image}
                alt="Question"
                className="w-full rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity max-h-64 sm:max-h-96"
                onClick={() => window.open(doubt.image, '_blank')}
              />
            </div>
          )}
        </div>

        {/* ✅ Responsive Solution */}
        {doubt.solution && (
          <div className="mb-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 sm:p-5 border-l-4 border-green-500">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs sm:text-sm font-bold">✓</span>
              </div>
              <h4 className="font-bold text-green-800 text-base sm:text-lg">Solution</h4>
            </div>

            <div
              className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base break-words"
              dangerouslySetInnerHTML={{ __html: doubt.solution.text }}
            />

            {doubt.solution.image && (
              <div className="mt-3">
                <img
                  src={doubt.solution.image}
                  alt="Solution"
                  className="w-full h-auto rounded-lg cursor-pointer border border-green-200 max-h-64 sm:max-h-96 object-contain"
                  onClick={() => window.open(doubt.solution.image, '_blank')}
                />
              </div>
            )}

            {/* ✅ Responsive Like Button */}
            {hasSolution && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-green-200">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLikeSolution(solveId);
                  }}
                  disabled={isLiking}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-sm ${
                    isLiked
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
                >
                  {isLiking ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-600"></div>
                      <span className="text-xs sm:text-sm font-medium">Liking...</span>
                    </>
                  ) : (
                    <>
                      <FaThumbsUp
                        size={14}
                        className={`sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`}
                      />
                      <span className="text-xs sm:text-sm font-medium">
                        {isLiked ? 'Liked' : 'Like'}
                      </span>
                      <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 rounded-full text-xs font-semibold">
                        {solutionLikes}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto">
          {/* ✅ Responsive Header */}
          <div className="bg-white rounded-xl shadow-sm mb-4 sm:mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 sm:p-6 text-white">
              <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">💬 Doubt Solution Forum</h1>
              <p className="text-cyan-100 text-sm sm:text-base">Ask your doubts and help others!</p>
            </div>

            {/* ✅ Responsive Navigation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 sm:p-6 border-b gap-3">
              <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                      activeTab === tab
                        ? 'text-cyan-600 border-b-3 border-cyan-600 scale-105'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab}
                    <span className={`ml-2 text-xs px-2 py-0.5 sm:py-1 rounded-full ${
                      activeTab === tab
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab === 'All Doubts' ? allDoubts.length : myDoubts.length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                <button
                  onClick={fetchDoubts}
                  disabled={refreshing}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Refresh"
                >
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>

                <button
                  onClick={() => setIsAskDoubtOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                >
                  <span>➕</span>
                  <span className="hidden sm:inline">Ask Doubt</span>
                  <span className="sm:hidden">Ask</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-cyan-500 border-t-transparent"></div>
                <span className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading doubts...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
              <div className="text-center">
                <div className="text-red-500 text-4xl sm:text-5xl mb-4">⚠️</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">{error.message || JSON.stringify(error)}</p>
                <button
                  onClick={fetchDoubts}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-colors shadow-md text-sm sm:text-base"
                >
                  🔄 Try Again
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <div className="space-y-4 sm:space-y-6">
              {getCurrentDoubts().length > 0 ? (
                getCurrentDoubts().map(renderDoubtCard)
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-300 text-6xl sm:text-8xl mb-4 sm:mb-6">🤔</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {activeTab === 'All Doubts' ? 'No doubts found' : 'You haven\'t asked any doubts yet'}
                    </h3>
                    <p className="text-gray-500 mb-6 sm:mb-8 text-base sm:text-lg">
                      {activeTab === 'All Doubts'
                        ? 'Be the first one to ask a doubt!'
                        : 'Start by asking your first doubt'
                      }
                    </p>
                    <button
                      onClick={() => setIsAskDoubtOpen(true)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <span>➕</span>
                      <span>Ask Your First Doubt</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Responsive Modal */}
      {isAskDoubtOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-cyan-500 to-blue-600">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Ask Your Doubt</h2>
                <p className="text-cyan-100 text-xs sm:text-sm">Get help from the community</p>
              </div>
              <button
                onClick={() => {
                  if (!isSubmitting) {
                    setIsAskDoubtOpen(false);
                    setDoubtQuestion('');
                    setSelectedImage(null);
                    setImagePreview(null);
                  }
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <FaTimes size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)] overflow-y-auto">
              {/* Question Input */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Question *
                </label>
                <textarea
                  value={doubtQuestion}
                  onChange={(e) => setDoubtQuestion(e.target.value)}
                  placeholder="Write your question in detail here..."
                  className="w-full h-32 sm:h-48 p-3 sm:p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all text-sm sm:text-base"
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <div className="mt-2 flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500">
                    {doubtQuestion.length}/500 characters
                  </span>
                  {doubtQuestion.trim() && (
                    <span className="text-green-600 font-medium">✓ Looking good!</span>
                  )}
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image Preview
                  </label>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-48 sm:max-h-64 object-contain rounded-xl border-2 border-gray-200 shadow-md"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full p-1.5 sm:p-2 hover:bg-red-600 transition-colors shadow-lg"
                      disabled={isSubmitting}
                    >
                      <FaTimes size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <label className={`flex items-center space-x-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-medium text-sm ${
                    isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md'
                  }`}>
                    <FaImage size={16} className="sm:w-4.5 sm:h-4.5" />
                    <span className="text-xs sm:text-sm">
                      {selectedImage ? 'Change' : 'Add Image'}
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
                    <span className="text-xs sm:text-sm text-green-600 font-medium max-w-32 sm:max-w-48 truncate flex items-center">
                      <span className="mr-1">✓</span>
                      <span className="hidden sm:inline">{selectedImage.name}</span>
                      <span className="sm:hidden">Added</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={() => {
                      setIsAskDoubtOpen(false);
                      setDoubtQuestion('');
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-gray-600 hover:text-gray-800 font-semibold transition-colors text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAskDoubtSubmit}
                    disabled={!doubtQuestion.trim() || isSubmitting}
                    className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-2.5 rounded-lg font-bold transition-all flex items-center justify-center space-x-2 shadow-md text-sm sm:text-base ${
                      doubtQuestion.trim() && !isSubmitting
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting && (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                    )}
                    <span>{isSubmitting ? 'Submitting...' : '✓ Submit'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Doubts;
