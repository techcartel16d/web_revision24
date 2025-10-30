// import React, { useEffect, useState } from "react";
// import { secureGetTestData, secureSaveTestData } from "../helpers/testStorage";

// const TestTimer = ({ testId, timeInMinutes = 60, onTimeUp = () => {}, showSeconds = true, textleft, textRight, timeTextSize="text-sm", textBg='', timeClr='' }) => {
//   const totalSeconds = timeInMinutes * 60;
//   const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

//   // ⏱️ Load initial time from encrypted storage
//   useEffect(() => {
//     const loadTime = async () => {
//       const storedTime = await secureGetTestData(testId, "remainingTime");
//       setSecondsLeft(storedTime ?? totalSeconds);
//     };
//     loadTime();
//   }, [testId]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setSecondsLeft((prev) => {
//         const updated = prev - 1;
//         if (updated <= 0) {
//           clearInterval(timer);
//           secureSaveTestData(testId, "remainingTime", 0);
//           onTimeUp();
//           return 0;
//         }
//         secureSaveTestData(testId, "remainingTime", updated);
//         return updated;
//       });
//     }, 1000);

//     return () => clearInterval(timer); // Cleanup on unmount
//   }, [testId]);

//   const formatTime = (seconds) => {
//     const min = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const sec = String(seconds % 60).padStart(2, "0");
//     return showSeconds ? `${min}:${sec}` : `${min}`;
//   };

//   return (
//     <div className={`${timeTextSize} font-bold px-4 py-2 rounded ${textBg}`}>
//      {textleft} <span className={timeClr}>{formatTime(secondsLeft)}</span> {textRight}
//     </div>
//   );
// };

// export default TestTimer;

import React, { useEffect, useState } from "react";
import { secureGetTestData, secureSaveTestData } from "../helpers/testStorage";

const TestTimer = ({
  testId,
  timeInMinutes = 60,
  onTimeUp = () => { },
  showSeconds = true,
  textleft,
  textRight,
  timeTextSize = "text-sm",
  textBg = '',
  timeClr = '',
  isFreshStart = false  // ✅ NEW PROP
}) => {
  const totalSeconds = timeInMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  // ⏱️ Load initial time from encrypted storage
  useEffect(() => {
    const loadTime = async () => {
      // ✅ If fresh start, clear old time and use props
      if (isFreshStart) {
        console.log(`🆕 Fresh start detected - clearing old timer for ${testId}`);
        await secureSaveTestData(testId, "remainingTime", totalSeconds);
        setSecondsLeft(totalSeconds);
        return;
      }

      // ✅ Otherwise, check storage
      const storedTime = await secureGetTestData(testId, "remainingTime");

      console.log(`⏰ Timer Init for ${testId}:`, {
        storedTime,
        totalSeconds,
        timeInMinutes,
        isFreshStart
      });

      // ✅ Validate stored time
      if (storedTime !== null && storedTime !== undefined && storedTime > 0 && storedTime <= totalSeconds) {
        console.log(`✅ Resuming from ${storedTime} seconds`);
        setSecondsLeft(storedTime);
      } else {
        console.log(`🆕 Using fresh time: ${totalSeconds} seconds`);
        setSecondsLeft(totalSeconds);
        await secureSaveTestData(testId, "remainingTime", totalSeconds);
      }
    };

    loadTime();
  }, [testId, timeInMinutes, isFreshStart]);  // ✅ Added isFreshStart

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        const updated = prev - 1;
        if (updated <= 0) {
          clearInterval(timer);
          secureSaveTestData(testId, "remainingTime", 0);
          onTimeUp();
          return 0;
        }
        secureSaveTestData(testId, "remainingTime", updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [testId]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return showSeconds ? `${min}:${sec}` : `${min}`;
  };

  return (
    <div className={`${timeTextSize} font-bold px-4 py-2 rounded ${textBg}`}>
      {textleft} <span className={timeClr}>{formatTime(secondsLeft)}</span> {textRight}
    </div>
  );
};

export default TestTimer;
