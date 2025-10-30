// import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { attendQuestionSubmitSlice, fetchUserTestSeriesSolution, getSingleCategoryPackageTestseriesQuestionSlice } from '../../redux/HomeSlice';

// import SolutionsGrideModal from '../../components/SolutionsGrideModal';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { BlockMath, InlineMath } from 'react-katex';
// import 'katex/dist/katex.min.css';
// import stripLatex from '../../helpers/cleanMathTags';
// import MathRenderer from '../../utils/MathRenderer';



// const Screen7 = () => {
//   const nav = useNavigate()
//   const dispatch = useDispatch()
//   const { state } = useLocation()
//   // console.log("state==>", state)
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [questionsState, setQuestionsState] = useState([]);
//   const [loading, setLoading] = useState(false)
//   const [showModal, setShowModal] = useState(false)
//   const [elapsedSeconds, setElapsedSeconds] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//   const [spentTime, setSpentTime] = useState([]);
//   const [currentQuestionId, setCurrentQuestionId] = useState(''); // Example
//   const [language, setLanguage] = useState('hi')
//   const [showPauseModal, setShowPauseModal] = useState(false);
//   const [showSolution, setShowSolution] = useState(false);
//   const [userInfo, setUserInfo] = useState(null)
//   const [isFullScreen, setIsFullScreen] = useState(false)
//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true)
//       const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testData?.my_detail?.test_id)).unwrap()
//       if (res.status_code == 200) {
//         // console.log("question data fetching", res)
//         setQuestionsState(res.data)
//         setLoading(false)
//         // setRefreshing(false)
//       } else {
//         // console.log("response", res)
//       }

//     } catch (error) {
//       setLoading(false)

//     } finally {
//       setLoading(false)
//     }



//   }
//   const [wrongQuestions, setWrongQuestions] = useState([]);




//   const enterFullScreen = () => {
//     const elem = document.documentElement; // or use any specific element
//     if (elem.requestFullscreen) {
//       elem.requestFullscreen();
//       setIsFullScreen(true)
//     } else if (elem.webkitRequestFullscreen) {
//       setIsFullScreen(true)
//       /* Safari */
//       elem.webkitRequestFullscreen();
//     } else if (elem.msRequestFullscreen) {
//       setIsFullScreen(true)
//       /* IE11 */
//       elem.msRequestFullscreen();
//     }
//   };


//   const exitFullScreen = () => {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//       // Safari
//       document.webkitExitFullscreen();
//     } else if (document.msExitFullscreen) {
//       // IE11
//       document.msExitFullscreen();
//     }
//   };



//   useEffect(() => {
//     enterFullScreen()
//   }, [])





//   // const fetchUserSolution = async () => {
//   //   try {
//   //     const res = await dispatch(fetchUserTestSeriesSolution(state?.testData?.my_detail?.test_id)).unwrap();
//   //     // console.log("res", res)

//   //     if (res.status_code === 200) {
//   //       setQuestionsState(res.data.all_question_list);
//   //       setSkippedQuestions(res.data.skip_question);
//   //       setMarkedForReview(res.data.mark_for_review);
//   //       setOptionSelected(res.data.attend_question);

//   //       // ✅ Detect wrong answered questions properly
//   //       const wrong = res.data.all_question_list?.filter(q => {
//   //         const correctAns = language === 'en' ? q.english_ans?.toLowerCase() : q.hindi_ans?.toLowerCase();
//   //         const userAns = q.user_selected_ans?.toLowerCase();
//   //         return userAns && userAns !== correctAns;
//   //       }).map(q => q.id); // NOTE: changed from q.question_id to q.id as per your object

//   //       // console.log("wrong questions:", wrong);
//   //       setWrongQuestions(wrong);
//   //     }
//   //   } catch (error) {
//   //     // console.log("error ", error);
//   //   }
//   // };
//   const fetchUserSolution = async () => {
//     try {
//       const res = await dispatch(fetchUserTestSeriesSolution({
//         test_id: state?.testData?.my_detail?.test_id,
//         attend_id: state?.attend_id || state?.testData?.my_detail?.attend_id
//       })).unwrap();

//       console.log('🔍 Full API Response:', res.data);

//       if (res.status_code === 200) {
//         setQuestionsState(res.data.all_question_list);
//         setSkippedQuestions(res.data.skip_question);
//         setMarkedForReview(res.data.mark_for_review);
//         setOptionSelected(res.data.attend_question);

//         // ✅ Get attempted questions
//         const attemptedQuestionIds = res.data.attend_question || [];

//         // ✅ Calculate wrong answers by checking BOTH language answers
//         const wrong = res.data.all_question_list
//           ?.filter(q => {
//             // Only process attempted questions
//             if (!attemptedQuestionIds.includes(q.id)) return false;

//             // Get user's answer (normalized)
//             const userAns = q.user_selected_ans?.toLowerCase().trim();

//             // If no answer selected, skip
//             if (!userAns) return false;

//             // ✅ Check against BOTH English and Hindi correct answers
//             const correctAnsEn = q.english_ans?.toLowerCase().trim();
//             const correctAnsHi = q.hindi_ans?.toLowerCase().trim();

//             // ✅ Question is wrong if user answer doesn't match either language
//             const isWrong = userAns !== correctAnsEn && userAns !== correctAnsHi;

