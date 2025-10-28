// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { getCurrentAffairesSlice } from "../../redux/freeTestSlice";
// import { useNavigate } from "react-router-dom";
// import LanguageToggle from "../../components/LanguageToggle";
// import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight } from "lucide-react";
// import { motion } from "framer-motion";

// const CurrentAffairesPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ✅ Separate states for ALL data and FILTERED data
//   const [allCurrentAffairsData, setAllCurrentAffairsData] = useState([]); // All data from API
//   const [filteredData, setFilteredData] = useState([]); // Filtered by date
//   const [availableDates, setAvailableDates] = useState([]); // All available dates

//   const [bookmarkedIds, setBookmarkedIds] = useState([]);
//   const [language, setLanguage] = useState("Hindi");
//   const [loading, setLoading] = useState(false);

//   // Calendar states
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedDate, setSelectedDate] = useState(new Date().getDate());

//   // Load bookmarks from localStorage
//   useEffect(() => {
//     const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
//     setBookmarkedIds(savedBookmarks);
//   }, []);


//   const fetchAllCurrentAffairs = async () => {
//   try {
//     setLoading(true);
//     console.log('🔄 Fetching all current affairs data...');

//     const firstRes = await dispatch(getCurrentAffairesSlice()).unwrap();
//     console.log('✅ Raw response:', firstRes);

//     const apiData = firstRes?.data || {};
//     console.log('📊 Total data fetched:', apiData);

//     // ✅ Flatten the grouped object
//     const flattenedData = Object.entries(apiData).flatMap(([date, items]) =>
//       items.map(item => ({
//         ...item,
//         formatted_date: date, // ensure each item has the formatted_date key
//       }))
//     );

//     console.log('✅ Flattened data:', flattenedData);

//     setAllCurrentAffairsData(flattenedData);

//     // ✅ Extract all unique available dates
//     const dates = Object.keys(apiData);
//     const sortedDates = dates.sort((a, b) => {
//       const da = new Date(a.split('-').reverse().join('-'));
//       const db = new Date(b.split('-').reverse().join('-'));
//       return db - da;
//     });

//     setAvailableDates(sortedDates);
//     console.log('📅 Available dates:', sortedDates);

//     setLoading(false);
//   } catch (error) {
//     console.error('❌ Error fetching current affairs:', error);
//     setLoading(false);
//   }
// };

//   // ✅ Fetch all data on mount
//   useEffect(() => {
//     fetchAllCurrentAffairs();
//   }, []);

//   // Generate years array (last 5 years and next 2 years)
//   const generateYears = () => {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let year = currentYear - 5; year <= currentYear + 2; year++) {
//       years.push(year);
//     }
//     return years;
//   };

//   // Generate months array
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

//   // Generate week dates
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

//   // Navigate week
//   const navigateWeek = (direction) => {
//     const currentSelectedDate = new Date(selectedYear, selectedMonth, selectedDate);
//     const newDate = new Date(currentSelectedDate);
//     newDate.setDate(currentSelectedDate.getDate() + (direction === 'next' ? 7 : -7));

//     setSelectedDate(newDate.getDate());
//     setSelectedMonth(newDate.getMonth());
//     setSelectedYear(newDate.getFullYear());
//   };

//   // ✅ Filter data based on selected date (DD-MM-YYYY format)
//   useEffect(() => {
//     if (allCurrentAffairsData.length === 0) return;

//     const selectedDateStr = `${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}`;
//     console.log('🔍 Selected date string:', selectedDateStr);
// const filtered = allCurrentAffairsData.filter(item => item.formatted_date === selectedDateStr);



//     console.log('🔍 Filtered results for', selectedDateStr, ':', filtered.length);
//     setFilteredData(filtered);
//     // setCurrentPage(1); 
//   }, [selectedDate, selectedMonth, selectedYear, allCurrentAffairsData]);


//   // ✅ Toggle bookmark
//   const toggleBookmark = (id) => {
//     let updated = [];
//     if (bookmarkedIds.includes(id)) {
//       updated = bookmarkedIds.filter((i) => i !== id);
//     } else {
//       updated = [...bookmarkedIds, id];
//     }
//     setBookmarkedIds(updated);
//     localStorage.setItem("bookmarks", JSON.stringify(updated));
//   };

