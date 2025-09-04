import React from "react";
import { FileX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      {/* Icon */}
      <FileX className="w-20 h-20 text-red-500 mb-6" />

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
      
      {/* Description */}
      <p className="text-gray-600 mb-6">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <a
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