//             console.log(`Question ${q.id}:`, {
//               userAns,
//               correctAnsEn,
//               correctAnsHi,
//               isWrong
//             });

//             return isWrong;
//           })
//           .map(q => q.id);

//         console.log('✅ Wrong Questions:', wrong);
//         console.log('✅ Wrong Count:', wrong.length);
//         console.log('✅ Correct Count:', attemptedQuestionIds.length - wrong.length);
//         console.log('✅ Expected from API - Correct:', res.data.attend_detail?.correct, 'Wrong:', res.data.attend_detail?.in_correct);

//         setWrongQuestions(wrong);
//       }
//     } catch (error) {
//       console.error("Error fetching solution:", error);
//     }
//   };



//   // LOAD. USER INFO
//   const loadUserData = async () => {
//     const user = await getUserDataDecrypted();
//     // console.log("user info", user)
//     setUserInfo(user);
//   };


//   useEffect(() => {
//     loadUserData();
//   }, []);






//   useEffect(() => {
//     // getTestSeriesQuestion()
//     fetchUserSolution()
//   }, [])



//   const groupedQuestions = questionsState.reduce((acc, question) => {
//     const subject = acc.find((grp) => grp.subject_name === question.subject_name);
//     if (subject) {
//       subject.questions.push(question);
//     } else {
//       acc.push({
//         subject_name: question.subject_name,
//         questions: [question],
//       });
//     }
//     return acc;
//   }, []);



//   // HANDLE NEXT QUESTION 
//   const handleNextQuestion = () => {

//     // Circular navigation: go to first if last question
//     if (currentQuestion === questionsState.length - 1) {
//       setCurrentQuestion(0);
//     } else {
//       setCurrentQuestion(prev => prev + 1);
//     }
//   };
//   // HANDLE PREVIOUS QUESTION 
//   const handlePreviousQuestion = () => {
//     if (currentQuestion === 0) {
//       // Go to last question
//       setCurrentQuestion(questionsState.length - 1);
//     } else {
//       // Go to previous question
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };


//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [currentQuestion]);







//   const current = questionsState[currentQuestion];
//   // console.log("cureree====>", current)
//   if (!current) return <div className="p-4-400 text-red-500 w-full h-full flex items-center justify-center">
//     <div className="fading-spinner">
//       {[...Array(12)].map((_, i) => (
//         <div key={i} className={`bar bar${i + 1}`}></div>
//       ))}
//     </div>
//   </div>;

//   const options = language === 'en'
//     ? {
//       a: current.option_english_a,
//       b: current.option_english_b,
//       c: current.option_english_c,
//       d: current.option_english_d,
//     }
//     : {
//       a: current.option_hindi_a,
//       b: current.option_hindi_b,
//       c: current.option_hindi_c,
//       d: current.option_hindi_d,
//     };



//   const handlePauseClick = () => {
//     setShowPauseModal(true);
//   };

//   const handleConfirmPause = () => {
//     setShowPauseModal(false);
//     // ✅ Pause test logic here
//     // console.log("Test paused and state saved.");
//     localStorage.setItem('isPuase', 'true')
//     nav('/testpakages', { replace: true, state: { testId: state?.testId } })
//   };

//   const handleCancelPause = () => {
//     setShowPauseModal(false);
//   };






//   const questionText = language === 'en' ? current.question_english : current.question_hindi;




//   function renderOption(optionValue) {
//     if (!optionValue) return null;

//     // Clean HTML and apply image styling
//     const cleaned = optionValue
//       .replace(/<p>/gi, '')
//       .replace(/<\/p>/gi, '')
//       .replace(/<br\s*\/?>/gi, '')
//       // Add inline style to limit image width
//       .replace(/<img /gi, '<img style="width:100px" ');

//     return (
//       <div dangerouslySetInnerHTML={{ __html: cleaned }} />
//     );
//   }


//   function renderExplanation() {
//     const explanationText = language === 'en' ? current.explanation_english : current.explanation;
//     // console.log(explanationText)
//     if (!explanationText) return null;

//     const cleaned = explanationText
//       .replace(/<br\s*\/?>/gi, '')
//       .replace(/<img /gi, '<img style="max-width: 100%; height: auto; max-height: 200px;" ');

//     return (
//       // <div
//       //   className="mt-4 border-t pt-4 text-sm"
//       //   dangerouslySetInnerHTML={{ __html: cleaned }}
//       // />
//       <div className='mt-4'>

//         <MathRenderer text={cleaned} />
//       </div>
//     );
//   }





//   return (
//     // <div className="flex flex-col p-4 text-sm font-sans overflow-hidden">


//     //   {/* Header */}
//     //   <div className="flex justify-between items-center mb-4">
//     //     <div className="text-lg font-bold">{state?.testData?.test_detail?.title || 'SSC ONLINE MOCK TEST'}</div>
//     //     <div className="flex items-center gap-5">
//     //       {
//     //         isFullScreen ? (
//     //           <div className=''>
//     //             <button onClick={() => {
//     //               setIsFullScreen(false)
//     //               exitFullScreen()
//     //             }} className='px-6 py-2 bg-gray-600 rounded-md text-white'>Exit Full Screen</button>
//     //           </div>
//     //         ) : (
//     //           <div className=''>
//     //             <button onClick={() => {
//     //               setIsFullScreen(true)
//     //               enterFullScreen()
//     //             }} className='px-6 py-2 bg-gray-600 rounded-md text-white'>Full Screen</button>
//     //           </div>
//     //         )
//     //       }
//     //       <div className="text-sm">Name : <span className="font-semibold"></span>{userInfo && userInfo?.name || 'guest'}</div>
//     //     </div>
//     //   </div>

