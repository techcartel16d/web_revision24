import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { motion, AnimatePresence } from "framer-motion";
import { getMonthlymagazine } from "../../redux/magzinesMonthle";

const Allmaganizes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentAffairsData, setCurrentAffairsData] = useState([]);
    const [language, setLanguage] = useState("Hindi");
    
    // ✅ Simple PDF Viewer States
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getData = async () => {
        try {
            const res = await dispatch(getMonthlymagazine()).unwrap();
            // console.log('on screen res', res.data);
            setCurrentAffairsData(res.data);
        } catch (error) {
            console.error('Failed to fetch magazines:', error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    // ✅ Handle PDF View with iframe
    const handleViewPdf = (pdfUrl, title) => {
        setSelectedPdf({ url: pdfUrl, title });
        setIsModalOpen(true);
    };

    // ✅ Close PDF Viewer
    const closePdfViewer = () => {
        setSelectedPdf(null);
        setIsModalOpen(false);
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
                    {language === "Hindi" ? "करेंट अफेयर्स पत्रिकाएँ" : "Current Affairs Magazines"}
                </motion.h1>
                <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentAffairsData && currentAffairsData.length > 0 ? (
                    currentAffairsData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Image */}
                            <motion.img
                                src={item.cover_image}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h2 className="font-semibold text-sm sm:text-base line-clamp-2 mb-4">
                                    {language === "Hindi" ? item.title : item.title_english || item.title}
                                </h2>

                                {/* Footer Actions */}
                                <div className="flex gap-2 mt-auto">
                                    {/* ✅ View PDF Button */}
                                    <button
                                        onClick={() => handleViewPdf(
                                            item.file_path, 
                                            language === "Hindi" ? item.title : item.title_english || item.title
                                        )}
                                        className="flex-1 text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded transition-all font-medium flex items-center justify-center gap-1"
                                    >
                                        📖 View PDF
                                    </button>

                                    {/* ✅ Download Button */}
                                    <button
                                        onClick={() => window.open(item.file_path, "_blank")}
                                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 py-2 px-3 rounded border border-blue-600 hover:border-blue-800 transition-all font-medium"
                                    >
                                        📥
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-600 text-lg mt-8">
                        {language === "Hindi" ? "कोई पत्रिकाएँ उपलब्ध नहीं हैं" : "No magazines available"}
                    </div>
                )}
            </div>

            {/* ✅ Simple PDF Viewer Modal with iframe */}
            <AnimatePresence>
                {isModalOpen && selectedPdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4"
                        onClick={closePdfViewer}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-lg overflow-hidden w-full max-w-6xl h-full max-h-[95vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                                <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 mr-4">
                                    {selectedPdf.title}
                                </h3>
                                
                                <div className="flex items-center gap-2">
                                    {/* Download Button */}
                                    <button
                                        onClick={() => window.open(selectedPdf.url, "_blank")}
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                    >
                                        📥 Download
                                    </button>
                                    
                                    {/* Open in New Tab */}
                                    <button
                                        onClick={() => window.open(selectedPdf.url, "_blank")}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        🔗 New Tab
                                    </button>
                                    
                                    {/* Close Button */}
                                    <button
                                        onClick={closePdfViewer}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                                    >
                                        ✕ Close
                                    </button>
                                </div>
                            </div>

                            {/* ✅ PDF Viewer - Multiple Fallback Options */}
                            <div className="flex-1 bg-gray-100">
                                {/* Option 1: Browser native PDF viewer */}
                                <iframe
                                    src={selectedPdf.url}
                                    className="w-full h-full border-0"
                                    title={selectedPdf.title}
                                    loading="lazy"
                                    onError={(e) => {
                                        console.log('Native iframe failed, trying Google Docs viewer');
                                        // Fallback to Google Docs viewer
                                        e.target.src = `https://docs.google.com/viewer?url=${encodeURIComponent(selectedPdf.url)}&embedded=true`;
                                    }}
                                />
                            </div>

                            {/* Mobile Bottom Bar */}
                            <div className="flex sm:hidden justify-center items-center p-3 border-t bg-gray-50">
                                <button
                                    onClick={() => window.open(selectedPdf.url, "_blank")}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Open in Browser
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Allmaganizes;
