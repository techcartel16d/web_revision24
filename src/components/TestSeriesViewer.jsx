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

      // if (res.status_code === 200) {
      //   const dataArray = Array.isArray(res.data.package_id?.data)
      //     ? res.data.package_id.data
      //     : [];

      //   console.log('dataArray', dataArray)
      //   const ids = dataArray.map(item => item.id);
      //   setBookmarkedIds(ids);
      // }


      if (res.status_code === 200) {
        // ✅ Get data array
        const dataArray = Array.isArray(res.data.package_id?.data)
          ? res.data.package_id.data
          : [];

        // ✅ Sort packages by sequence (ascending) AND sort tests inside each package
        const sortedPackages = dataArray
          .map(pkg => ({
            ...pkg,
            // Sort tests inside each package by sequence
            tests: (pkg.tests || []).sort((a, b) => {
              const seqA = a.sequence ? Number(a.sequence) : Infinity;
              const seqB = b.sequence ? Number(b.sequence) : Infinity;
              return seqA - seqB;
            })
          }))
          // Sort packages by sequence
          .sort((a, b) => {
            const seqA = Number(a.sequence) || Infinity;
            const seqB = Number(b.sequence) || Infinity;
            return seqA - seqB;
          });

        console.log('Sorted packages:', sortedPackages);

        // ✅ Extract package IDs from sorted data
        const ids = sortedPackages.map(item => item.id);
        setBookmarkedIds(ids);

        console.log('Package IDs (sorted):', ids);
      }



    } catch (error) {
      console.error("Bookmark fetch error", error);
    }
  };

  const handleBookmarkToggle = async (itemId) => {
    try {
      setLoading(true);
      const isCurrentlyBookmarked = bookmarkedIds.includes(itemId);

      // Optimistic update
      if (isCurrentlyBookmarked) {
        setBookmarkedIds(prev => prev.filter(id => id !== itemId));
      } else {
        setBookmarkedIds(prev => [...prev, itemId]);
      }

      // ✅ FIXED: Use correct API format (array structure)
      let result;
      if (isCurrentlyBookmarked) {
        // Remove bookmark - Use array format
        result = await dispatch(removeUserCollectionSlice({
          video_id: [],
          lession_id: [],
          class_note_id: [],
          study_note_id: [],
          article_id: [],
          news_id: [],
          question_id: [],
          test_series_id: [],
          package_id: [itemId] // ✅ Array format
        })).unwrap();
      } else {
        // Add bookmark - Use array format
        result = await dispatch(saveCollectionSlice({
          video_id: [],
          lession_id: [],
          class_note_id: [],
          study_note_id: [],
          article_id: [],
          news_id: [],
          question_id: [],
          test_series_id: [],
          package_id: [itemId] // ✅ Array format
        })).unwrap();
      }

      // Success/error handling
      if (result.status_code === 200) {
        showSuccessToast(isCurrentlyBookmarked ? 'Removed Successfully' : 'Added Successfully');
      } else {
        // Revert on failure
        if (isCurrentlyBookmarked) {
          setBookmarkedIds(prev => [...prev, itemId]);
        } else {
          setBookmarkedIds(prev => prev.filter(id => id !== itemId));
        }
        showErrorToast('Failed to update bookmark');
      }
    } catch (error) {
      console.error('Bookmark error:', error);

      // Revert on error
      const isCurrentlyBookmarked = bookmarkedIds.includes(itemId);
      if (isCurrentlyBookmarked) {
        setBookmarkedIds(prev => [...prev, itemId]);
      } else {
        setBookmarkedIds(prev => prev.filter(id => id !== itemId));
      }

      showErrorToast('Something went wrong');
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
            // console.log("cate", cat);
            const series = testSeriesData?.[cat.title] || [];
            // console.log("cat.title", cat.title);

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
                <div className="relative swiper-wrapper-container pb-8" >
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
                      <SwiperSlide key={index} style={{ maxHeight: '360px' }}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 test-series-card"
                        >
                          {/* Background Glow Effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/0 to-purple-500/0 group-hover:from-blue-400/20 group-hover:to-purple-500/20 rounded-3xl transition-all duration-500 blur-sm -z-10"></div>

                          {/* Card Header */}
                          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-50"></div>
                            <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full blur-xl"></div>

                            <div className="relative z-10 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <img
                                    src={item.logo || '/logo.jpeg'}
                                    alt="Logo"
                                    className="w-12 h-12 object-contain rounded-sm bg-white p-1 shadow-lg"
                                  />
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                    <FaBolt className="text-white text-xs" />
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-semibold text-white bg-[#FFAC00] px-1 py-1 rounded-sm mb-1 
                                      transition-all duration-300 
                                      hover:scale-105 hover:shadow-lg 
                                      animate-pulse 
                                      cursor-pointer
                                      hover:bg-gradient-to-r hover:from-yellow-400 hover:via-orange-500 hover:to-pink-600"
                                    style={{ textAlign: 'center' }}>
                                    PREMIUM
                                  </div>

                                  <div className="text-[10px] text-gray-600 font-medium">
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
                                className={`bookmark-btn relative z-20 p-2 rounded-sm transition-all duration-300 ${bookmarkedIds.includes(item.id)
                                  ? 'bg-yellow-500 text-white shadow-lg'
                                  : 'bg-white/80 text-gray-600 hover:bg-yellow-500 hover:text-white'
                                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {loading ? (
                                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : bookmarkedIds.includes(item.id) ? (
                                  <BookmarkCheck size={16} />
                                ) : (
                                  <Bookmark size={16} />
                                )}
                              </motion.button>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-6 space-y-3 bg-white" >
                            {/* Title */}
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {item.title || 'Mock Test Series'}
                            </h3>

                            {/* Language */}
                            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-sm">
                              <MdOutlineGTranslate className="text-sm" />
                              <span className="text-sm font-medium">
                                {item.language || 'English, Hindi'}
                              </span>
                            </div>

                            {/* Features List */}
                            <div className="space-y-2" >
                              {item.live_tests && (
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                  <span><strong className="text-gray-900">{item.live_tests}</strong> AI-Generated Live Tests</span>
                                </div>
                              )}
                              {item.ai_tests && (
                                <div className="flex items-center gap-3 text-sm text-gray-700" >
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
                            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
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
                          <div className="p-6 pt-0 bg-white" >
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => nav('/testpakages', { state: { item, testId: item.id, category: cat.title } })}
                              className="start-test-btn w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white py-2 px-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 group overflow-hidden"
                            >
                              {/* Shimmer Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              <Trophy size={16} className="relative z-10" />
                              <span className="relative z-10 text-[13px]">Start Test Series</span>
                              <MdPlayArrow size={16} className="group-hover:translate-x-1 transition-transform relative z-10" />
                            </motion.button>
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <div className={`swiper-button-prev-${cat.id} custom-nav-btn custom-prev-btn`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className={`swiper-button-next-${cat.id} custom-nav-btn custom-next-btn`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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