//     //   {/* Top Controls */}
//     //   <div className="flex justify-between items-center border-y py-2 mb-3">

//     //     <div className="text-red-600 font-semibold text-center flex text-sm gap-3">
//     //       {/* <button
//     //         onClick={handlePauseClick}
//     //         className="bg-yellow-400 text-gray-800 px-3 py-1 rounded text-xs"
//     //       >
//     //         Puase
//     //       </button>
//     //       <button
//     //         onClick={handleSubmit}
//     //         className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded"
//     //       >
//     //         Submit
//     //       </button> */}
//     //     </div>

//     //     <div className="flex gap-4 justify-between items-center w-1/2">

//     //       <div className="flex gap-1">
//     //         <div className="flex gap-2">
//     //           <button
//     //             onClick={handlePreviousQuestion}
//     //             className="bg-blue-500 text-white px-6 py-2 rounded text-sm"
//     //           >
//     //             {"<< Previous"}
//     //           </button>

//     //           {selectedOptions[current.id] ? (
//     //             <button
//     //               className="bg-green-600 text-white px-6 py-2 rounded text-sm"
//     //             >
//     //               Save & Next
//     //             </button>
//     //           ) : (
//     //             <button
//     //               onClick={handleNextQuestion}
//     //               className="bg-blue-500 text-white px-6 py-2 rounded text-sm"
//     //             >
//     //               {"Next >>"}
//     //             </button>
//     //           )}
//     //         </div>
//     //       </div>
//     //       <div className="text-right">
//     //         {/* <TestTimer timeInMinutes={60} onTimeUp={() => alert("Time is up!")} /> */}
//     //         <button
//     //           onClick={() => {
//     //             exitFullScreen()
//     //             nav('/analysis', { state: state?.state })

//     //           }}
//     //           className="bg-blue-500 text-white px-6 py-2 rounded text-sm"
//     //         >
//     //           Analytics
//     //         </button>
//     //       </div>
//     //     </div>
//     //   </div>


//     //   {/* Main Body */}
//     //   <div className="flex gap-4 w-full">



//     //     <SolutionsGrideModal
//     //       wrongQuestion={wrongQuestions}
//     //       question={questionsState}
//     //       groupedQuestions={groupedQuestions}
//     //       currentQuestion={currentQuestion}
//     //       optionSelected={optionSelected}
//     //       markedForReview={markedForReview}
//     //       markedForReviewAns={markedWithAns}
//     //       skippedQuestions={skippedQuestions}
//     //       setCurrentQuestion={(index) => setCurrentQuestion(index)}
//     //       onClose={() => setShowModal(false)}
//     //       onProceed={() => { }}
//     //     />

//     //     {/* Right Side - Question Panel */}
//     //     <div className="flex-1 relative border rounded-lg px-4 py-3 " id="testBg">
//     //       {/* <div className='absolute top-50 left-[45%] w-full h-full items-center justify-center '>
//     //         <h1 className='text-gray-300 font-bold text-5xl'>REVISION24</h1>
//     //       </div> */}
//     //       {/* Header */}
//     //       <div className="flex justify-between items-center mb-2">
//     //         <div className="text-md font-bold">Question : {currentQuestion + 1}</div>
//     //         {/* Language Switch */}
//     //         <div className="flex justify-end flex-col gap-2">
//     //           {/* ⏱️ Time for current question */}
//     //           {/* <div className="text-xs text-gray-600 font-semibold">
//     //             Time: {formatTime(elapsedSeconds)}
//     //           </div> */}
//     //           <select
//     //             value={language}
//     //             onChange={(e) => setLanguage(e.target.value)}
//     //             className="border text-xs px-2 py-1 rounded"
//     //           >
//     //             <option value="en">English</option>
//     //             <option value="hi">Hindi</option>
//     //           </select>

//     //         </div>
//     //       </div>

//     //       {/* Question */}
//     //       <div
//     //         className="mb-2 text-lg leading-relaxed"
//     //         dangerouslySetInnerHTML={{ __html: questionText }}
//     //       />

//     //       {/* <div className="mb-2 text-sm">
//     //         <BlockMath math={stripLatex(questionText)} />
//     //       </div> */}

//     //       {/* update  */}
//     //       {Object.entries(options).map(([key, value]) => {
//     //         const isSelected = key.toLowerCase() === current.user_selected_ans?.toLowerCase();
//     //         const isCorrect = language === 'en'
//     //           ? key.toLowerCase() === current.english_ans?.toLowerCase()
//     //           : key.toLowerCase() === current.hindi_ans?.toLowerCase();

//     //         let optionClass = 'border-gray-300';
//     //         if (isCorrect) {
//     //           optionClass = 'bg-green-200 border-green-500';
//     //         } else if (isSelected) {
//     //           optionClass = 'bg-red-200 border-red-500';
//     //         }

