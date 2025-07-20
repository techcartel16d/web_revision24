// Timer.js
import React, { useEffect, useState } from 'react';

const Timer = ({ questionId, onUpdateSpentTime }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1;
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      // When question changes or timer unmounts, update spent time
      if (questionId && onUpdateSpentTime) {
        onUpdateSpentTime(questionId, seconds);
      }
    };
  }, []);

  return (
    <div className="text-lg font-semibold">
      Time: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
    </div>
  );
};

export default Timer;
