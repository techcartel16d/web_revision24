import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { motion, AnimatePresence } from "framer-motion";
import { getMonthlymagazine } from "../../redux/magzinesMonthle";

const Allmaganizes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [magazines, setMagazines] = useState({ Hindi: [], English: [] });
    const [language, setLanguage] = useState("English");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // PDF Viewer States
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await dispatch(getMonthlymagazine()).unwrap();
            setMagazines(res || { Hindi: [], English: [] });
        } catch (error) {
            console.error("Failed to fetch magazines:", error);
            setError("Failed to load magazines. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleViewPdf = (pdfUrl, title) => {
        setSelectedPdf({ url: pdfUrl, title });
        setIsModalOpen(true);
    };

    const closePdfViewer = () => {
        setSelectedPdf(null);
        setIsModalOpen(false);
    };

    const currentMagazines = magazines[language] || [];

    // Loading state
    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading magazines...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 text-5xl mb-4">📚</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={getData}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Simple Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {language === "Hindi"
                                    ? "करेंट अफेयर्स पत्रिकाएँ"
                                    : "Current Affairs Magazines"}
                            </h1>
                            <p className="text-gray-600">
                                {language === "Hindi"
                                    ? "नवीनतम करेंट अफेयर्स से अपडेट रहें"
                                    : "Stay updated with latest current affairs"}
                            </p>
                        </div>
                        <LanguageToggle language={language} setLanguage={setLanguage} />
                    </div>
                    
                    {/* Simple Stats */}
                    {currentMagazines.length > 0 && (
                        <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <span>{currentMagazines.length} magazines available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span>Free access</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Magazines Grid */}
                {currentMagazines && currentMagazines.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" >
                        {currentMagazines.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                                style={{border:'0.3px solid #999'}}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.cover_image}
                                        alt={item.title}
                                        className="w-full h-75 object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3 text-sm line-clamp-2 leading-relaxed">
                                        {item.title}
                                    </h3>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewPdf(item.file_path, item.title)}
                                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Read
                                        </button>
                                        
                                        <button
                                            onClick={() => window.open(item.file_path, "_blank")}
                                            className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors border"
                                            title="Download"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4 text-gray-400">📚</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {language === "Hindi"
                                ? "कोई पत्रिकाएँ उपलब्ध नहीं हैं"
                                : "No magazines available"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {language === "Hindi"
                                ? "नई पत्रिकाएँ जल्द ही आएंगी"
                                : "New magazines will be available soon"}
                        </p>
                        <button 
                            onClick={getData}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {language === "Hindi" ? "रिफ्रेश करें" : "Refresh"}
                        </button>
                    </div>
                )}
            </div>

            {/* Clean PDF Viewer Modal */}
            <AnimatePresence>
                {isModalOpen && selectedPdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
                        onClick={closePdfViewer}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-lg overflow-hidden w-full max-w-6xl h-full max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                                <h3 className="text-lg font-semibold text-gray-900 truncate max-w-lg">
                                    {selectedPdf.title}
                                </h3>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.open(selectedPdf.url, "_blank")}
                                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download
                                    </button>

                                    <button
                                        onClick={() => window.open(selectedPdf.url, "_blank")}
                                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Open
                                    </button>

                                    <button
                                        onClick={closePdfViewer}
                                        className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* PDF Viewer */}
                            <div className="flex-1 bg-gray-100">
                                <iframe
                                    src={selectedPdf.url}
                                    className="w-full h-full border-0"
                                    title={selectedPdf.title}
                                    loading="lazy"
                                    onError={(e) => {
                                        console.log("Native iframe failed, trying Google Docs viewer");
                                        e.target.src = `https://docs.google.com/viewer?url=${encodeURIComponent(
                                            selectedPdf.url
                                        )}&embedded=true`;
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Allmaganizes;