//     //         return (
//     //           <div
//     //             key={key}
//     //             className={`border-2 p-3 mb-2 rounded ${optionClass}`}
//     //           >
//     //             <strong>{key.toUpperCase()}.</strong> {renderOption(value)}
//     //             {/* <span className="option-content text-sm">
//     //               <InlineMath math={stripLatex(value)} />
//     //             </span> */}
//     //           </div>
//     //         );
//     //       })}






//     //       <div>
//     //         <button
//     //           onClick={() => setShowSolution(!showSolution)}
//     //           className="px-6 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition"
//     //         >
//     //           {showSolution ? 'Hide Solution' : 'View Solution'}
//     //         </button>

//     //         {showSolution && renderExplanation()}
//     //       </div>
//     //     </div>
//     //   </div>


//     // </div>
//     <div className="flex flex-col p-4 text-sm font-sans overflow-hidden">

//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
//         <div className="text-lg font-bold">
//           {state?.testData?.test_detail?.title || 'SSC ONLINE MOCK TEST'}
//         </div>
//         <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
//           {isFullScreen ? (
//             <button
//               onClick={() => {
//                 setIsFullScreen(false)
//                 exitFullScreen()
//               }}
//               className="w-full md:w-auto px-4 py-2 bg-gray-600 rounded-md text-white"
//             >
//               Exit Full Screen
//             </button>
//           ) : (
//             <button
//               onClick={() => {
//                 setIsFullScreen(true)
//                 enterFullScreen()
//               }}
//               className="w-full md:w-auto px-4 py-2 bg-gray-600 rounded-md text-white"
//             >
//               Full Screen
//             </button>
//           )}
//           <div className="text-sm">
//             Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span>
//           </div>
//         </div>
//       </div>

//       {/* Top Controls */}
//       <div className="flex flex-col md:flex-row justify-between items-center border-y py-3 mb-4 gap-4">
//         <div className="text-red-600 font-semibold text-sm flex gap-3">
//           {/* pause / submit (if needed) */}
//         </div>

//         <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-1/2">
//           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center">
//             <button
//               onClick={handlePreviousQuestion}
//               className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
//             >
//               {"<< Previous"}
//             </button>

//             {selectedOptions[current.id] ? (
//               <button className="bg-green-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto">
//                 Save & Next
//               </button>
//             ) : (
//               <button
//                 onClick={handleNextQuestion}
//                 className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
//               >
//                 {"Next >>"}
//               </button>
//             )}
//           </div>
//           <button
//             onClick={() => {
//               exitFullScreen()
//               nav('/analysis', { state: state?.state })
//             }}
//             className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full md:w-auto"
//           >
//             Analytics
//           </button>
//         </div>
//       </div>

//       {/* Main Body */}
//       <div className="flex flex-col lg:flex-row gap-4 w-full">

//         {/* Solution Modal (can be toggle component) */}
//         <SolutionsGrideModal
//           wrongQuestion={wrongQuestions}
//           question={questionsState}
//           groupedQuestions={groupedQuestions}
//           currentQuestion={currentQuestion}
//           optionSelected={optionSelected}
//           markedForReview={markedForReview}
//           markedForReviewAns={markedWithAns}
//           skippedQuestions={skippedQuestions}
//           setCurrentQuestion={(index) => setCurrentQuestion(index)}
//           onClose={() => setShowModal(false)}
//           onProceed={() => { }}
//         />

//         {/* Right Side - Question Panel */}
//         <div className="flex-1 border rounded-lg px-4 py-3" id="testBg">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-3">
//             <div className="text-md font-bold">Question : {currentQuestion + 1}</div>
//             <div className="flex gap-2 items-center">
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="border text-xs px-2 py-1 rounded"
//               >
//                 <option value="en">English</option>
//                 <option value="hi">Hindi</option>
//               </select>
//             </div>
//           </div>

//           {/* <div
//         className="mb-3 text-base leading-relaxed"
//         dangerouslySetInnerHTML={{ __html: questionText }}
//       /> */}
//           <div className='mb-4'>

//             <MathRenderer text={questionText} />
//           </div>

//           {/* Options */}
//           {Object.entries(options).map(([key, value]) => {
//             const isSelected = key.toLowerCase() === current.user_selected_ans?.toLowerCase();
//             const isCorrect = language === 'en'
//               ? key.toLowerCase() === current.english_ans?.toLowerCase()
//               : key.toLowerCase() === current.hindi_ans?.toLowerCase();

//             let optionClass = 'border-gray-300';
//             if (isCorrect) {
//               optionClass = 'bg-green-200 border-green-500';
//             } else if (isSelected) {
//               optionClass = 'bg-red-200 border-red-500';
//             }

//             return (
//               <div
//                 key={key}
//                 className={`border-2 p-3 mb-2 rounded flex items-center gap-1.5 option_img ${optionClass}`}
//               >
//                 <strong>{key.toUpperCase()}.</strong> <MathRenderer text={value} />

//               </div>
//             );
//           })}

//           {/* Solution Toggle */}
//           <div className="mt-3">
//             <button
//               onClick={() => setShowSolution(!showSolution)}
//               className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full sm:w-auto"
//             >
//               {showSolution ? 'Hide Solution' : 'View Solution'}
//             </button>

//             {showSolution && renderExplanation()}
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default Screen7;



