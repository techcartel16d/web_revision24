import React from "react";

const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Hindi Label */}
      <span
        className={`text-sm font-medium ${
          language === "Hindi" ? "text-blue-600" : "text-gray-500"
        }`}
      >
        हिंदी
      </span>

      {/* Toggle Switch */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={language === "English"}
          onChange={() =>
            setLanguage(language === "Hindi" ? "English" : "Hindi")
          }
        />
        <div className="relative w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300 ease-in-out">
          {/* Indicator Knob */}
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
              language === "English" ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </div>
      </label>

      {/* English Label */}
      <span
        className={`text-sm font-medium ${
          language === "English" ? "text-blue-600" : "text-gray-500"
        }`}
      >
        English
      </span>
    </div>
  );
};

export default LanguageToggle;
