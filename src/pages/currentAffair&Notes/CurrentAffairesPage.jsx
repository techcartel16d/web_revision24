

// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { getCurrentAffairesSlice } from "../../redux/freeTestSlice";
// import { getUserCollectionDetailSlice, saveCollectionSlice, removeUserCollectionSlice } from "../../redux/HomeSlice";
// import { useNavigate } from "react-router-dom";
// import LanguageToggle from "../../components/LanguageToggle";
// import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { showSuccessToast, showErrorToast } from "../../utils/ToastUtil";

// const CurrentAffairesPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ✅ Store ALL data grouped by date
//   const [allCurrentAffairsData, setAllCurrentAffairsData] = useState({});
//   const [filteredData, setFilteredData] = useState([]);
//   const [availableDates, setAvailableDates] = useState([]);

//   const [bookmarkedIds, setBookmarkedIds] = useState([]);
//   const [bookmarkLoading, setBookmarkLoading] = useState(null);
//   const [language, setLanguage] = useState("Hindi");
//   const [loading, setLoading] = useState(false);

//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedDate, setSelectedDate] = useState(new Date().getDate());

//   // ✅ Fetch bookmarks
//   const fetchBookmarks = async () => {
//     try {
//       const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//       if (res.status_code === 200) {
//         const newsIds = (res.data.news_id?.data || []).map(item => item.id);
//         setBookmarkedIds(newsIds);
//       }
//     } catch (error) {
//       console.error("Error fetching bookmarks:", error);
//     }
//   };

//   // ✅ Fetch ALL pages of current affairs
//   const fetchAllCurrentAffairs = async () => {
//     try {
//       setLoading(true);

//       // ✅ Fetch first page to get total pages
//       const firstRes = await dispatch(getCurrentAffairesSlice({ page: 1 })).unwrap();

//       console.log('✅ First page response:', firstRes);

//       const firstPageData = firstRes?.data?.original?.data?.data || [];
//       const totalPages = firstRes?.data?.original?.data?.last_page || 1;

//       console.log('📊 Total pages:', totalPages);

//       // ✅ Store first page data
//       let allData = [...firstPageData];

//       // ✅ Fetch remaining pages
//       if (totalPages > 1) {
//         const pagePromises = [];
//         for (let page = 2; page <= totalPages; page++) {
//           pagePromises.push(
//             dispatch(getCurrentAffairesSlice({ page })).unwrap()
//           );
//         }

//         // ✅ Wait for all pages
//         const results = await Promise.all(pagePromises);

//         results.forEach(res => {
//           const pageData = res?.data?.original?.data?.data || [];
//           allData = [...allData, ...pageData];
//         });
//       }

//       console.log('📦 Total items fetched:', allData.length);

//       // ✅ Group all data by date
//       const groupedByDate = {};
//       allData.forEach(item => {
//         if (item.date && item.news) {
//           if (!groupedByDate[item.date]) {
//             groupedByDate[item.date] = [];
//           }
//           groupedByDate[item.date] = [...groupedByDate[item.date], ...item.news];
//         }
//       });

//       console.log('📅 Grouped by date:', groupedByDate);
//       console.log('📅 Available dates:', Object.keys(groupedByDate));

//       setAllCurrentAffairsData(groupedByDate);

//       // ✅ Sort dates (newest first)
//       const dates = Object.keys(groupedByDate);
//       const sortedDates = dates.sort((a, b) => {
//         const [dayA, monthA, yearA] = a.split('-').map(Number);
//         const [dayB, monthB, yearB] = b.split('-').map(Number);
//         const dateA = new Date(yearA, monthA - 1, dayA);
//         const dateB = new Date(yearB, monthB - 1, dayB);
//         return dateB - dateA;
//       });

//       setAvailableDates(sortedDates);
//       console.log('📅 Sorted dates:', sortedDates);

//       setLoading(false);
//     } catch (error) {
//       console.error('❌ Error fetching current affairs:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllCurrentAffairs();
//     fetchBookmarks();
//   }, []);

//   // ✅ Toggle bookmark
//   const toggleBookmark = async (id) => {
//     setBookmarkLoading(id);
//     const isCurrentlyBookmarked = bookmarkedIds.includes(id);

//     if (isCurrentlyBookmarked) {
//       setBookmarkedIds(prev => prev.filter(i => i !== id));
//     } else {
//       setBookmarkedIds(prev => [...prev, id]);
//     }

