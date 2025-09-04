import React from "react";
import { BookOpenText, SearchX } from "lucide-react";

const NotFoundData = ({ message = "No data found", actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Icon */}
      <BookOpenText className="w-20 h-20 text-gray-400 mb-4" />

      {/* Message */}
      <p className="text-lg font-medium text-center text-gray-700">{message}</p>

      {/* Optional Action Button */}
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default NotFoundData;