//   // ✅ Pagination handlers for filtered data
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalFilteredPages && page !== currentPage) {
//       console.log('📄 Changing to page:', page);
//       setCurrentPage(page);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handlePreviousPage = (e) => {
//     e.preventDefault();
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleNextPage = (e) => {
//     e.preventDefault();
//     if (currentPage < totalFilteredPages) {
//       setCurrentPage(currentPage + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   // ✅ Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;

//     if (totalFilteredPages <= maxVisible) {
//       for (let i = 1; i <= totalFilteredPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) {
//           pages.push(i);
//         }
//         pages.push('...');
//         pages.push(totalFilteredPages);
//       } else if (currentPage >= totalFilteredPages - 2) {
//         pages.push(1);
//         pages.push('...');
//         for (let i = totalFilteredPages - 3; i <= totalFilteredPages; i++) {
//           pages.push(i);
//         }
//       } else {
//         pages.push(1);
//         pages.push('...');
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//           pages.push(i);
//         }
//         pages.push('...');
//         pages.push(totalFilteredPages);
//       }
//     }

//     return pages;
//   };

//   const weekDates = getWeekDates();
//   const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//   // ✅ Check if a date has data
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


//       {/* Calendar Filter Section */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
//       >
//         {/* Month and Year Dropdowns */}
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

//         {/* Horizontal Date Navigation */}
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
//                   className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[50px] relative ${isSelected
//                       ? 'bg-blue-500 text-white'
//                       : isToday
//                         ? 'bg-blue-50 text-blue-600 border border-blue-200'
//                         : hasData
//                           ? 'hover:bg-gray-100 border border-gray-200'
//                           : 'hover:bg-gray-50 opacity-50 cursor-not-allowed'
//                     }`}
//                 >
//                   <span className="text-xs font-medium mb-1">
//                     {dayNames[index]}
//                   </span>
//                   <span className="text-sm font-semibold">
//                     {date.getDate()}
//                   </span>
//                   {hasData && !isSelected && (
//                     <div className="absolute -bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>
//                   )}
//                   {isToday && !isSelected && (
//                     <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>
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


//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="ml-4 text-gray-600">Loading current affairs...</p>
//         </div>
//       )}

//       {/* ✅ Cards Grid - Show filtered and paginated data */}
//    {!loading && filteredData.length > 0 && (
//   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//     {filteredData.map((item,index) => (
//             <motion.div
//               key={item.id}
//               className="bg-white border border-black rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <motion.img
//                 src={item.image || "https://via.placeholder.com/300x200?text=Current+Affairs"}
//                 alt={item.title}
//                 className="w-full h-32 object-cover"
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ duration: 0.3 }}
//               />

//               <div className="p-3 flex flex-col flex-grow">
//                 <div className="flex justify-between items-start mb-1">
//                   {/* ✅ Display formatted_date */}
//                   <p className="text-xs text-gray-500 font-medium">
//                     {item.formatted_date}
//                   </p>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleBookmark(item.id);
//                     }}
//                     className="focus:outline-none"
//                   >
//                     {bookmarkedIds.includes(item.id) ? (
//                       <BookmarkCheck className="text-blue-500 w-4 h-4" />
//                     ) : (
//                       <Bookmark className="text-gray-400 w-4 h-4 hover:text-blue-500" />
//                     )}
//                   </button>
//                 </div>

//                 <h2 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">
//                   {language === "Hindi" ? item.title : item.title_english || item.title}
//                 </h2>

//                 <div className="flex justify-between items-center mt-auto pt-2">
//                   <div></div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       navigate("/current-affairs-details", { state: item });
//                     }}
//                     className="text-xs sm:text-sm text-blue-600 py-1 px-2 rounded hover:bg-blue-100 transition-all font-medium"
//                   >
//                     {language === "Hindi" ? "और पढ़ें →" : "Read More →"}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
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



// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { getCurrentAffairesSlice } from "../../redux/freeTestSlice";
// import { getUserCollectionDetailSlice, saveCollectionSlice, removeUserCollectionSlice } from "../../redux/HomeSlice"; // ✅ Import bookmark actions
// import { useNavigate } from "react-router-dom";
// import LanguageToggle from "../../components/LanguageToggle";
// import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { showSuccessToast, showErrorToast } from "../../utils/ToastUtil";

// const CurrentAffairesPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [allCurrentAffairsData, setAllCurrentAffairsData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [availableDates, setAvailableDates] = useState([]);

//   const [bookmarkedIds, setBookmarkedIds] = useState([]);
//   const [bookmarkLoading, setBookmarkLoading] = useState(null); // ✅ Track loading per item
//   const [language, setLanguage] = useState("Hindi");
//   const [loading, setLoading] = useState(false);

//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedDate, setSelectedDate] = useState(new Date().getDate());

//   // ✅ Fetch bookmarks from API
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

//   // ✅ Fetch all current affairs
//   const fetchAllCurrentAffairs = async () => {
//     try {
//       setLoading(true);
//       const firstRes = await dispatch(getCurrentAffairesSlice()).unwrap();
//       const apiData = firstRes?.data || {};

//       const flattenedData = Object.entries(apiData).flatMap(([date, items]) =>
//         items.map(item => ({
//           ...item,
//           formatted_date: date,
//         }))
//       );

//       setAllCurrentAffairsData(flattenedData);

//       const dates = Object.keys(apiData);
//       const sortedDates = dates.sort((a, b) => {
//         const da = new Date(a.split('-').reverse().join('-'));
//         const db = new Date(b.split('-').reverse().join('-'));
//         return db - da;
//       });

//       setAvailableDates(sortedDates);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching current affairs:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllCurrentAffairs();
//     fetchBookmarks(); // ✅ Fetch bookmarks on mount
//   }, []);

//   // ✅ Toggle bookmark with API
//   const toggleBookmark = async (id) => {
//     setBookmarkLoading(id);
//     const isCurrentlyBookmarked = bookmarkedIds.includes(id);

//     // Optimistic update
//     if (isCurrentlyBookmarked) {
//       setBookmarkedIds(prev => prev.filter(i => i !== id));
//     } else {
//       setBookmarkedIds(prev => [...prev, id]);
//     }

//     try {
//       let result;
//       if (isCurrentlyBookmarked) {
//         // Remove bookmark
//         result = await dispatch(removeUserCollectionSlice({
//           video_id: [],
//           lession_id: [],
//           class_note_id: [],
//           study_note_id: [],
//           article_id: [],
//           news_id: [id], // ✅ Current Affairs = news_id
//           question_id: [],
//           test_series_id: [],
//           package_id: []
//         })).unwrap();
//       } else {
//         // Add bookmark
//         result = await dispatch(saveCollectionSlice({
//           video_id: [],
//           lession_id: [],
//           class_note_id: [],
//           study_note_id: [],
//           article_id: [],
//           news_id: [id], // ✅ Current Affairs = news_id
//           question_id: [],
//           test_series_id: [],
//           package_id: []
//         })).unwrap();
//       }

//       if (result.status_code === 200) {
//         showSuccessToast(isCurrentlyBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
//       } else {
//         // Revert on failure
//         if (isCurrentlyBookmarked) {
//           setBookmarkedIds(prev => [...prev, id]);
//         } else {
//           setBookmarkedIds(prev => prev.filter(i => i !== id));
//         }
//         showErrorToast('Failed to update bookmark');
//       }
//     } catch (error) {
//       console.error('Bookmark error:', error);
//       // Revert on error
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

//   // Generate years
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

//   useEffect(() => {
//     if (allCurrentAffairsData.length === 0) return;

