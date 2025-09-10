import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentAffairesSlice } from "../../redux/freeTestSlice";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion"; // ✅ import framer-motion

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

    // Share function
    const handleShare = (item) => {
        const url = `${window.location.origin}/current-affairs/${item.slug}`;
        if (navigator.share) {
            navigator
                .share({
                    title: item.title,
                    text: "Check this Current Affairs update",
                    url,
                })
                .catch((err) => console.log("Share failed:", err));
        } else {
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Current Affairs</h1>
                <div className="flex items-center gap-2">
                    <div className="p-4">
                        <LanguageToggle language={language} setLanguage={setLanguage} />
                        <h1 className="mt-6 text-xl font-bold">
                            {language === "Hindi" ? "करेंट अफेयर्स" : "Current Affairs"}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAffairsData.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between cursor-pointer"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, boxShadow: "0px 8px 24px rgba(0,0,0,0.15)" }}
                    >
                        {/* Image */}
                        <motion.img
                            src={item.image || "https://via.placeholder.com/600x300?text=Current+Affairs"}
                            alt={item.title}
                            className="rounded-xl mb-3 h-80 w-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Date */}
                        <p className="text-sm text-gray-500 mb-1">
                            Date:{" "}
                            {item.created_at
                                ? new Date(item.created_at).toLocaleDateString("en-GB")
                                : "N/A"}
                        </p>

                        {/* Title */}
                        <h2 className="font-semibold text-lg mb-2">
                            {language === "Hindi"
                                ? item.title
                                : item.title_english || item.title}
                        </h2>

                        {/* Description */}
                        <p
                            className="text-gray-600 text-sm mb-3 line-clamp-3"
                            dangerouslySetInnerHTML={{
                                __html:
                                    language === "Hindi"
                                        ? item.short_description_hindi || "No description available"
                                        : item.short_description_english ||
                                          item.short_description_hindi ||
                                          "No description available",
                            }}
                        />

                        {/* Footer Actions */}
                        <div className="flex justify-between items-center mt-auto pt-3 border-t">
                            <button
                                className="text-sm text-green-600 hover:underline"
                                onClick={() => handleShare(item)}
                            >
                                Share
                            </button>
                            <button
                                className="text-sm text-white bg-blue-500 py-2 px-6 rounded-md hover:bg-blue-600 transition-all"
                                onClick={() => navigate("/current-affairs-details", { state: item })}
                            >
                                Read More →
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CurrentAffairesPage;
