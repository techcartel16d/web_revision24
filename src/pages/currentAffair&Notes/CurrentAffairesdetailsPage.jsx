import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";

const CurrentAffairesdetailsPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [language, setLanguage] = useState("Hindi");

    console.log('state of news details', state)
    if (!state) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-red-500">No details found!</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // State se jo data mila hai
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
        <div className="max-w-6xl mx-auto p-6">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
                ← Back
            </button>

            {/* Header: Title + Toggle */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {language === "Hindi" ? title : title_english || title}
                </h1>

                {/* Toggle Language */}
                <div className="flex items-center gap-2">
                    {/* <span>हिंदी</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={language === "English"}
              onChange={() =>
                setLanguage(language === "Hindi" ? "English" : "Hindi")
              }
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
          </label>
          <span>English</span> */}

                    <div className="p-4">
                        <LanguageToggle language={language} setLanguage={setLanguage} />

                        <h1 className="mt-6 text-xl font-bold">
                            {language === "Hindi" ? "करेंट अफेयर्स" : "Current Affairs"}
                        </h1>
                    </div>
                </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between'}}>

                        {/* Date */}
                        {formatted_date || date ? (
                            <p className="text-sm text-gray-500 mb-4">
                                🗓 {formatted_date || date}
                            </p>
                            
                        ) : null}
                        <p className="text-sm text-gray-500 mb-4">
                                Source :  {source || ''}
                        </p>
            </div>

            {/* Image */}
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
            )}

            {/* Description */}
            <div
                className="text-gray-700 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                    __html:
                        language === "Hindi"
                            ? description || ""
                            : description_english || description || "",
                }}
            />
           
        </div>
    );
};

export default CurrentAffairesdetailsPage;