//     const selectedDateStr = `${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}`;
//     const filtered = allCurrentAffairsData.filter(item => item.formatted_date === selectedDateStr);
//     setFilteredData(filtered);
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
//                   className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[50px] relative ${
//                     isSelected
//                       ? 'bg-blue-500 text-white'
//                       : isToday
//                         ? 'bg-blue-50 text-blue-600 border border-blue-200'
//                         : hasData
//                           ? 'hover:bg-gray-100 border border-gray-200'
//                           : 'hover:bg-gray-50 opacity-50 cursor-not-allowed'
//                   }`}
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
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="ml-4 text-gray-600">Loading current affairs...</p>
//         </div>
//       )}

//       {/* Cards Grid */}
//       {!loading && filteredData.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {filteredData.map((item, index) => (
//             <motion.div
//               key={item.id}
//               className="bg-white border border-black rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <motion.img
//                 src={item.image || "https://via.placeholder.com/300x200?text=Current+Affairs"}
//                 alt={item.title}
//                 className="w-full h-32 object-cover"
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ duration: 0.3 }}
//               />

//               <div className="p-3 flex flex-col flex-grow">
//                 <div className="flex justify-between items-start mb-1">
//                   <p className="text-xs text-gray-500 font-medium">
//                     {item.formatted_date}
//                   </p>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleBookmark(item.id);
//                     }}
//                     disabled={bookmarkLoading === item.id}
//                     className="focus:outline-none"
//                   >
//                     {bookmarkLoading === item.id ? (
//                       <Loader2 className="text-gray-400 w-4 h-4 animate-spin" />
//                     ) : bookmarkedIds.includes(item.id) ? (
//                       <BookmarkCheck className="text-blue-500 w-4 h-4" />
//                     ) : (
//                       <Bookmark className="text-gray-400 w-4 h-4 hover:text-blue-500" />
//                     )}
//                   </button>
//                 </div>

//                 <h2 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">
//                   {language === "Hindi" ? item.title : item.title_english || item.title}
//                 </h2>