//     try {
//       let result;
//       if (isCurrentlyBookmarked) {
//         result = await dispatch(removeUserCollectionSlice({
//           video_id: [],
//           lession_id: [],
//           class_note_id: [],
//           study_note_id: [],
//           article_id: [],
//           news_id: [id],
//           question_id: [],
//           test_series_id: [],
//           package_id: []
//         })).unwrap();
//       } else {
//         result = await dispatch(saveCollectionSlice({
//           video_id: [],
//           lession_id: [],
//           class_note_id: [],
//           study_note_id: [],
//           article_id: [],
//           news_id: [id],
//           question_id: [],
//           test_series_id: [],
//           package_id: []
//         })).unwrap();
//       }

//       if (result.status_code === 200) {
//         showSuccessToast(isCurrentlyBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
//       } else {
//         if (isCurrentlyBookmarked) {
//           setBookmarkedIds(prev => [...prev, id]);
//         } else {
//           setBookmarkedIds(prev => prev.filter(i => i !== id));
//         }
//         showErrorToast('Failed to update bookmark');
//       }
//     } catch (error) {
//       console.error('Bookmark error:', error);
//       if (isCurrentlyBookmarked) {
//         setBookmarkedIds(prev => [...prev, id]);
//       } else {
//         setBookmarkedIds(prev => prev.filter(i => i !== id));
//       }
//       showErrorToast('Something went wrong');
//     } finally {
//       setBookmarkLoading(null);
//     }
//   };

//   const generateYears = () => {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let year = currentYear - 5; year <= currentYear + 2; year++) {
//       years.push(year);
//     }
//     return years;
//   };

//   const months = [
//     { value: 0, label: "January", hindi: "जनवरी" },
//     { value: 1, label: "February", hindi: "फरवरी" },
//     { value: 2, label: "March", hindi: "मार्च" },
//     { value: 3, label: "April", hindi: "अप्रैल" },
//     { value: 4, label: "May", hindi: "मई" },
//     { value: 5, label: "June", hindi: "जून" },
//     { value: 6, label: "July", hindi: "जुलाई" },
//     { value: 7, label: "August", hindi: "अगस्त" },
//     { value: 8, label: "September", hindi: "सितंबर" },
//     { value: 9, label: "October", hindi: "अक्टूबर" },
//     { value: 10, label: "November", hindi: "नवंबर" },
//     { value: 11, label: "December", hindi: "दिसंबर" }
//   ];

//   const getWeekDates = () => {
//     const dates = [];
//     const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDate);
//     const dayOfWeek = selectedDateObj.getDay();
//     const startOfWeek = new Date(selectedDateObj);
//     startOfWeek.setDate(selectedDate - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

//     for (let i = 0; i < 7; i++) {
//       const date = new Date(startOfWeek);
//       date.setDate(startOfWeek.getDate() + i);
//       dates.push(date);
//     }
//     return dates;
//   };

//   const navigateWeek = (direction) => {
//     const currentSelectedDate = new Date(selectedYear, selectedMonth, selectedDate);
//     const newDate = new Date(currentSelectedDate);
//     newDate.setDate(currentSelectedDate.getDate() + (direction === 'next' ? 7 : -7));

//     setSelectedDate(newDate.getDate());
//     setSelectedMonth(newDate.getMonth());
//     setSelectedYear(newDate.getFullYear());
//   };

//   // ✅ Filter data when date changes
//   useEffect(() => {
//     if (Object.keys(allCurrentAffairsData).length === 0) return;

//     const selectedDateStr = `${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}`;

//     console.log('🔍 Looking for date:', selectedDateStr);
//     console.log('📦 Available dates:', Object.keys(allCurrentAffairsData));

//     const newsForDate = allCurrentAffairsData[selectedDateStr] || [];

//     console.log('📰 News found for', selectedDateStr, ':', newsForDate.length, 'items');

//     setFilteredData(newsForDate);
//   }, [selectedDate, selectedMonth, selectedYear, allCurrentAffairsData]);

//   const weekDates = getWeekDates();
//   const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//   const hasDataForDate = (date) => {
//     const dateStr = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
//     return availableDates.includes(dateStr);
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-50 px-2 py-6 sm:px-4">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800"
//         >
//           {language === "Hindi" ? "करेंट अफेयर्स" : "Current Affairs"}
//         </motion.h1>
//         <div className="flex items-center gap-3">
//           <LanguageToggle language={language} setLanguage={setLanguage} />
//           <button
//             onClick={() => navigate('/gk&ca-page')}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             Quiz
//           </button>
//         </div>
//       </div>

