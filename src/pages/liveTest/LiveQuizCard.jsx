import React, { useState, useEffect } from "react";
import { Calendar, FileText, Clock } from "lucide-react";
import RegisterModal from "../../components/globle/RegisterModal";
import { megaQuizResultSlice } from "../../redux/LiveQuizeSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { secureGetTestData } from "../../helpers/testStorage";

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

const LiveQuizCard = ({ data, index, callBack, currentUserId }) => {
  // console.log("Data",data)
  const dispatch = useDispatch();
  const nav = useNavigate()
  const [countdown, setCountdown] = useState("");
  const [status, setStatus] = useState("upcoming"); // upcoming, active, expired
  const [statusMessage, setStatusMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [pauseStatusArray, setPauseStatusArray] = useState([]);

  // ✅ Register
  const handleRegisterGame = async () => {
    try {
      const res = await dispatch(megaQuizResultSlice(quizId)).unwrap();
      if (res.status_code == 200) {
        // console.log("✅ Registered:", res);
        setModalVisible(false);
        if (callBack) callBack();
      } else {
        console.log("❌ Error Response:", res);
      }
    } catch (error) {
      console.log("ERROR IN REGISTER QUIZ", error);
    }
  };

  // ✅ Parse quiz start & expire times
  const startTime = new Date(data?.start_date_time);
  const expireTime = new Date(data?.expire_date_time);

  // ✅ Status check
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      if (now < startTime) {
        setStatus("upcoming");
        setStatusMessage(`Starts at ${formatDateTime(data?.start_date_time)}`);
      } else if (now >= startTime && now <= expireTime) {
        setStatus("active");
        setStatusMessage(`Ends by ${formatDateTime(data?.expire_date_time)}`);
      } else {
        setStatus("expired");
        setStatusMessage(`Expired on ${formatDateTime(data?.expire_date_time)}`);
      }
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    return () => clearInterval(timer);
  }, [data?.start_date_time, data?.expire_date_time]);



  useEffect(() => {
    const loadPauseStatus = async () => {
      // await clearAllEncryptedTestData()
      // return
      try {
        const data = await secureGetTestData('pause_status', 'pause_status_array');
        // console.log("🔐 Encrypted pause_status_array:", data);
        setPauseStatusArray(data || []);
      } catch (error) {
        // console.error("❌ Failed to load pause status:", error);
        setPauseStatusArray([]);
      }
    };

    loadPauseStatus();
  }, []);




  // ✅ Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const nowTime = new Date();
      let diff = 0;

      if (nowTime < startTime) {
        diff = Math.floor((startTime - nowTime) / 1000);
      } else if (nowTime >= startTime && nowTime <= expireTime) {
        diff = Math.floor((expireTime - nowTime) / 1000);
      }

      if (diff > 0) {
        const h = String(Math.floor(diff / 3600)).padStart(2, "0");
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
        const s = String(diff % 60).padStart(2, "0");
        setCountdown(`${h}:${m}:${s}`);
      } else {
        setCountdown("");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.start_date_time, data?.expire_date_time]);

  // ✅ Button label & style
  const getButtonConfig = () => {
    if (status === "upcoming") {
      return { label: "Register", color: "bg-green-500", disabled: false };
    }
    if (status === "active") {
      return { label: "Start Now", color: "bg-sky-500 hover:bg-sky-600", disabled: false };
    }
    if (status === "expired") {
      return { label: "Expired", color: "bg-red-400 cursor-not-allowed", disabled: true };
    }
    return { label: "Start", color: "bg-gray-300", disabled: false };
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
      {/* Top Section */}
      <div
        className="p-3 flex justify-between items-center"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      >
        {/* <div className="flex gap-2">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded capitalize">
            ● {data.quiz_mode}
          </span>
          {data.entry_fee > 0 ? (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              ₹{data.entry_fee}
            </span>
          ) : (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              FREE
            </span>
          )}
        </div> */}
        {/* ✅ Countdown shown on top right */}
        {countdown && (
          <div className="flex items-center gap-1 text-sm font-semibold text-white">
            <Clock size={14} /> {countdown}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-base font-semibold mb-2">{data?.title}</h2>

        <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
          <FileText size={16} />
          <span>{data?.total_question} Questions</span>
          <span>|</span>
          <span>{data?.duration} Mins.</span>
          <span>|</span>
          <span>{marks} Marks</span>
        </div>

        <div className="text-sm text-gray-600 flex items-center gap-2 mb-4">
          <Calendar size={16} />
          <span>{statusMessage}</span>
        </div>

        <div className="mt-auto flex justify-end">
          {status === "upcoming1" ? (
            // 🔸 Upcoming: Register or Joined
            data?.join_data && data?.join_data[0]?.attend_status !== "" ? (
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-800 to-green-400 text-white"
                disabled
              >
                Joined
              </button>
            ) : (
              <button
                onClick={() => {
                  setModalVisible(true);
                  setQuizId(data?.id);
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-white hover:opacity-90"
              >
                Register
              </button>
            )
          ) : (
            // 🔸 Active, Expired, or Done
            data?.attend === true && data?.attend_status === "done" ? (
              <button
                onClick={() => nav("/live-quiz-analysis", { state: { testInfo: data } })}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-600 via-green-400 to-green-600 text-white hover:opacity-90"
              >
                View Result
              </button>
            ) : status === "active" ? (
              <button
                onClick={() => nav("/live-quiz-instruction", { state: { testInfo: data } })}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-white hover:opacity-90"
              >
                Start Test
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-gray-600 to-gray-300 text-white cursor-not-allowed"
                disabled
              >
                Time Up
              </button>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      <RegisterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleRegisterGame}
      />

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t text-sm text-sky-600 flex gap-2">
        <span>🌐 English</span>, <span>Hindi</span>
      </div>
    </div>
  );
};

export default LiveQuizCard;
