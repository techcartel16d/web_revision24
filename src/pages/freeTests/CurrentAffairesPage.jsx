import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentAffairesSlice } from "../../redux/freeTestSlice";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const CurrentAffairesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentAffairsData, setCurrentAffairsData] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [language, setLanguage] = useState("Hindi");

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarkedIds(savedBookmarks);
  }, []);

  const fetchCurrentAffairs = async () => {
    const res = await dispatch(getCurrentAffairesSlice()).unwrap();
    setCurrentAffairsData(res.data.data || []);
  };

  useEffect(() => {
    fetchCurrentAffairs();
  }, []);

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
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentAffairsData.map((item, index) => (
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
                {/* <button
                  onClick={() => handleShare(item)}
                  className="flex items-center gap-1 text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" /> Share
                </button> */}
                <div>
                    
                </div>
                <button
                  onClick={() => navigate("/current-affairs-details", { state: item })}
                  className="text-xs sm:text-sm text-blue-600 py-1 px-2 rounded hover:bg-blue-100 transition-all font-medium"
                >
                  Read More →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {currentAffairsData.length === 0 && (
        <div className="text-center text-gray-600 text-lg mt-8">No current affairs available.</div>
      )}
    </div>
  );
};

export default CurrentAffairesPage;