//       {/* Calendar Filter */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
//       >
//         <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//           >
//             {months.map((month) => (
//               <option key={month.value} value={month.value}>
//                 {language === "Hindi" ? month.hindi : month.label}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//           >
//             {generateYears().map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center justify-center">
//           <button
//             onClick={() => navigateWeek('prev')}
//             className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-4"
//           >
//             <ChevronLeft className="w-5 h-5 text-gray-600" />
//           </button>

//           <div className="flex items-center space-x-4 md:space-x-6">
//             {weekDates.map((date, index) => {
//               const isSelected = date.getDate() === selectedDate &&
//                 date.getMonth() === selectedMonth &&
//                 date.getFullYear() === selectedYear;
//               const isToday = date.toDateString() === new Date().toDateString();
//               const hasData = hasDataForDate(date);

//               return (
//                 <button
//                   key={index}
//                   onClick={() => {
//                     setSelectedDate(date.getDate());
//                     setSelectedMonth(date.getMonth());
//                     setSelectedYear(date.getFullYear());
//                   }}
//                   disabled={!hasData}
//                   className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[50px] relative ${isSelected
//                     ? 'bg-blue-500 text-white'
//                     : isToday
//                       ? 'bg-blue-50 text-blue-600 border border-blue-200'
//                       : hasData
//                         ? 'hover:bg-gray-100 border border-gray-200'
//                         : 'hover:bg-gray-50 opacity-50 cursor-not-allowed'
//                     }`}
//                 >
//                   <span className="text-xs font-medium mb-1">{dayNames[index]}</span>
//                   <span className="text-sm font-semibold">{date.getDate()}</span>
//                   {hasData && !isSelected && (
//                     <div className="absolute -bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           <button
//             onClick={() => navigateWeek('next')}
//             className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-4"
//           >
//             <ChevronRight className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>
//       </motion.div>

//       {/* Loading */}
//       {loading && (
//         <div className="flex flex-col justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading all current affairs data...</p>
//           <p className="text-sm text-gray-500">Fetching from multiple pages...</p>
//         </div>
//       )}