//                 <div className="flex justify-between items-center mt-auto pt-2">
//                   <div></div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       navigate("/current-affairs-details", { state: item });
//                     }}
//                     className="text-xs sm:text-sm text-blue-600 py-1 px-2 rounded hover:bg-blue-100 transition-all font-medium"
//                   >
//                     {language === "Hindi" ? "और पढ़ें →" : "Read More →"}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
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

  // ✅ Store ALL data grouped by date
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

  // ✅ Fetch bookmarks
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

  // ✅ Fetch ALL pages of current affairs
  const fetchAllCurrentAffairs = async () => {
    try {
      setLoading(true);

      // ✅ Fetch first page to get total pages
      const firstRes = await dispatch(getCurrentAffairesSlice({ page: 1 })).unwrap();

      console.log('✅ First page response:', firstRes);

      const firstPageData = firstRes?.data?.original?.data?.data || [];
      const totalPages = firstRes?.data?.original?.data?.last_page || 1;

      console.log('📊 Total pages:', totalPages);

      // ✅ Store first page data
      let allData = [...firstPageData];

      // ✅ Fetch remaining pages
      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(
            dispatch(getCurrentAffairesSlice({ page })).unwrap()
          );
        }

        // ✅ Wait for all pages
        const results = await Promise.all(pagePromises);

        results.forEach(res => {
          const pageData = res?.data?.original?.data?.data || [];
          allData = [...allData, ...pageData];
        });
      }

      console.log('📦 Total items fetched:', allData.length);

      // ✅ Group all data by date
      const groupedByDate = {};
      allData.forEach(item => {
        if (item.date && item.news) {
          if (!groupedByDate[item.date]) {
            groupedByDate[item.date] = [];
          }
          groupedByDate[item.date] = [...groupedByDate[item.date], ...item.news];
        }
      });

      console.log('📅 Grouped by date:', groupedByDate);
      console.log('📅 Available dates:', Object.keys(groupedByDate));

      setAllCurrentAffairsData(groupedByDate);

      // ✅ Sort dates (newest first)
      const dates = Object.keys(groupedByDate);
      const sortedDates = dates.sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('-').map(Number);
        const [dayB, monthB, yearB] = b.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB - dateA;
      });

      setAvailableDates(sortedDates);
      console.log('📅 Sorted dates:', sortedDates);

      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching current affairs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCurrentAffairs();
    fetchBookmarks();
  }, []);

  // ✅ Toggle bookmark
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
          video_id: [],
          lession_id: [],
          class_note_id: [],
          study_note_id: [],
          article_id: [],
          news_id: [id],
          question_id: [],
          test_series_id: [],
          package_id: []
        })).unwrap();
      } else {
        result = await dispatch(saveCollectionSlice({
          video_id: [],
          lession_id: [],
          class_note_id: [],
          study_note_id: [],
          article_id: [],
          news_id: [id],
          question_id: [],
          test_series_id: [],
          package_id: []
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
      console.error('Bookmark error:', error);
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

  // ✅ Filter data when date changes
  useEffect(() => {
    if (Object.keys(allCurrentAffairsData).length === 0) return;

    const selectedDateStr = `${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}`;

    console.log('🔍 Looking for date:', selectedDateStr);
    console.log('📦 Available dates:', Object.keys(allCurrentAffairsData));

    const newsForDate = allCurrentAffairsData[selectedDateStr] || [];

    console.log('📰 News found for', selectedDateStr, ':', newsForDate.length, 'items');

    setFilteredData(newsForDate);
  }, [selectedDate, selectedMonth, selectedYear, allCurrentAffairsData]);

  const weekDates = getWeekDates();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const hasDataForDate = (date) => {
    const dateStr = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    return availableDates.includes(dateStr);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-2 py-6 sm:px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800"
        >
          {language === "Hindi" ? "करेंट अफेयर्स" : "Current Affairs"}
        </motion.h1>
        <div className="flex items-center gap-3">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <button
            onClick={() => navigate('/gk&ca-page')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {generateYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-4"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-4 md:space-x-6">
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
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[50px] relative ${isSelected
                    ? 'bg-blue-500 text-white'
                    : isToday
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : hasData
                        ? 'hover:bg-gray-100 border border-gray-200'
                        : 'hover:bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                >
                  <span className="text-xs font-medium mb-1">{dayNames[index]}</span>
                  <span className="text-sm font-semibold">{date.getDate()}</span>
                  {hasData && !isSelected && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-4"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading all current affairs data...</p>
          <p className="text-sm text-gray-500">Fetching from multiple pages...</p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filteredData.length > 0 && (
        <>
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{filteredData.length}</span> items for{' '}
              <span className="font-bold">
                {selectedDate.toString().padStart(2, '0')}-{(selectedMonth + 1).toString().padStart(2, '0')}-{selectedYear}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredData.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-white border border-black rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <motion.img
                  src={item.image || "https://via.placeholder.com/300x200?text=Current+Affairs"}
                  alt={item.title}
                  className="w-full h-46 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="p-3 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-gray-500 font-medium">
                      {`${selectedDate.toString().padStart(2, '0')}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedYear}`}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item.id);
                      }}
                      disabled={bookmarkLoading === item.id}
                      className="focus:outline-none"
                    >
                      {bookmarkLoading === item.id ? (
                        <Loader2 className="text-gray-400 w-4 h-4 animate-spin" />
                      ) : bookmarkedIds.includes(item.id) ? (
                        <BookmarkCheck className="text-blue-500 w-4 h-4" />
                      ) : (
                        <Bookmark className="text-gray-400 w-4 h-4 hover:text-blue-500" />
                      )}
                    </button>
                  </div>

                  <h2 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">
                    {language === "Hindi" ? item.title : item.title_english || item.title}
                  </h2>

                  <div className="flex justify-between items-center mt-auto pt-2">
                    <div></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/current-affairs-details", { state: item });
                      }}
                      className="text-xs sm:text-sm text-blue-600 py-1 px-2 rounded hover:bg-blue-100 transition-all font-medium"
                    >
                      {language === "Hindi" ? "और पढ़ें →" : "Read More →"}
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
        <div className="text-center text-gray-600 text-lg mt-8">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold mb-2">
            {language === "Hindi" ? "इस तारीख के लिए कोई समाचार नहीं" : "No News for This Date"}
          </h3>
          <p className="text-gray-500">
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
