// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MdOutlineGTranslate } from 'react-icons/md';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import { Navigation, Pagination } from 'swiper/modules';
// import { Bookmark, BookmarkCheck, PlusSquare } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { getUserCollectionDetailSlice, removeUserCollectionSlice, saveCollectionSlice } from '../redux/HomeSlice';
// import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';

// const TestSeriesViewer = ({ testSeriesData, category }) => {
//   const nav = useNavigate();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [bookmarkedIds, setBookmarkedIds] = useState([]);

//   // Enhanced toggle bookmark function with proper state management
//   const toggleBookmark = async (packageId) => {
//     const isCurrentlyBookmarked = bookmarkedIds.includes(packageId);
    
//     // Optimistically update UI first for better UX
//     if (isCurrentlyBookmarked) {
//       setBookmarkedIds(prev => prev.filter(id => id !== packageId));
//     } else {
//       setBookmarkedIds(prev => [...prev, packageId]);
//     }

//     try {
//       let res;
      
//       if (isCurrentlyBookmarked) {
//         // Remove bookmark
//         const collection = {
//           video_id: [],
//           lession_id: [],
//           class_note_id: [],
//           study_note_id: [],
//           article_id: [],
//           news_id: [],
//           question_id: [],
//           test_series_id: [],
//           package_id: [packageId] // Remove this specific package
//         };
        
//         res = await dispatch(removeUserCollectionSlice(collection)).unwrap();
//       } else {
//         // Add bookmark
//         const collection = {
//           video_id: [],
//           lession_id: [],
//           class_note_id: [],
//           study_note_id: [],
//           article_id: [],
//           news_id: [],
//           question_id: [],
//           test_series_id: [],
//           package_id: [packageId] // Add this specific package
//         };
        
//         res = await dispatch(saveCollectionSlice(collection)).unwrap();
//       }

//       if (res.status_code === 200) {
//         showSuccessToast(res.message);
//         // State is already updated optimistically, so no need to change again
//       } else {
//         // Revert optimistic update on failure
//         if (isCurrentlyBookmarked) {
//           setBookmarkedIds(prev => [...prev, packageId]);
//         } else {
//           setBookmarkedIds(prev => prev.filter(id => id !== packageId));
//         }
//         showErrorToast(res.message);
//       }
//     } catch (error) {
//       // Revert optimistic update on error
//       if (isCurrentlyBookmarked) {
//         setBookmarkedIds(prev => [...prev, packageId]);
//       } else {
//         setBookmarkedIds(prev => prev.filter(id => id !== packageId));
//       }
//       showErrorToast(error.message || "Something went wrong");
//       console.error("Bookmark toggle error:", error);
//     }
//   };

//   const fetchBookMarkTestSeries = async () => {
//     setLoading(true);
//     try {
//       const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
      
//       if (res.status_code === 200) {
//         const dataArray = Array.isArray(res.data.package_id?.data)
//           ? res.data.package_id.data
//           : [];

//         const ids = dataArray.map(item => item.id);
//         setBookmarkedIds(ids);
//       } else {
//         console.log("No bookmarks found");
//       }
//     } catch (error) {
//       console.error("Bookmark fetch error", error);
//       showErrorToast("Failed to fetch bookmarks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Refresh bookmarks when component mounts
//   useEffect(() => {
//     fetchBookMarkTestSeries();
//   }, []);

//   // Optional: Refresh bookmarks when component becomes visible again
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (!document.hidden) {
//         fetchBookMarkTestSeries();
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);

//   if (!Array.isArray(category) || category.length === 0) {
//     return (
//       <div className="p-4 text-center">
//         <p className="text-gray-600">No categories available to show test series.</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-50 flex justify-center items-center min-h-[300px]">
//         <div className="flex items-center space-x-2">
//           <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <span className="text-gray-600">Loading bookmarks...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50" id="testseries">
//       {category.map((cat) => {
//         const series = testSeriesData?.[cat.title] || [];

//         if (series.length === 0) return null;

//         return (
//           <div key={cat.id} className="mb-10">
//             <div className='flex items-center flex-col justify-center mb-6 gap-2'>
//               <div className='flex items-center justify-center gap-2'>
//                 <img className='h-8 w-8 rounded-sm object-cover' src={cat.icon} alt={cat.title} />
//                 <h2 className="text-xl font-semibold text-gray-800">{cat.title}</h2>
//               </div>
//               <div className="flex items-center justify-center gap-1 text-xs">
//                 <span className='px-3 py-1 text-slate-800 bg-green-100 rounded-full border-r border-gray-300'>
//                   Free: {cat.free}
//                 </span>
//                 <span className='px-3 py-1 text-slate-800 bg-blue-100 rounded-full border-r border-gray-300'>
//                   Paid: {cat.paid}
//                 </span>
//                 <span className='px-3 py-1 text-slate-800 bg-purple-100 rounded-full'>
//                   Total: {cat.totalSeries}
//                 </span>
//               </div>
//             </div>