import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUserTestSeriesSolution } from '../../redux/HomeSlice';
import SolutionsGrideModal from '../../components/SolutionsGrideModal';
import { getUserDataDecrypted } from '../../helpers/userStorage';
import MathRenderer from '../../utils/MathRenderer';
import 'katex/dist/katex.min.css';

const Screen7 = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsState, setQuestionsState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [optionSelected, setOptionSelected] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [markedWithAns, setMarkedWithAns] = useState([]);
  const [language, setLanguage] = useState('hi');
  const [showSolution, setShowSolution] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  // ✅ Full Screen Functions
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      setIsFullScreen(true);
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
      setIsFullScreen(true);
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
      setIsFullScreen(true);
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      setIsFullScreen(false);
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      setIsFullScreen(false);
    }
  };

  // ✅ Fetch Solution Data with attend_id
  // const fetchUserSolution = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await dispatch(fetchUserTestSeriesSolution({
  //       test_id: state?.testData?.my_detail?.test_id,
  //       attend_id: state?.attend_id || state?.testData?.my_detail?.attend_id
  //     })).unwrap();

  //     // console.log('🔍 Full API Response:', res.data);

  //     // if (res.status_code === 200) {
  //     //   setQuestionsState(res.data.all_question_list);
  //     //   setSkippedQuestions(res.data.skip_question || []);
  //     //   setMarkedForReview(res.data.mark_for_review || []);
  //     //   setOptionSelected(res.data.attend_question || []);

  //     //   // ✅ Calculate wrong answers by checking BOTH language answers
  //     //   const attemptedQuestionIds = res.data.attend_question || [];

  //     //   const wrong = res.data.all_question_list
  //     //     ?.filter(q => {
  //     //       if (!attemptedQuestionIds.includes(q.id)) return false;

  //     //       const userAns = q.user_selected_ans?.toLowerCase().trim();
  //     //       if (!userAns) return false;

  //     //       const correctAnsEn = q.english_ans?.toLowerCase().trim();
  //     //       const correctAnsHi = q.hindi_ans?.toLowerCase().trim();

  //     //       const isWrong = userAns !== correctAnsEn && userAns !== correctAnsHi;

  //     //       console.log(`Question ${q.id}:`, {
  //     //         userAns,
  //     //         correctAnsEn,
  //     //         correctAnsHi,
  //     //         isWrong
  //     //       });

  //     //       return isWrong;
  //     //     })
  //     //     .map(q => q.id);

  //     //   console.log('✅ Wrong Questions:', wrong);
  //     //   console.log('✅ Wrong Count:', wrong.length);
  //     //   console.log('✅ Correct Count:', attemptedQuestionIds.length - wrong.length);
  //     //   console.log('✅ Expected from API - Correct:', res.data.attend_detail?.correct, 'Wrong:', res.data.attend_detail?.in_correct);

  //     //   setWrongQuestions(wrong);
  //     // }

  //     console.log('🔍 Full API Response:', res.data);

  //     if (res.status_code === 200) {
  //       setQuestionsState(res.data.all_question_list);

  //       // ✅ Parse string arrays to actual arrays
  //       const parseToArray = (data) => {
  //         if (Array.isArray(data)) return data;
  //         if (typeof data === 'string') {
  //           try {
  //             // Remove quotes and brackets, then split
  //             const cleaned = data.replace(/[$$$$"]/g, '');
  //             return cleaned ? cleaned.split(',').map(id => parseInt(id.trim())) : [];
  //           } catch (e) {
  //             console.error('Error parsing array:', e);
  //             return [];
  //           }
  //         }
  //         return [];
  //       };

  //       const skipQuestions = parseToArray(res.data.skip_question);
  //       const markForReview = parseToArray(res.data.mark_for_review);
  //       const attendQuestion = parseToArray(res.data.attend_question);

  //       console.log('📊 Parsed Data:', {
  //         skipQuestions,
  //         markForReview,
  //         attendQuestion
  //       });

  //       setSkippedQuestions(skipQuestions);
  //       setMarkedForReview(markForReview);
  //       setOptionSelected(attendQuestion);

  //       // ✅ Calculate wrong answers
  //       const wrong = res.data.all_question_list
  //         ?.filter(q => {
  //           // ✅ Only check attempted questions
  //           if (!attemptedQuestionIds.includes(q.id)) {
  //             console.log(`⏭️ Skipping Q${q.id} - Not attempted`);
  //             return false;
  //           }

  //           const userAns = q.user_selected_ans?.toLowerCase().trim();
  //           const correctAnsEn = q.english_ans?.toLowerCase().trim();
  //           const correctAnsHi = q.hindi_ans?.toLowerCase().trim();

  //           // ✅ Detailed logging for each question
  //           console.log(`\n🔍 Question ${q.id}:`, {
  //             userAns: `"${userAns}"`,
  //             correctAnsEn: `"${correctAnsEn}"`,
  //             correctAnsHi: `"${correctAnsHi}"`,
  //             matchEn: userAns === correctAnsEn,
  //             matchHi: userAns === correctAnsHi,
  //           });

  //           if (!userAns) {
  //             console.log(`⚠️ Q${q.id} - No user answer`);
  //             return false;
  //           }

  //           // ✅ Check if answer is WRONG (not matching either language)
  //           const isWrong = userAns !== correctAnsEn && userAns !== correctAnsHi;

  //           console.log(`${isWrong ? '❌ WRONG' : '✅ CORRECT'} - Q${q.id}`);

  //           return isWrong;
  //         })
  //         .map(q => q.id);


  //       console.log('✅ Wrong Questions:', wrong);
  //       console.log('✅ Wrong Count:', wrong.length);
  //       console.log('✅ Correct Count:', attendQuestion.length - wrong.length);
  //       console.log('✅ Expected from API - Correct:', res.data.attend_detail?.correct, 'Incorrect:', res.data.attend_detail?.in_correct);

  //       setWrongQuestions(wrong);
  //     }

  //   } catch (error) {
  //     console.error("Error fetching solution:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ✅ Fetch Solution Data with attend_id
  // const fetchUserSolution = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await dispatch(fetchUserTestSeriesSolution({
  //       test_id: state?.testData?.my_detail?.test_id,
  //       attend_id: state?.attend_id || state?.testData?.my_detail?.attend_id
  //     })).unwrap();

  //     console.log('🔍 Full API Response:', res.data);

  //     if (res.status_code === 200) {
  //       setQuestionsState(res.data.all_question_list);

  //       // ✅ Parse string arrays to actual arrays
  //       const parseToArray = (data) => {
  //         if (Array.isArray(data)) return data;
  //         if (typeof data === 'string') {
  //           try {
  //             const cleaned = data.replace(/[\[\]"]/g, '');
  //             return cleaned ? cleaned.split(',').map(id => parseInt(id.trim())) : [];
  //           } catch (e) {
  //             console.error('Error parsing array:', e);
  //             return [];
  //           }
  //         }
  //         return [];
  //       };

  //       const skipQuestions = parseToArray(res.data.skip_question);
  //       const markForReview = parseToArray(res.data.mark_for_review);
  //       const attendQuestion = parseToArray(res.data.attend_question);  // ✅ This is the variable

  //       console.log('📊 Parsed Data:', {
  //         skipQuestions,
  //         markForReview,
  //         attendQuestion
  //       });

  //       setSkippedQuestions(skipQuestions);
  //       setMarkedForReview(markForReview);
  //       setOptionSelected(attendQuestion);

  //       // ✅ Calculate wrong answers with detailed logging
  //       const wrong = res.data.all_question_list
  //         ?.filter(q => {
  //           // ✅ Only check attempted questions
  //           if (!attendQuestion.includes(q.id)) {  // ✅ Use attendQuestion here
  //             console.log(`⏭️ Skipping Q${q.id} - Not attempted`);
  //             return false;
  //           }

  //           const userAns = q.user_selected_ans?.toLowerCase().trim();
  //           const correctAnsEn = q.english_ans?.toLowerCase().trim();
  //           const correctAnsHi = q.hindi_ans?.toLowerCase().trim();

  //           // ✅ Detailed logging for each question
  //           console.log(`\n🔍 Question ${q.id}:`, {
  //             userAns: `"${userAns}"`,
  //             correctAnsEn: `"${correctAnsEn}"`,
  //             correctAnsHi: `"${correctAnsHi}"`,
  //             matchEn: userAns === correctAnsEn,
  //             matchHi: userAns === correctAnsHi,
  //           });

  //           if (!userAns) {
  //             console.log(`⚠️ Q${q.id} - No user answer`);
  //             return false;
  //           }

  //           // ✅ Check if answer is WRONG (not matching either language)
  //           const isWrong = userAns !== correctAnsEn && userAns !== correctAnsHi;

  //           console.log(`${isWrong ? '❌ WRONG' : '✅ CORRECT'} - Q${q.id}`);

  //           return isWrong;
  //         })
  //         .map(q => q.id);

  //       console.log('✅ Wrong Questions:', wrong);
  //       console.log('✅ Wrong Count:', wrong.length);
  //       console.log('✅ Correct Count:', attendQuestion.length - wrong.length);
  //       console.log('✅ Expected from API - Correct:', res.data.attend_detail?.correct, 'Incorrect:', res.data.attend_detail?.in_correct);

  //       setWrongQuestions(wrong);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching solution:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchUserSolution = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await dispatch(fetchUserTestSeriesSolution({
  //       test_id: state?.testData?.my_detail?.test_id,
  //       attend_id: state?.attend_id || state?.testData?.my_detail?.attend_id
  //     })).unwrap();

  //     console.log('🔍 Full API Response:', res.data);

  //     if (res.status_code === 200) {
  //       setQuestionsState(res.data.all_question_list);

  //       const parseToArray = (data) => {
  //         if (Array.isArray(data)) return data;
  //         if (typeof data === 'string') {
  //           try {
  //             const cleaned = data.replace(/[\[\]"]/g, '');
  //             return cleaned ? cleaned.split(',').map(id => parseInt(id.trim())) : [];
  //           } catch (e) {
  //             console.error('Error parsing array:', e);
  //             return [];
  //           }
  //         }
  //         return [];
  //       };



  //       const skipQuestions = parseToArray(res.data.skip_question);
  //       const markForReview = parseToArray(res.data.mark_for_review);
  //       const attendQuestion = parseToArray(res.data.attend_question);

  //       console.log('📊 Parsed Data:', {
  //         skipQuestions,
  //         markForReview,
  //         attendQuestion
  //       });

  //       setSkippedQuestions(skipQuestions);
  //       setMarkedForReview(markForReview);
  //       setOptionSelected(attendQuestion);

  //       // ✅ SIMPLE DEBUG: Log first 3 attempted questions
  //       console.log('\n🔬 DEBUGGING FIRST 3 QUESTIONS:');
  //       const firstThree = res.data.all_question_list.slice(0, 3);

  //       firstThree.forEach(q => {
  //         const isAttempted = attendQuestion.includes(q.id);
  //         console.log(`\nQuestion ${q.id}:`, {
  //           isAttempted,
  //           user_selected_ans: q.user_selected_ans,
  //           english_ans: q.english_ans,
  //           hindi_ans: q.hindi_ans,
  //         });
  //       });

  //       // ✅ Calculate wrong answers
  //       const wrong = res.data.all_question_list
  //         ?.filter(q => {
  //           if (!attendQuestion.includes(q.id)) return false;

  //           const userAns = q.user_selected_ans?.toLowerCase().trim();
  //           if (!userAns) return false;

  //           const correctAnsEn = q.english_ans?.toLowerCase().trim();
  //           const correctAnsHi = q.hindi_ans?.toLowerCase().trim();

  //           // ✅ This is where it checks
  //           const isWrong = userAns !== correctAnsEn && userAns !== correctAnsHi;

  //           return isWrong;
  //         })
  //         .map(q => q.id);

  //       console.log('✅ Wrong Questions:', wrong);
  //       console.log('✅ Wrong Count:', wrong.length);
  //       console.log('✅ Correct Count:', attendQuestion.length - wrong.length);
  //       console.log('✅ Expected from API - Correct:', res.data.attend_detail?.correct, 'Incorrect:', res.data.attend_detail?.in_correct);

  //       setWrongQuestions(wrong);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching solution:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUserSolution = async () => {
    try {
      setLoading(true);
      const res = await dispatch(fetchUserTestSeriesSolution({
        test_id: state?.testData?.my_detail?.test_id,
        attend_id: state?.attend_id || state?.testData?.my_detail?.attend_id
      })).unwrap();

      console.log('🔍 Full API Response:', res.data);

      if (res.status_code === 200) {
        setQuestionsState(res.data.all_question_list);

        // ✅ Helper function to parse string arrays to actual arrays
        const parseToArray = (data) => {
          if (Array.isArray(data)) return data;
          if (typeof data === 'string') {
            try {
              const cleaned = data.replace(/[\[\]"]/g, '');
              return cleaned ? cleaned.split(',').map(id => parseInt(id.trim())) : [];
            } catch (e) {
              console.error('Error parsing array:', e);
              return [];
            }
          }
          return [];
        };

        const skipQuestions = parseToArray(res.data.skip_question);
        const markForReview = parseToArray(res.data.mark_for_review);

        // ✅ Get attended questions from attend_question OR spent_time
        let attendQuestion = parseToArray(res.data.attend_question);

        if (attendQuestion.length === 0 && res.data.spent_time) {
          // Extract question IDs from spent_time array
          attendQuestion = res.data.spent_time.map(item => item.questionId);
          console.log('✅ Using spent_time for attended questions:', attendQuestion);
        }

        console.log('📊 Parsed Data:', {
          skipQuestions,
          markForReview,
          attendQuestion
        });

        setSkippedQuestions(skipQuestions);
        setMarkedForReview(markForReview);
        setOptionSelected(attendQuestion);

        // ✅ Calculate wrong answers (for highlighting wrong questions)
        const wrong = res.data.all_question_list
          ?.filter(q => {
            if (!attendQuestion.includes(q.id)) return false;

            const userAns = q.user_selected_ans?.toLowerCase().trim();
            if (!userAns) return false;

            const correctAnsEn = q.english_ans?.toLowerCase().trim();
            const correctAnsHi = q.hindi_ans?.toLowerCase().trim();

            const isWrong = userAns !== correctAnsEn && userAns !== correctAnsHi;

            return isWrong;
          })
          .map(q => q.id);

        console.log('✅ Wrong Questions:', wrong);
        console.log('✅ Wrong Count:', wrong.length);
        console.log('✅ Correct Count:', attendQuestion.length - wrong.length);
        console.log('✅ Expected from API - Correct:', res.data.attend_detail?.correct, 'Incorrect:', res.data.attend_detail?.in_correct);

        setWrongQuestions(wrong);

        // ✅✅✅ SET CORRECT/INCORRECT COUNTS DIRECTLY FROM API ✅✅✅
        setCorrectCount(res.data.attend_detail?.correct || 0);
        setIncorrectCount(res.data.attend_detail?.in_correct || 0);
      }
    } catch (error) {
      console.error("Error fetching solution:", error);
    } finally {
      setLoading(false);
    }
  };



  // ✅ Load User Info
  const loadUserData = async () => {
    const user = await getUserDataDecrypted();
    setUserInfo(user);
  };

  useEffect(() => {
    loadUserData();
    enterFullScreen();
  }, []);

  useEffect(() => {
    fetchUserSolution();
  }, []);

  // ✅ Group Questions by Subject
  const groupedQuestions = questionsState.reduce((acc, question) => {
    const subject = acc.find((grp) => grp.subject_name === question.subject_name);
    if (subject) {
      subject.questions.push(question);
    } else {
      acc.push({
        subject_name: question.subject_name,
        questions: [question],
      });
    }
    return acc;
  }, []);

  // ✅ Navigation Functions
  const handleNextQuestion = () => {
    if (currentQuestion === questionsState.length - 1) {
      setCurrentQuestion(0);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion === 0) {
      setCurrentQuestion(questionsState.length - 1);
    } else {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const current = questionsState[currentQuestion];

  if (loading || !current) {
    return (
      <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
        <div className="fading-spinner">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`bar bar${i + 1}`}></div>
          ))}
        </div>
      </div>
    );
  }

  const options = language === 'en'
    ? {
      a: current.option_english_a,
      b: current.option_english_b,
      c: current.option_english_c,
      d: current.option_english_d,
    }
    : {
      a: current.option_hindi_a,
      b: current.option_hindi_b,
      c: current.option_hindi_c,
      d: current.option_hindi_d,
    };

  const questionText = language === 'en' ? current.question_english : current.question_hindi;

  function renderExplanation() {
    const explanationText = language === 'en' ? current.explanation_english : current.explanation;
    if (!explanationText) return null;

    const cleaned = explanationText
      .replace(/<br\s*\/?>/gi, '')
      .replace(/<img /gi, '<img style="max-width: 100%; height: auto; max-height: 200px;" ');

    return (
      <div className='mt-4'>
        <MathRenderer text={cleaned} />
      </div>
    );
  }


  return (


    <div className="flex flex-col p-4 text-sm font-sans overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="text-lg font-bold">
          {state?.testData?.test_detail?.title || 'SSC ONLINE MOCK TEST'}
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {isFullScreen ? (
            <button
              onClick={exitFullScreen}
              className="w-full md:w-auto px-4 py-2 bg-gray-600 rounded-md text-white"
            >
              Exit Full Screen
            </button>
          ) : (
            <button
              onClick={enterFullScreen}
              className="w-full md:w-auto px-4 py-2 bg-gray-600 rounded-md text-white"
            >
              Full Screen
            </button>
          )}
          <div className="text-sm">
            Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span>
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center border-y py-3 mb-4 gap-4">
        <div className="text-red-600 font-semibold text-sm flex gap-3"></div>

        <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-1/2">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={handlePreviousQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
            >
              {"<< Previous"}
            </button>

            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
            >
              {"Next >>"}
            </button>
          </div>
          <button
            onClick={() => {
              exitFullScreen();
              nav('/analysis', { state: state?.state });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full md:w-auto"
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Solution Modal */}
        {/* <SolutionsGrideModal
          wrongQuestion={wrongQuestions}
          question={questionsState}
          groupedQuestions={groupedQuestions}
          currentQuestion={currentQuestion}
          optionSelected={optionSelected}
          markedForReview={markedForReview}
          markedForReviewAns={markedWithAns}
          skippedQuestions={skippedQuestions}
          setCurrentQuestion={(index) => setCurrentQuestion(index)}
          onClose={() => setShowModal(false)}
          onProceed={() => { }}
        /> */}

        <SolutionsGrideModal
          wrongQuestion={wrongQuestions}
          question={questionsState}
          groupedQuestions={groupedQuestions}
          currentQuestion={currentQuestion}
          optionSelected={optionSelected}
          markedForReview={markedForReview}
          markedForReviewAns={markedWithAns}
          skippedQuestions={skippedQuestions}
          correctCount={correctCount}        // ✅ ADD
          incorrectCount={incorrectCount}    // ✅ ADD
          setCurrentQuestion={(index) => setCurrentQuestion(index)}
          onClose={() => setShowModal(false)}
          onProceed={() => { }}
        />


        {/* Right Side - Question Panel */}
        <div className="flex-1 border rounded-lg px-4 py-3" id="testBg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-3">
            <div className="text-md font-bold">Question : {currentQuestion + 1}</div>
            <div className="flex gap-2 items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border text-xs px-2 py-1 rounded"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          <div className='mb-4'>
            <MathRenderer text={questionText} />
          </div>

          {/* ✅ FIXED Options - Check Against Both Languages */}
          {Object.entries(options).map(([key, value]) => {
            const userAns = current.user_selected_ans?.toLowerCase().trim();
            const optionKey = key.toLowerCase().trim();
            const isSelected = optionKey === userAns;

            // ✅ Check against BOTH English and Hindi answers
            const correctAnsEn = current.english_ans?.toLowerCase().trim();
            const correctAnsHi = current.hindi_ans?.toLowerCase().trim();
            const isCorrect = optionKey === correctAnsEn || optionKey === correctAnsHi;

            let optionClass = 'border-gray-300';

            // ✅ Priority 1: Show correct answer in green
            if (isCorrect) {
              optionClass = 'bg-green-200 border-green-500';
            }
            // ✅ Priority 2: Show user's wrong answer in red
            else if (isSelected) {
              optionClass = 'bg-red-200 border-red-500';
            }

            return (
              <div
                key={key}
                className={`border-2 p-3 mb-2 rounded flex items-center gap-1.5 option_img ${optionClass}`}
              >
                <strong>{key.toUpperCase()}.</strong> <MathRenderer text={value} />
              </div>
            );
          })}

          {/* Solution Toggle */}
          <div className="mt-3">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full sm:w-auto"
            >
              {showSolution ? 'Hide Solution' : 'View Solution'}
            </button>

            {showSolution && renderExplanation()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen7;
