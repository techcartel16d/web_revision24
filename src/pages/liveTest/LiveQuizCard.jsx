import React, { useState, useEffect } from 'react';
import { Calendar, FileText } from "lucide-react";

// ✅ Format datetime nicely
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LiveQuizCard = ({ data, index }) => {
  const [status, setStatus] = useState("upcoming"); // upcoming, active, expired
  const [statusMessage, setStatusMessage] = useState("");

  // ✅ Parse quiz start & expire times
  const startTime = new Date(data?.start_date_time);
  const expireTime = new Date(data?.expire_date_time);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();

      if (now < startTime) {
        setStatus("upcoming");
        setStatusMessage(`Starts in ${formatDateTime(data?.start_date_time)}`);
      } else if (now >= startTime && now <= expireTime) {
        setStatus("active");
        setStatusMessage(`Ends by ${formatDateTime(data?.expire_date_time)}`);
      } else {
        setStatus("expired");
        setStatusMessage(`Expired on ${formatDateTime(data?.expire_date_time)}`);
      }
    };

    checkStatus();
    const timer = setInterval(checkStatus, 1000 * 60); // check every minute
    return () => clearInterval(timer);
  }, [data?.start_date_time, data?.expire_date_time]);

  // ✅ Button label & style
  const getButtonConfig = () => {
    switch (status) {
      case "upcoming":
        return { label: "Upcoming", color: "bg-gray-400 cursor-not-allowed", disabled: true };
      case "active":
        return { label: "Start Now", color: "bg-sky-500 hover:bg-sky-600", disabled: false };
      case "expired":
        return { label: "Expired", color: "bg-red-400 cursor-not-allowed", disabled: true };
      default:
        return { label: "Start", color: "bg-gray-300", disabled: true };
    }
  };

  const btnConfig = getButtonConfig();
  const marks = data?.total_question * data?.marks_per_question;

  const gradients = [
    ["#D8B4F8", "#A5B4FC"],
    ["#FCD5CE", "#FFB5A7"],
    ["#E6E6FA", "#D3D3D3"],
    ["#C1F0F6", "#C1FCD7"],
    ["#A2D4F2", "#69C6B0"],
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <div className="rounded-xl shadow-md bg-white w-full max-w-sm overflow-hidden flex flex-col">
      {/* Top Section with Gradient */}
      <div
        className="p-3 flex justify-between items-center"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      >
        <div className="flex gap-2">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded capitalize">
            ● {data.quiz_mode}
          </span>
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            FREE
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-base font-semibold mb-2">{data?.title}</h2>

        {/* Questions, Duration, Marks */}
        <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
          <FileText size={16} />
          <span>{data?.total_question} Questions</span>
          <span className="mx-1">|</span>
          <span>{data?.duration} Mins.</span>
          <span className="mx-1">|</span>
          <span>{marks} Marks</span>
        </div>

        {/* Date / Status */}
        <div className="text-sm text-gray-600 flex items-center gap-2 mb-4">
          <Calendar size={16} />
          <span>{statusMessage}</span>
        </div>

        {/* Action Button */}
        <div className="mt-auto flex justify-end">
          <button
            className={`${btnConfig.color} text-white px-4 py-2 rounded-lg text-sm font-semibold`}
            disabled={btnConfig.disabled}
          >
            {btnConfig.label}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t text-sm text-sky-600 flex gap-2">
        <span>🌐 English</span>, <span>Hindi</span>
      </div>
    </div>
  );
};

export default LiveQuizCard;
