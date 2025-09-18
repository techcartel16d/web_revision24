import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { motion } from "framer-motion";

const Allmaganizes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentAffairsData, setCurrentAffairsData] = useState([]);
    const [language, setLanguage] = useState("Hindi");

  // Dummy data with real images
const dummyMagazines = [
  {
    id: 1,
    title: "जनवरी 2025 करंट अफेयर्स पत्रिका",
    title_english: "January 2025 Current Affairs Magazine",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Newsroom image
    created_at: "2025-01-15",
  },
  {
    id: 2,
    title: "फ़रवरी 2025 करंट अफेयर्स पत्रिका",
    title_english: "February 2025 Current Affairs Magazine",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Magazine stack image
    created_at: "2025-02-10",
  },
  {
    id: 3,
    title: "मार्च 2025 करंट अफेयर्स पत्रिका",
    title_english: "March 2025 Current Affairs Magazine",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Newspaper image
    created_at: "2025-03-12",
  },
];

    useEffect(() => {
        // Dummy data load
        setCurrentAffairsData(dummyMagazines);
    }, []);

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
                    {language === "Hindi" ? "करेंट अफेयर्स पत्रिकाएँ" : "Current Affairs Magazines"}
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
                            src={item.image}
                            alt={item.title}
                            className="w-full h-100 object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Content */}
                        <div className="p-3 flex flex-col flex-grow">
                            <h2 className="font-semibold text-sm sm:text-base line-clamp-2">
                                {language === "Hindi" ? item.title : item.title_english || item.title}
                            </h2>

                            {/* Footer Actions */}
                            <div className="flex justify-end items-center mt-auto">
                                <button
                                    onClick={() => navigate("/", { state: item })}
                                    className="text-xs sm:text-sm text-blue-600 py-1 px-2 rounded bg-blue-100 transition-all font-medium"
                                >
                                    Open →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {currentAffairsData.length === 0 && (
                <div className="text-center text-gray-600 text-lg mt-8">
                    No करेंट अफेयर्स पत्रिकाएँ available.
                </div>
            )}
        </div>
    );
};

export default Allmaganizes;