//             <Swiper
//               modules={[Navigation, Pagination]}
//               spaceBetween={20}
//               slidesPerView={1}
//               navigation
//               pagination={{ clickable: true }}
//               breakpoints={{
//                 640: { slidesPerView: 1 },
//                 768: { slidesPerView: 2 },
//                 1024: { slidesPerView: 3 },
//                 1280: { slidesPerView: 4 },
//               }}
//               className="pb-10"
//             >
//               {series.map((item, index) => {
//                 const isBookmarked = bookmarkedIds.includes(item.id);
                
//                 return (
//                   <SwiperSlide key={`${item.id}-${index}`}>
//                     <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border cursor-pointer overflow-hidden h-full">
//                       {/* Header */}
//                       <div className="bg-gradient-to-r from-white to-blue-50 px-4 py-3 relative">
//                         <img
//                           src={item.logo || '/logo.jpeg'}
//                           alt="Logo"
//                           className="w-16 h-16 object-contain"
//                           onError={(e) => {
//                             e.target.src = '/logo.jpeg';
//                           }}
//                         />
//                         <span className="absolute top-3 right-3 bg-white text-yellow-500 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
//                           ⚡
//                         </span>
//                       </div>

//                       {/* Body */}
//                       <div className="p-4 flex flex-col h-full">
//                         <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
//                           {item.title || 'Mock Test Series'}
//                         </h3>

//                         <p className="text-sm text-gray-600 mb-2">
//                           {item.total_assign_test || 0} Total Tests
//                         </p>

//                         <p className="text-xs text-blue-600 flex items-center gap-2 mb-3">
//                           <MdOutlineGTranslate className="text-base" />
//                           {item.language || 'English, Hindi'}
//                         </p>

//                         <ul className="text-sm text-gray-700 space-y-1 mb-4 flex-grow">
//                           {item.live_tests && (
//                             <li className="flex items-center">
//                               <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
//                               {item.live_tests} AI-Generated Live Tests
//                             </li>
//                           )}
//                           {item.ai_tests && (
//                             <li className="flex items-center">
//                               <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//                               {item.ai_tests} AI Tests
//                             </li>
//                           )}
//                           {item.previous_papers && (
//                             <li className="flex items-center">
//                               <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                               {item.previous_papers} SSC PYQs
//                             </li>
//                           )}
//                           {item.more_tests && (
//                             <li className="text-green-600 font-medium flex items-center">
//                               <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
//                               +{item.more_tests} more tests
//                             </li>
//                           )}
//                         </ul>

//                         {/* Action Buttons */}
//                         <div className='flex gap-2 items-center justify-between mt-auto'>
//                           <button 
//                             onClick={() => nav('/testpakages', { state: { item, testId: item.id } })} 
//                             className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 text-sm rounded-lg font-semibold transition-all duration-300 hover:scale-105"
//                           >
//                             View Test Series
//                           </button>

//                           <button 
//                             onClick={() => toggleBookmark(item.id)}
//                             className={`
//                               w-12 h-10 rounded-lg flex items-center justify-center transition-all duration-300
//                               ${isBookmarked 
//                                 ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
//                                 : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
//                               }
//                             `}
//                             disabled={loading}
//                           >
//                             {isBookmarked ? (
//                               <BookmarkCheck className="w-5 h-5" />
//                             ) : (
//                               <Bookmark className="w-5 h-5" />
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </Swiper>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default TestSeriesViewer;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineGTranslate, MdQuiz, MdTrendingUp, MdPlayArrow } from 'react-icons/md';
import { FaUsers, FaClock, FaChartLine, FaBolt } from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Bookmark, BookmarkCheck, Trophy, Target, Award, Clock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getUserCollectionDetailSlice, removeUserCollectionSlice, saveCollectionSlice } from '../redux/HomeSlice';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';
import { motion } from 'framer-motion';

