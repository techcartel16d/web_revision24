import React from "react";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

const GlobleAlert = ({ 
  type = "success", 
  message = "This is an alert", 
  onConfirm, 
  onCancel, 
  onClose 
}) => {
  const alertStyles = {
    success: {
      bg: "bg-green-100 border-green-500 text-green-800",
      icon: <CheckCircle className="w-12 h-12 text-green-600" />,
    },
    warning: {
      bg: "bg-yellow-100 border-yellow-500 text-yellow-800",
      icon: <AlertTriangle className="w-12 h-12 text-yellow-600" />,
    },
    confirm: {
      bg: "bg-blue-100 border-blue-500 text-blue-800",
      icon: <AlertCircle className="w-12 h-12 text-blue-600" />,
    },
  };

  const { bg, icon } = alertStyles[type] || alertStyles.success;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.1)] z-50">
      <div
        className={`max-w-md w-full mx-4 ${bg} border rounded-lg shadow-xl p-6 text-center`}
      >
        <div className="flex justify-center mb-4">{icon}</div>
        <p className="text-lg font-medium">{message}</p>

        {type === "confirm" ? (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
            >
              No
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <button
              onClick={onClose}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobleAlert;