//       {/* Cards Grid */}
//       {!loading && filteredData.length > 0 && (
//         <>
//           <div className="mb-4 text-center">
//             <p className="text-sm text-gray-600">
//               Showing <span className="font-bold">{filteredData.length}</span> items for{' '}
//               <span className="font-bold">
//                 {selectedDate.toString().padStart(2, '0')}-{(selectedMonth + 1).toString().padStart(2, '0')}-{selectedYear}
//               </span>
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {filteredData.map((item, index) => (
//               <motion.div
//                 key={item.id}
//                 className="bg-white border border-black rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.05 }}
//               >
//                 <motion.img
//                   src={item.image || "https://via.placeholder.com/300x200?text=Current+Affairs"}
//                   alt={item.title}
//                   className="w-full h-46 object-cover"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ duration: 0.3 }}
//                 />

//                 <div className="p-3 flex flex-col flex-grow">
//                   <div className="flex justify-between items-start mb-1">
//                     <p className="text-xs text-gray-500 font-medium">
//                       {`${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}`}
//                     </p>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleBookmark(item.id);
//                       }}
//                       disabled={bookmarkLoading === item.id}
//                       className="focus:outline-none"
//                     >
//                       {bookmarkLoading === item.id ? (
//                         <Loader2 className="text-gray-400 w-4 h-4 animate-spin" />
//                       ) : bookmarkedIds.includes(item.id) ? (
//                         <BookmarkCheck className="text-blue-500 w-4 h-4" />
//                       ) : (
//                         <Bookmark className="text-gray-400 w-4 h-4 hover:text-blue-500" />
//                       )}
//                     </button>
//                   </div>

//                   <h2 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">
//                     {language === "Hindi" ? item.title : item.title_english || item.title}
//                   </h2>

//                   <div className="flex justify-between items-center mt-auto pt-2">
//                     <div></div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate("/current-affairs-details", { state: item });
//                       }}
//                       className="text-xs sm:text-sm text-blue-600 py-1 px-2 rounded hover:bg-blue-100 transition-all font-medium"
//                     >
//                       {language === "Hindi" ? "और पढ़ें →" : "Read More →"}
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && filteredData.length === 0 && (
//         <div className="text-center text-gray-600 text-lg mt-8">
//           <div className="text-gray-400 text-6xl mb-4">📰</div>
//           <h3 className="text-xl font-semibold mb-2">
//             {language === "Hindi" ? "इस तारीख के लिए कोई समाचार नहीं" : "No News for This Date"}
//           </h3>
//           <p className="text-gray-500">
//             {language === "Hindi"
//               ? `${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear} के लिए कोई करेंट अफेयर्स उपलब्ध नहीं है।`
//               : `No current affairs available for ${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}.`}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CurrentAffairesPage;


import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentAffairesSlice } from "../../redux/freeTestSlice";
import { getUserCollectionDetailSlice, saveCollectionSlice, removeUserCollectionSlice } from "../../redux/HomeSlice";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { showSuccessToast, showErrorToast } from "../../utils/ToastUtil";

const CurrentAffairesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States
  const [allCurrentAffairsData, setAllCurrentAffairsData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);
  const [language, setLanguage] = useState("Hindi");
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
      if (res.status_code === 200) {
        const newsIds = (res.data.news_id?.data || []).map(item => item.id);
        setBookmarkedIds(newsIds);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  // Fetch ALL pages of current affairs
  const fetchAllCurrentAffairs = async () => {
    try {
      setLoading(true);
      const firstRes = await dispatch(getCurrentAffairesSlice({ page: 1 })).unwrap();

      const firstPageData = firstRes?.data?.original?.data?.data || [];
      const totalPages = firstRes?.data?.original?.data?.last_page || 1;

      let allData = [...firstPageData];

      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(dispatch(getCurrentAffairesSlice({ page })).unwrap());
        }
        const results = await Promise.all(pagePromises);
        results.forEach(res => {
          const pageData = res?.data?.original?.data?.data || [];
          allData = [...allData, ...pageData];
        });
      }

      // Group all data by date
      const groupedByDate = {};
      allData.forEach(item => {
        if (item.date && item.news) {
          if (!groupedByDate[item.date]) {
            groupedByDate[item.date] = [];
          }
          groupedByDate[item.date] = [...groupedByDate[item.date], ...item.news];
        }
      });

      setAllCurrentAffairsData(groupedByDate);

      // Sort dates (newest first)
      const dates = Object.keys(groupedByDate);
      const sortedDates = dates.sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('-').map(Number);
        const [dayB, monthB, yearB] = b.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB - dateA;
      });

      setAvailableDates(sortedDates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching current affairs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCurrentAffairs();
    fetchBookmarks();
  }, []);

  // Toggle bookmark
  const toggleBookmark = async (id) => {
    setBookmarkLoading(id);
    const isCurrentlyBookmarked = bookmarkedIds.includes(id);

    if (isCurrentlyBookmarked) {
      setBookmarkedIds(prev => prev.filter(i => i !== id));
    } else {
      setBookmarkedIds(prev => [...prev, id]);
    }

    try {
      let result;
      if (isCurrentlyBookmarked) {
        result = await dispatch(removeUserCollectionSlice({
          video_id: [], lession_id: [], class_note_id: [], study_note_id: [],
          article_id: [], news_id: [id], question_id: [], test_series_id: [], package_id: []
        })).unwrap();
      } else {
        result = await dispatch(saveCollectionSlice({
          video_id: [], lession_id: [], class_note_id: [], study_note_id: [],
          article_id: [], news_id: [id], question_id: [], test_series_id: [], package_id: []
        })).unwrap();
      }

      if (result.status_code === 200) {
        showSuccessToast(isCurrentlyBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
      } else {
        if (isCurrentlyBookmarked) {
          setBookmarkedIds(prev => [...prev, id]);
        } else {
          setBookmarkedIds(prev => prev.filter(i => i !== id));
        }
        showErrorToast('Failed to update bookmark');
      }
    } catch (error) {
      if (isCurrentlyBookmarked) {
        setBookmarkedIds(prev => [...prev, id]);
      } else {
        setBookmarkedIds(prev => prev.filter(i => i !== id));
      }
      showErrorToast('Something went wrong');
    } finally {
      setBookmarkLoading(null);
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
      years.push(year);
    }
    return years;
  };

  const months = [
    { value: 0, label: "January", hindi: "जनवरी" },
    { value: 1, label: "February", hindi: "फरवरी" },
    { value: 2, label: "March", hindi: "मार्च" },
    { value: 3, label: "April", hindi: "अप्रैल" },
    { value: 4, label: "May", hindi: "मई" },
    { value: 5, label: "June", hindi: "जून" },
    { value: 6, label: "July", hindi: "जुलाई" },
    { value: 7, label: "August", hindi: "अगस्त" },
    { value: 8, label: "September", hindi: "सितंबर" },
    { value: 9, label: "October", hindi: "अक्टूबर" },
    { value: 10, label: "November", hindi: "नवंबर" },
    { value: 11, label: "December", hindi: "दिसंबर" }
  ];

  const getWeekDates = () => {
    const dates = [];
    const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDate);
    const dayOfWeek = selectedDateObj.getDay();
    const startOfWeek = new Date(selectedDateObj);
    startOfWeek.setDate(selectedDate - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const navigateWeek = (direction) => {
    const currentSelectedDate = new Date(selectedYear, selectedMonth, selectedDate);
    const newDate = new Date(currentSelectedDate);
    newDate.setDate(currentSelectedDate.getDate() + (direction === 'next' ? 7 : -7));

    setSelectedDate(newDate.getDate());
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  // Filter data when date changes
  useEffect(() => {
    if (Object.keys(allCurrentAffairsData).length === 0) return;

    const selectedDateStr = `${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}`;
    const newsForDate = allCurrentAffairsData[selectedDateStr] || [];
    setFilteredData(newsForDate);
  }, [selectedDate, selectedMonth, selectedYear, allCurrentAffairsData]);

  const weekDates = getWeekDates();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const hasDataForDate = (date) => {
    const dateStr = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    return availableDates.includes(dateStr);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800"
        >
          {language === "Hindi" ? "करेंट अफेयर्स" : "Current Affairs"}
        </motion.h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <button
            onClick={() => navigate('/gk&ca-page')}
            className="px-3 sm:px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            Quiz
          </button>
        </div>
      </div>

      {/* Calendar Filter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {language === "Hindi" ? month.hindi : month.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {generateYears().map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center overflow-x-auto">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors mr-2 sm:mr-4 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
            {weekDates.map((date, index) => {
              const isSelected = date.getDate() === selectedDate &&
                date.getMonth() === selectedMonth &&
                date.getFullYear() === selectedYear;
              const isToday = date.toDateString() === new Date().toDateString();
              const hasData = hasDataForDate(date);

              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDate(date.getDate());
                    setSelectedMonth(date.getMonth());
                    setSelectedYear(date.getFullYear());
                  }}
                  disabled={!hasData}
                  className={`flex flex-col items-center p-1.5 sm:p-2 rounded-lg transition-colors min-w-[40px] sm:min-w-[50px] relative ${isSelected
                      ? 'bg-blue-500 text-white'
                      : isToday
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : hasData
                          ? 'hover:bg-gray-100 border border-gray-200'
                          : 'hover:bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                >
                  <span className="text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1">{dayNames[index]}</span>
                  <span className="text-xs sm:text-sm font-semibold">{date.getDate()}</span>
                  {hasData && !isSelected && (
                    <div className="absolute -bottom-0.5 sm:-bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigateWeek('next')}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors ml-2 sm:ml-4 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading all current affairs data...</p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filteredData.length > 0 && (
        <>
          <div className="mb-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Showing <span className="font-bold">{filteredData.length}</span> items for{' '}
              <span className="font-bold">
                {selectedDate.toString().padStart(2, '0')}-{(selectedMonth + 1).toString().padStart(2, '0')}-{selectedYear}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredData.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => navigate("/current-affairs-details", { state: item })}
              >
                {/* ✅ Image container with fixed aspect ratio */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                  <motion.img
                    src={item.image || "https://via.placeholder.com/400x250?text=Current+Affairs"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    loading="lazy"
                  />
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-500 font-medium">
                      {`${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}`}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item.id);
                      }}
                      disabled={bookmarkLoading === item.id}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      {bookmarkLoading === item.id ? (
                        <Loader2 className="text-gray-400 w-5 h-5 animate-spin" />
                      ) : bookmarkedIds.includes(item.id) ? (
                        <BookmarkCheck className="text-blue-500 w-5 h-5" />
                      ) : (
                        <Bookmark className="text-gray-400 w-5 h-5 hover:text-blue-500" />
                      )}
                    </button>
                  </div>

                  <h2 className="font-semibold text-sm sm:text-base mb-2 line-clamp-3 text-gray-800">
                    {language === "Hindi" ? item.title : item.title_english || item.title}
                  </h2>

                  <div className="flex justify-end items-center mt-auto pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/current-affairs-details", { state: item });
                      }}
                      className="text-sm text-blue-600 py-1.5 px-3 rounded-lg hover:bg-blue-50 transition-all font-medium flex items-center gap-1"
                    >
                      {language === "Hindi" ? "और पढ़ें" : "Read More"}
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && filteredData.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📰</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            {language === "Hindi" ? "इस तारीख के लिए कोई समाचार नहीं" : "No News for This Date"}
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            {language === "Hindi"
              ? `${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear} के लिए कोई करेंट अफेयर्स उपलब्ध नहीं है।`
              : `No current affairs available for ${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrentAffairesPage;
