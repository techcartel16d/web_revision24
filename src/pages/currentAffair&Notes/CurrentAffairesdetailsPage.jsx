// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import LanguageToggle from "../../components/LanguageToggle";

// const CurrentAffairesdetailsPage = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//     const [language, setLanguage] = useState("Hindi");

//     console.log('state of news details', state)
//     if (!state) {
//         return (
//             <div className="p-6 text-center">
//                 <h2 className="text-xl font-bold text-red-500">No details found!</h2>
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
//                 >
//                     Go Back
//                 </button>
//             </div>
//         );
//     }

//     // State se jo data mila hai
//     const {
//         title,
//         title_english,
//         description,
//         description_english,
//         date,
//         formatted_date,
//         image,
//         source
//     } = state;

//     return (
//         <div className="max-w-6xl mx-auto p-6">
//             {/* Back button */}
//             <button
//                 onClick={() => navigate(-1)}
//                 className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
//             >
//                 ← Back
//             </button>

//             {/* Header: Title + Toggle */}
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                     {language === "Hindi" ? title : title_english || title}
//                 </h1>

//                 {/* Toggle Language */}
//                 <div className="flex items-center gap-2">
//                     {/* <span>हिंदी</span>
//           <label className="inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               className="sr-only peer"
//               checked={language === "English"}
//               onChange={() =>
//                 setLanguage(language === "Hindi" ? "English" : "Hindi")
//               }
//             />
//             <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
//           </label>
//           <span>English</span> */}

//                     <div className="p-4">
//                         <LanguageToggle language={language} setLanguage={setLanguage} />

//                         <h1 className="mt-6 text-xl font-bold">
//                             {language === "Hindi" ? "करेंट अफेयर्स" : "Current Affairs"}
//                         </h1>
//                     </div>
//                 </div>
//             </div>

//             <div style={{display:'flex',justifyContent:'space-between'}}>

//                         {/* Date */}
//                         {formatted_date || date ? (
//                             <p className="text-sm text-gray-500 mb-4">
//                                 🗓 {formatted_date || date}
//                             </p>

//                         ) : null}
//                         <p className="text-sm text-gray-500 mb-4">
//                                 Source :  {source || ''}
//                         </p>
//             </div>

//             {/* Image */}
//             {image && (
//                 <img
//                     src={image}
//                     alt={title}
//                     className="w-full h-64 object-cover rounded-lg mb-6"
//                 />
//             )}

//             {/* Description */}
//             <div
//                 className="text-gray-700 leading-relaxed space-y-4"
//                 dangerouslySetInnerHTML={{
//                     __html:
//                         language === "Hindi"
//                             ? description || ""
//                             : description_english || description || "",
//                 }}
//             />

//         </div>
//     );
// };

// export default CurrentAffairesdetailsPage;


import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const CurrentAffairesdetailsPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [language, setLanguage] = useState("Hindi");

    console.log('state of news details', state);

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center max-w-md w-full"
                >
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-4">
                        {language === "Hindi" ? "विवरण नहीं मिला!" : "No details found!"}
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === "Hindi" ? "वापस जाएं" : "Go Back"}
                    </button>
                </motion.div>
            </div>
        );
    }

    const {
        title,
        title_english,
        description,
        description_english,
        date,
        formatted_date,
        image,
        source
    } = state;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Top Bar with Back Button and Language Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {language === "Hindi" ? "वापस" : "Back"}
                        </span>
                    </button>

                    <div className="flex items-center gap-3">
                        <LanguageToggle language={language} setLanguage={setLanguage} />
                        <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                            {language === "Hindi" ? "करेंट अफेयर्स" : "Current Affairs"}
                        </span>
                    </div>
                </motion.div>

                {/* Main Content Card */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    {/* Title */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                            {language === "Hindi" ? title : title_english || title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                            {/* Date */}
                            {(formatted_date || date) && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium">
                                        {formatted_date || date}
                                    </span>
                                </div>
                            )}

                            {/* Source */}
                            {source && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <ExternalLink className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium">
                                        {language === "Hindi" ? "स्रोत" : "Source"}: {source}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image */}
                    {image && (
                        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                            <motion.img
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7 }}
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* Description/Content */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div
                            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 leading-relaxed"
                            style={{
                                fontSize: 'clamp(14px, 2.5vw, 16px)',
                                lineHeight: '1.8'
                            }}
                            dangerouslySetInnerHTML={{
                                __html:
                                    language === "Hindi"
                                        ? description || ""
                                        : description_english || description || "",
                            }}
                        />
                    </div>
                </motion.article>

                {/* Back to Top Button (for long articles) */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all hover:scale-110 z-50"
                    title="Back to top"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
};

export default CurrentAffairesdetailsPage;