const TestSeriesViewer = ({ testSeriesData, category }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [packageIds, setPackageIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const fetchBookMarkTestSeries = async () => {
    try {
      const res = await dispatch(getUserCollectionDetailSlice()).unwrap();

      if (res.status_code === 200) {
        const dataArray = Array.isArray(res.data.package_id?.data)
          ? res.data.package_id.data
          : [];

        const ids = dataArray.map(item => item.id);
        setBookmarkedIds(ids);
      }
    } catch (error) {
      console.error("Bookmark fetch error", error);
    }
  };

  // Enhanced bookmark toggle function with proper error handling
  const handleBookmarkToggle = async (itemId) => {
    try {
      setLoading(true);
      const isCurrentlyBookmarked = bookmarkedIds.includes(itemId);
      
      // Optimistic update - Update UI immediately
      if (isCurrentlyBookmarked) {
        setBookmarkedIds(prev => prev.filter(id => id !== itemId));
      } else {
        setBookmarkedIds(prev => [...prev, itemId]);
      }

      // Make API call
      let result;
      if (isCurrentlyBookmarked) {
        // Remove bookmark
        result = await dispatch(removeUserCollectionSlice({
          type: 'package_id',
          id: itemId
        })).unwrap();
      } else {
        // Add bookmark
        result = await dispatch(saveCollectionSlice({
          type: 'package_id',
          id: itemId
        })).unwrap();
      }

      // Check if API call was successful
      if (result.status_code === 200) {
        if (isCurrentlyBookmarked) {
          showSuccessToast('Bookmark removed successfully');
        } else {
          showSuccessToast('Bookmark added successfully');
        }
      } else {
        // Revert optimistic update if API call failed
        if (isCurrentlyBookmarked) {
          setBookmarkedIds(prev => [...prev, itemId]);
        } else {
          setBookmarkedIds(prev => prev.filter(id => id !== itemId));
        }
        showErrorToast('Failed to update bookmark');
      }
    } catch (error) {
      console.error('Bookmark toggle error:', error);
      
      // Revert optimistic update on error
      const isCurrentlyBookmarked = bookmarkedIds.includes(itemId);
      if (isCurrentlyBookmarked) {
        setBookmarkedIds(prev => [...prev, itemId]);
      } else {
        setBookmarkedIds(prev => prev.filter(id => id !== itemId));
      }
      
      showErrorToast('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookMarkTestSeries();
  }, []);

  if (!Array.isArray(category) || category.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <MdQuiz size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No test series categories available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50" id="testseries">
        <div className="max-w-7xl mx-auto space-y-12">
          {category.map((cat, categoryIndex) => {
            const series = testSeriesData?.[cat.title] || [];

            if (series.length === 0) return null;

            return (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="space-y-8"
              >
                {/* Enhanced Category Header */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="relative">
                      <img 
                        className="h-16 w-16 rounded-2xl shadow-lg border-4 border-white" 
                        src={cat.icon} 
                        alt={cat.title}
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                        <IoSparkles className="text-white text-sm" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        {cat.title}
                      </h2>
                      <p className="text-gray-600 text-lg">Comprehensive Test Preparation</p>
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="flex items-center justify-center gap-1 sm:gap-4 text-sm sm:text-base">
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-xl font-semibold">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Free {cat.free}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-xl font-semibold">
                      <Trophy size={14} />
                      <span>Paid {cat.paid}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-2 rounded-xl font-semibold">
                      <Target size={14} />
                      <span>Total {cat.totalSeries}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Swiper */}
                <div className="relative swiper-wrapper-container">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation={{
                      nextEl: `.swiper-button-next-${cat.id}`,
                      prevEl: `.swiper-button-prev-${cat.id}`,
                    }}
                    pagination={{
                      el: `.swiper-pagination-${cat.id}`,
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    breakpoints={{
                      640: { slidesPerView: 1, spaceBetween: 20 },
                      768: { slidesPerView: 2, spaceBetween: 24 },
                      1024: { slidesPerView: 3, spaceBetween: 28 },
                      1280: { slidesPerView: 4, spaceBetween: 32 },
                    }}
                    className="pb-12"
                  >
                    {series.map((item, index) => (
                      <SwiperSlide key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 test-series-card"
                        >
                          {/* Background Glow Effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/0 to-purple-500/0 group-hover:from-blue-400/20 group-hover:to-purple-500/20 rounded-3xl transition-all duration-500 blur-sm -z-10"></div>
                          
                          {/* Card Header */}
                          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-50"></div>
                            <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full blur-xl"></div>
                            
                            <div className="relative z-10 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <img
                                    src={item.logo || '/logo.jpeg'}
                                    alt="Logo"
                                    className="w-16 h-16 object-contain rounded-2xl bg-white p-2 shadow-lg"
                                  />
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                    <FaBolt className="text-white text-xs" />
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full mb-1">
                                    PREMIUM
                                  </div>
                                  <div className="text-sm text-gray-600 font-medium">
                                    {item.total_assign_test || 0} Tests Available
                                  </div>
                                </div>
                              </div>
                              
                              {/* Enhanced Bookmark Button */}
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleBookmarkToggle(item.id)}
                                disabled={loading}
                                className={`bookmark-btn relative z-20 p-3 rounded-2xl transition-all duration-300 ${
                                  bookmarkedIds.includes(item.id)
                                    ? 'bg-yellow-500 text-white shadow-lg'
                                    : 'bg-white/80 text-gray-600 hover:bg-yellow-500 hover:text-white'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {loading ? (
                                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : bookmarkedIds.includes(item.id) ? (
                                  <BookmarkCheck size={20} />
                                ) : (
                                  <Bookmark size={20} />
                                )}
                              </motion.button>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-6 space-y-4 bg-white">
                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {item.title || 'Mock Test Series'}
                            </h3>

                            {/* Language */}
                            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-xl">
                              <MdOutlineGTranslate className="text-xl" />
                              <span className="text-sm font-medium">
                                {item.language || 'English, Hindi'}
                              </span>
                            </div>

                            {/* Features List */}
                            <div className="space-y-3">
                              {item.live_tests && (
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                  <span><strong className="text-gray-900">{item.live_tests}</strong> AI-Generated Live Tests</span>
                                </div>
                              )}
                              {item.ai_tests && (
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span><strong className="text-gray-900">{item.ai_tests}</strong> AI-Powered Tests</span>
                                </div>
                              )}
                              {item.previous_papers && (
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span><strong className="text-gray-900">{item.previous_papers}</strong> Previous Year Papers</span>
                                </div>
                              )}
                              {item.more_tests && (
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  <span className="text-purple-600 font-semibold">
                                    +{item.more_tests} more comprehensive tests
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-600">
                                  {item.total_assign_test || 0}
                                </div>
                                <div className="text-xs text-gray-500">Tests</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-600">4.8</div>
                                <div className="text-xs text-gray-500">Rating</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-600">50K+</div>
                                <div className="text-xs text-gray-500">Students</div>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="p-6 pt-0 bg-white">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => nav('/testpakages', { state: { item, testId: item.id } })}
                              className="start-test-btn w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 group overflow-hidden"
                            >
                              {/* Shimmer Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              <Trophy size={20} className="relative z-10" />
                              <span className="relative z-10">Start Test Series</span>
                              <MdPlayArrow size={24} className="group-hover:translate-x-1 transition-transform relative z-10" />
                            </motion.button>
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <div className={`swiper-button-prev-${cat.id} custom-nav-btn custom-prev-btn`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={`swiper-button-next-${cat.id} custom-nav-btn custom-next-btn`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Custom Pagination */}
                  <div className={`swiper-pagination-${cat.id} custom-pagination`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        /* Swiper Container */
        .swiper-wrapper-container {
          position: relative;
          z-index: 1;
        }

        /* Test Series Card Styling */
        .test-series-card {
          position: relative;
          z-index: 2;
        }

        /* Bookmark Button */
        .bookmark-btn {
          position: relative;
          z-index: 25 !important;
        }

        /* Start Test Button */
        .start-test-btn {
          position: relative;
          z-index: 15;
        }

        /* Custom Navigation Buttons */
        .custom-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 30 !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .custom-prev-btn {
          left: 16px;
        }

        .custom-next-btn {
          right: 16px;
        }

        .custom-nav-btn:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
        }

        .custom-nav-btn.swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Custom Pagination */
        .custom-pagination {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
        }

        .custom-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #3b82f6;
          opacity: 0.3;
          transition: all 0.3s ease;
        }

        .custom-pagination .swiper-pagination-bullet-active {
          background: #8b5cf6;
          opacity: 1;
          width: 32px;
          border-radius: 6px;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .custom-nav-btn {
            display: none;
          }
        }

        /* Prevent hover state conflicts */
        .test-series-card:hover .text-gray-700 {
          color: rgb(55, 65, 81) !important;
        }
        
        .test-series-card:hover .text-gray-600 {
          color: rgb(75, 85, 99) !important;
        }
        
        .test-series-card:hover .text-gray-900 {
          color: rgb(17, 24, 39) !important;
        }

        /* Hide default Swiper buttons */
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default TestSeriesViewer;


