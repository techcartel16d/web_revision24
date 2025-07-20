import React, { useEffect, useState } from "react";

const TestTimer = ({ timeInMinutes = 60, onTimeUp = () => {} }) => {
  const totalSeconds = timeInMinutes * 60;

  const getInitialTime = () => {
    const stored = localStorage.getItem("remainingTime");
    return stored ? parseInt(stored, 10) : totalSeconds;
  };

  const [secondsLeft, setSecondsLeft] = useState(getInitialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        const updated = prev - 1;

        if (updated <= 0) {
          clearInterval(timer);
          localStorage.removeItem("remainingTime");
          onTimeUp();
          return 0;
        }

        localStorage.setItem("remainingTime", updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup
  }, []);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="text-white text-sm font-bold bg-gray-800 px-4 py-2 rounded">
      Time Left: {formatTime(secondsLeft)}
    </div>
  );
};

export default TestTimer;
