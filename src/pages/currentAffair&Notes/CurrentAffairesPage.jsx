import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentAffairesSlice } from "../../redux/freeTestSlice";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { Bookmark, BookmarkCheck, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const CurrentAffairesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentAffairsData, setCurrentAffairsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [language, setLanguage] = useState("Hindi");

  // Calendar states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarkedIds(savedBookmarks);
  }, []);

  const fetchCurrentAffairs = async () => {
    const res = await dispatch(getCurrentAffairesSlice()).unwrap();
    const data = res.data.data || [];
    setCurrentAffairsData(data);
    setFilteredData(data);
  };

  useEffect(() => {
    fetchCurrentAffairs();
  }, []);

  // Generate years array (last 5 years and next 2 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
      years.push(year);
    }
    return years;
  };

  // Generate months array
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

  // Generate week dates
  const getWeekDates = () => {
    const dates = [];
    const startDate = new Date(selectedYear, selectedMonth, 1);
    
    // Find the first day of the month
    const firstDay = new Date(startDate);
    
    // Calculate start of the week containing the selected date
    const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDate);
    const dayOfWeek = selectedDateObj.getDay();
    const startOfWeek = new Date(selectedDateObj);
    startOfWeek.setDate(selectedDate - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start from Monday

    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Navigate week
  const navigateWeek = (direction) => {
    const currentSelectedDate = new Date(selectedYear, selectedMonth, selectedDate);
    const newDate = new Date(currentSelectedDate);
    newDate.setDate(currentSelectedDate.getDate() + (direction === 'next' ? 7 : -7));
    
    setSelectedDate(newDate.getDate());
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  // Filter data based on selected date
  useEffect(() => {
    const filtered = currentAffairsData.filter(item => {
      if (!item.created_at) return false;
      
      const itemDate = new Date(item.created_at);
      const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDate);
      
      return (
        itemDate.getDate() === selectedDateObj.getDate() &&
        itemDate.getMonth() === selectedDateObj.getMonth() &&
        itemDate.getFullYear() === selectedDateObj.getFullYear()
      );
    });
    
    setFilteredData(filtered);
  }, [selectedDate, selectedMonth, selectedYear, currentAffairsData]);

  const toggleBookmark = (id) => {
    let updated = [];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((i) => i !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const handleShare = (item) => {
    const url = `${window.location.origin}/current-affairs/${item.slug}`;
    if (navigator.share) {
      navigator
        .share({ title: item.title, text: "Check this Current Affairs update", url })
        .catch((err) => console.log("Share failed:", err));
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const weekDates = getWeekDates();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

      {/* Calendar Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
      >
        {/* Month and Year Dropdowns */}
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

        {/* Horizontal Date Navigation */}
        <div className="flex items-center justify-center">
          {/* Previous Week Button */}
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-4"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Week Days */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {weekDates.map((date, index) => {
              const isSelected = date.getDate() === selectedDate &&
                               date.getMonth() === selectedMonth &&
                               date.getFullYear() === selectedYear;
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDate(date.getDate());
                    setSelectedMonth(date.getMonth());
                    setSelectedYear(date.getFullYear());
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[50px] ${
                    isSelected 
                      ? 'bg-blue-500 text-white' 
                      : isToday 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xs font-medium mb-1">
                    {dayNames[index]}
                  </span>
                  <span className="text-sm font-semibold">
                    {date.getDate()}
                  </span>
                  {isToday && !isSelected && (
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Week Button */}
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-4"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Results Summary */}
      {/* <div className="mb-4 text-sm text-gray-600 text-center">
        {language === "Hindi" 
          ? `${new Date(selectedYear, selectedMonth, selectedDate).toLocaleDateString('hi-IN')} के लिए ${filteredData.length} परिणाम मिले` 
          : `${filteredData.length} results found for ${new Date(selectedYear, selectedMonth, selectedDate).toLocaleDateString('en-GB')}`}
      </div> */}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.map((item, index) => (
          <motion.div
            key={item.id}
            className="bg-white border border-black rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Image */}
            <motion.img
              src={item.image || "https://via.placeholder.com/300x200?text=Current+Affairs"}
              alt={item.title}
              className="w-full h-32 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div className="p-3 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs text-gray-500">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString("en-GB")
                    : "N/A"}
                </p>
                <button onClick={() => toggleBookmark(item.id)} className="focus:outline-none">
                  {bookmarkedIds.includes(item.id) ? (
                    <BookmarkCheck className="text-blue-500 w-4 h-4" />
                  ) : (
                    <Bookmark className="text-gray-400 w-4 h-4 hover:text-blue-500" />
                  )}
                </button>
              </div>

              <h2 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">
                {language === "Hindi" ? item.title : item.title_english || item.title}
              </h2>

              {/* Footer Actions */}
              <div className="flex justify-between items-center mt-auto pt-2">
                <div></div>
                <button
                  onClick={() => navigate("/current-affairs-details", { state: item })}
                  className="text-xs sm:text-sm text-blue-600 py-1 px-2 rounded hover:bg-blue-100 transition-all font-medium"
                >
                  {language === "Hindi" ? "और पढ़ें →" : "Read More →"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center text-gray-600 text-lg mt-8">
          {language === "Hindi" 
            ? `चयनित तारीख के लिए कोई करेंट अफेयर्स उपलब्ध नहीं है।` 
            : `No current affairs available for selected date.`}
        </div>
      )}
    </div>
  );
};

export default CurrentAffairesPage;
