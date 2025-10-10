// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { attendQuestionSubmitSlice, getSingleCategoryPackageTestseriesQuestionSlice } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import CountdownTimer from '../../components/QuestionTimer';
// import Timer from '../../components/QuestionTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage'; // path को adjust करें
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import { BlockMath, InlineMath } from 'react-katex';
// import 'katex/dist/katex.min.css';
// import MathRenderer from '../../utils/MathRenderer';
// import { secureGet } from '../../helpers/storeValues';




// const Screen5 = () => {
//     const nav = useNavigate()
//     const dispatch = useDispatch()
//     const { state } = useLocation()
//     const [userInfo, setUserInfo] = useState(null);
//     // console.log("state==>", state)
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false)
//     const [showModal, setShowModal] = useState(false)
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false)
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [spentTime, setSpentTime] = useState([]);
//     const [currentQuestionId, setCurrentQuestionId] = useState(''); // Example
//     const [language, setLanguage] = useState('en')
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false)
//     const [openModal, setOpenModal] = useState(false); // Open on mount
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const mathContainerRef = useRef(null);


//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     const testId = state?.testInfo?.test_id;



//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             if (!testId) return;

//             const [
//                 storedOptions,
//                 storedAttempted,
//                 storedMarked,
//                 storedSkipped,
//                 storedMarkedWithAns,
//             ] = await Promise.all([
//                 secureGetTestData(testId, "selectedOptions"),
//                 secureGetTestData(testId, "optionSelected"),
//                 secureGetTestData(testId, "markedForReview"),
//                 secureGetTestData(testId, "skippedQuestions"),
//                 secureGetTestData(testId, "marked_with_ans"),
//             ]);

//             if (storedOptions) setSelectedOptions(storedOptions);
//             if (storedAttempted) setOptionSelected(storedAttempted);
//             if (storedMarked) setMarkedForReview(storedMarked);
//             if (storedSkipped) setSkippedQuestions(storedSkipped);
//             if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//         };

//         restoreEncryptedTestData();
//     }, [testId]);


//     // LOAD. USER INFO
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         // console.log("lange", lang)
//         setLanguage(lang)
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);





//     const enterFullScreen = () => {
//         const elem = document.documentElement; // or use any specific element
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true)
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true)
//             /* Safari */
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true)
//             /* IE11 */
//             elem.msRequestFullscreen();
//         }
//     };


//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             // Safari
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             // IE11
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen()
//     }, [])



//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true)
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap()
//             if (res.status_code == 200) {
//                 // console.log("question data fetching", res)
//                 setQuestionsState(res.data)
//                 setLoading(false)
//                 // setRefreshing(false)
//             } else {
//                 // console.log("response", res)
//             }

//         } catch (error) {
//             setLoading(false)

//         } finally {
//             setLoading(false)
//         }



//     }


//     useEffect(() => {
//         getTestSeriesQuestion()
//     }, [])



//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "selectedOptions", selectedOptions);
//     }, [selectedOptions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "optionSelected", optionSelected);
//     }, [optionSelected]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "markedForReview", markedForReview);
//     }, [markedForReview]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//     }, [skippedQuestions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//     }, [markedWithAns]);



//     const groupedQuestions = questionsState.reduce((acc, question) => {
//         const subject = acc.find((grp) => grp.subject_name === question.subject_name);
//         if (subject) {
//             subject.questions.push(question);
//         } else {
//             acc.push({
//                 subject_name: question.subject_name,
//                 questions: [question],
//             });
//         }
//         return acc;
//     }, []);




//     // HANDLE OPTION CHANGE NEW=========>
//     const handleOptionChange = async (questionId, optionKey) => {
//         const testId = state?.testInfo?.test_id;
//         const updated = { ...selectedOptions, [questionId]: optionKey };
//         setSelectedOptions(updated);

//         const updatedData = { ...selectedOptions, [questionId]: optionKey };
//         await secureSaveTestData(testId, 'selectedOptions', updatedData);

//         if (markedForReview.includes(questionId)) {
//             if (!markedWithAns.includes(questionId)) {
//                 const updatedMarkedWithAns = [...markedWithAns, questionId];
//                 setMarkedWithAns(updatedMarkedWithAns);
//                 await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//             }
//         }

//         if (skippedQuestions.includes(questionId)) {
//             const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         // await saveUserTestLoginDataEncrypted(testId, {
//         //     selectedOptions: updated,
//         //     markedWithAns,
//         //     markedForReview,
//         //     skippedQuestions,
//         //     testInfo: state?.testInfo,
//         // });
//     };

//     const handleOptionDeselect = async (questionId) => {
//         const testId = state?.testInfo?.test_id;

//         // 1. Remove the selected option
//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         // 2. Remove from markedWithAns if it exists
//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         // 3. Add to skippedQuestions if not already present
//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         // 4. Optional: Save full test state in one place for restore (if using)
//         // await saveUserTestLoginDataEncrypted(testId, {
//         //     selectedOptions: updatedSelectedOptions,
//         //     markedWithAns: updatedMarkedWithAns,
//         //     markedForReview,
//         //     skippedQuestions: updatedSkipped,
//         //     testInfo: state?.testInfo,
//         // });
//     };



//     // HANDLE SAVE AND NEXT FUNCTION =====> NEW
//     // const handleSaveAndNext = async () => {
//     //     const testId = state?.testInfo?.test_id;
//     //     const currentId = questionsState[currentQuestion]?.id;

//     //     await updateSpentTime(currentId);

//     //     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//     //         const updatedSelected = [...optionSelected, currentId];
//     //         setOptionSelected(updatedSelected);
//     //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     //     }

//     //     if (selectedOptions[currentId] && skippedQuestions.includes(currentId)) {
//     //         const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//     //         setSkippedQuestions(updatedSkipped);
//     //         await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     //     }

//     //     // Circular navigation: go to first if last question
//     //     if (currentQuestion === questionsState.length - 1) {
//     //         setCurrentQuestion(0);
//     //     } else {
//     //         setCurrentQuestion(prev => prev + 1);
//     //     }


//     // };

//     const handleSaveAndNext = async () => {
//     const testId = state?.testInfo?.test_id;
//     const currentId = questionsState[currentQuestion]?.id;

//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];
//     const isAlreadySelected = optionSelected.includes(currentId);
//     const isAlreadyMarked = markedForReview.includes(currentId);
//     const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//     // ✅ FIXED: Ensure all state updates are completed before navigation
//     let updatedSelected = optionSelected;
//     let updatedSkipped = skippedQuestions;
//     let updatedMarkedWithAns = markedWithAns;
//     let updatedMarked = markedForReview;

//     // Add to optionSelected if not already
//     if (isOptionSelected && !isAlreadySelected) {
//         updatedSelected = [...optionSelected, currentId];
//         setOptionSelected(updatedSelected);
//         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     // Remove from skippedQuestions if present
//     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//         updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//         setSkippedQuestions(updatedSkipped);
//         await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     // If markedForReview but now answered, move to markedWithAns
//     if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//         updatedMarkedWithAns = [...markedWithAns, currentId];
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//         updatedMarked = markedForReview.filter(id => id !== currentId);
//         setMarkedForReview(updatedMarked);
//         await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }

//     // ✅ If already in markedWithAns, remove from BOTH lists (cleanup)
//     if (isAlreadyMarkedWithAns) {
//         updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (isAlreadyMarked) {
//         updatedMarked = markedForReview.filter(id => id !== currentId);
//         setMarkedForReview(updatedMarked);
//         await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }

//     // ✅ FIXED: Enable circular navigation instead of auto-submit
//     if (currentQuestion === questionsState.length - 1) {
//         setCurrentQuestion(0); // Go back to first question
//     } else {
//         setCurrentQuestion(prev => prev + 1);
//     }

//     // console.log("✅ Question saved and navigated successfully");
// };









//     // HANDLE MARK FOR REVIEW FUNCTION ====> NEW
//     // const handleMarkForReview = async () => {
//     //     const testId = state?.testInfo?.test_id;
//     //     const currentId = questionsState[currentQuestion]?.id;

//     //     const isOptionSelected = !!selectedOptions[currentId];
//     //     const isAlreadyMarked = markedForReview.includes(currentId);
//     //     const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//     //     if (isOptionSelected && !isAlreadyMarkedWithAns) {
//     //         const updatedMarkedWithAns = [...markedWithAns, currentId];
//     //         setMarkedWithAns(updatedMarkedWithAns);
//     //         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     //     }

//     //     if (!isOptionSelected && !isAlreadyMarked) {
//     //         const updatedMarked = [...markedForReview, currentId];
//     //         setMarkedForReview(updatedMarked);
//     //         await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     //     }

//     //     setCurrentQuestion(prev => prev + 1);


//     // };

//     const handleMarkForReview = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         if (isOptionSelected && !isAlreadyMarkedWithAns) {
//             const updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (!isOptionSelected && !isAlreadyMarked) {
//             const updatedMarked = [...markedForReview, currentId];
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         // setCurrentQuestion(prev => prev + 1);
//         if (currentQuestion === questionsState.length - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };





//     // HANDLE NEXT QUESTION ==== >
//     const handleNextQuestion = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         // Circular navigation: go to first if last question
//         if (currentQuestion === questionsState.length - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//         // setCurrentQuestion(prev => prev + 1);

//         // await saveUserTestLoginDataEncrypted(testId, {
//         //     selectedOptions,
//         //     skippedQuestions,
//         //     testInfo: state?.testInfo,
//         // });
//     };



//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);





//     // UPDATE SPANT TIME NEW ======>
//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000); // in seconds
//         const testId = state?.testInfo?.test_id;

//         let existing = await secureGetTestData(testId, 'spentTime');
//         existing = existing || [];

//         const updated = (() => {
//             const found = existing.find(item => item.questionId === questionId);
//             if (found) {
//                 return existing.map(item =>
//                     item.questionId === questionId
//                         ? { ...item, time: item.time + timeSpentOnQuestion }
//                         : item
//                 );
//             } else {
//                 return [...existing, { questionId, time: timeSpentOnQuestion }];
//             }
//         })();

//         await secureSaveTestData(testId, 'spentTime', updated);
//         // console.log('✅ Updated Spent Time:', updated);
//     };


//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);  // हर बार question बदलने पर नया timer start हो

//     // Reset भी कर दो जब question change हो
//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);


//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };




//     const current = questionsState[currentQuestion];
//     // // console.log("cureree====>", current)
//     if (!current) return <div className="p-4-400 text-red-500 w-full h-full flex items-center justify-center">
//         <div className="fading-spinner">
//             {[...Array(12)].map((_, i) => (
//                 <div key={i} className={`bar bar${i + 1}`}></div>
//             ))}
//         </div>
//     </div>;

//     const options = language === 'en'
//         ? {
//             a: current.option_english_a,
//             b: current.option_english_b,
//             c: current.option_english_c,
//             d: current.option_english_d,
//         }
//         : {
//             a: current.option_hindi_a,
//             b: current.option_hindi_b,
//             c: current.option_hindi_c,
//             d: current.option_hindi_d,
//         };



//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };




//     // NEW CODE 
//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         // console.log("⏸️ Test paused and state saved.");

//         const currentTestId = state?.testInfo?.test_id;


//         try {
//             // 🔁 Always use 'pause_status' as key
//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];

//             // 🧹 Remove old entry for current test if it exists
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             // ➕ Push current test pause status
//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//             });

//             // 💾 Save back to 'pause_status' key
//             await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);

//             exitFullScreen();
//             nav('/testpakages', { replace: true, state: { testId: state?.testId } });

//         } catch (error) {
//             console.error("❌ Failed to pause test securely:", error);
//         }
//     };



//     const handleCancelPause = () => {
//         setShowPauseModal(false);
//     };



//     const questionText = language === 'en' ? current.question_english : current.question_hindi;
//     // console.log("question text", questionText)

//     const totalTimeSpent = Object.values(spentTime).reduce((sum, val) => sum + val, 0);








//     // HANLDE SUBMIT NEW CODE ====>
//     const handleSubmit = async () => {

//         // if (selectedOptions[current.id]) {

//         //     handleSaveAndNext()
//         // }
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         // ✅ Ensure current question's answer is saved
//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }


//         // ✅ Use encrypted storage and await the values
//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview = await secureGetTestData(testId, 'markedForReview') || [];
//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;



//         let correct = 0;
//         let in_correct = 0;

//         const allAttendedQuestions = optionSelected.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);

//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             // ✅ FIX: Use case-insensitive comparison
//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns
//             };
//         });



//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const statMark = parseFloat(state?.testDetail[0]?.marks || 0);
//         // console.log(statMark)
//         const markPer_ques = statMark / questionsState.length
//         // console.log(markPer_ques)
//         //  (correct * markPer_ques) - (inCorrect * negativeMark)
//         const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//         const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//         const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct,
//             marks: marksScored,
//             time: totalTimeSpent,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: spentTime,
//             skip_question: skippedQuestions,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview
//         };

//         // console.log("📤 Submission Data:", submissionData);


//         try {


//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//             if (res.status_code == 200) {
//                 // ✅ Clear all encrypted test data
//                 await clearAllTestData(testId);

//                 nav('/analysis', { replace: true, state });
//             } else {
//                 // alert('please attend minimum one question (save & next) after submit!!')
//                 console.log(res)
//             }



//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//         } finally {

//         }
//     };



//     return (


//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm">
//                     <TestTimer textleft={'Time Left:'} testId={state?.testInfo?.test_id} timeInMinutes={state?.testInfo?.time} onTimeUp={() => handleSubmit()} />
//                 </div>
//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs">Puase</button>
//                     {isFullScreen ? (
//                         <button onClick={() => { setIsFullScreen(false); exitFullScreen(); }} className="px-4 py-2 bg-gray-600 rounded-md text-white">Exit Full Screen</button>
//                     ) : (
//                         <button onClick={() => { setIsFullScreen(true); enterFullScreen(); }} className="px-4 py-2 bg-gray-600 rounded-md text-white">Full Screen</button>
//                     )}
//                     <div className="text-sm">Name : <span className="font-semibold">{userInfo.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button onMouseEnter={() => setIsModalOpen(true)} className="text-orange-600 font-bold px-4 py-2 rounded text-base">SYMBOLS</button>
//                     <button onMouseEnter={() => setOpenModal(true)} className="text-orange-600 font-bold px-4 py-2 rounded text-base">INSTRUCTIONS</button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button onClick={() => handleOptionDeselect(current.id)} className="bg-red-500 text-white px-3 py-2 rounded text-sm">Clear Option</button>
//                         )}
//                         <button onClick={handleMarkForReview} className="bg-blue-500 text-white px-6 py-2 rounded text-sm">Mark for Review</button>
//                         {selectedOptions[current.id] ? (
//                             <button onClick={handleSaveAndNext} className="bg-green-600 text-white px-6 py-2 rounded text-sm">Save & Next</button>
//                         ) : (
//                             <button onClick={handleNextQuestion} className="bg-blue-500 text-white px-6 py-2 rounded text-sm">Next</button>
//                         )}
//                         <button onClick={() => setConfirmSubmit(true)} className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded">Submit</button>
//                     </div>
//                     <div className="text-right w-full lg:w-auto">
//                         <TestTimer timeClr='text-blue-800' textleft={'LAST'} textBg='text-red-600' timeTextSize='text-2xl' textRight={'Minutes'} showSeconds={false} testId={state?.testInfo?.test_id} timeInMinutes={state?.testInfo?.time} onTimeUp={() => handleSubmit()} />
//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 <QuestionGridModal
//                     question={questionsState}
//                     groupedQuestions={groupedQuestions}
//                     currentQuestion={currentQuestion}
//                     optionSelected={optionSelected}
//                     markedForReview={markedForReview}
//                     markedForReviewAns={markedWithAns}
//                     skippedQuestions={skippedQuestions}
//                     setCurrentQuestion={(index) => setCurrentQuestion(index)}
//                     onClose={() => setShowModal(false)}
//                     onProceed={() => { }}
//                 />

//                 <div className="flex-1 relative border px-4 py-3" id="testBg">
//                     <div className="flex justify-between items-center mb-2">
//                         <div className="text-sm font-bold">Question : {currentQuestion + 1}</div>
//                         <div className="flex flex-col gap-2 text-xs">
//                             <div className="text-gray-600 font-semibold">Time: {formatTime(elapsedSeconds)}</div>
//                             <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border text-xs px-2 py-1 rounded">
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>
//                         </div>
//                     </div>
//                     {/* <div className="mb-2 text-sm" dangerouslySetInnerHTML={{ __html: questionText }} /> */}
//                     <MathRenderer text={questionText} />
//                     <div className="flex flex-col gap-2">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label key={key} className="flex items-center gap-2 option_img">
//                                 <input type="radio" name={`question_${current.id}`} value={key} checked={selectedOptions[current.id] === key} onChange={() => handleOptionChange(current.id, key)} />
//                                 {/* <span className="option-content text-sm" dangerouslySetInnerHTML={{ __html: value }} /> */}
//                                 <MathRenderer text={value} />
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Modals */}
//             <PauseTestModal isOpen={showPauseModal} onConfirm={handleConfirmPause} onCancel={handleCancelPause} />
//             <ConfirmTestSubmitModal show={confirmSubmit} onClose={() => setConfirmSubmit(false)} onConfirm={handleSubmit} />
//             <ExamInstructionsModal isOpen={openModal} onClose={() => setOpenModal(false)} onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }} testInfo={state?.testInfo || {}} testData={state?.testDetail || []} />
//             <SymbolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//         </div>



//     );
// };

// export default Screen5;



import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    attendQuestionSubmitSlice, 
    getSingleCategoryPackageTestseriesQuestionSlice,
    saveCollectionSlice,
    removeUserCollectionSlice,
    getUserCollectionDetailSlice
} from '../../redux/HomeSlice';
import QuestionGridModal from '../../components/QuestionGridModal';
import TestTimer from '../../components/TestTimer';
import PauseTestModal from '../../components/PauseTestModal';
import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
import ExamInstructionsModal from '../../components/ExamInstructionsModal';
import SymbolModal from '../../components/SymbolModal';
import MathRenderer from '../../utils/MathRenderer';
import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
import {
    secureSaveTestData,
    secureGetTestData,
    clearAllTestData,
} from '../../helpers/testStorage';
import { getUserDataDecrypted } from '../../helpers/userStorage';
import { secureGet } from '../../helpers/storeValues';
import 'katex/dist/katex.min.css';
import { reportedQuestionSlice } from '../../redux/authSlice';

const Screen5 = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    
    // Basic States
    const [userInfo, setUserInfo] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questionsState, setQuestionsState] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [language, setLanguage] = useState('en');
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Question States
    const [selectedOptions, setSelectedOptions] = useState({});
    const [optionSelected, setOptionSelected] = useState([]);
    const [markedForReview, setMarkedForReview] = useState([]);
    const [skippedQuestions, setSkippedQuestions] = useState([]);
    const [markedWithAns, setMarkedWithAns] = useState([]);

    // Bookmark & Report States
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportLoading, setReportLoading] = useState(false);

    const testId = state?.testInfo?.test_id;

    // Restore Test Data
    useEffect(() => {
        const restoreEncryptedTestData = async () => {
            if (!testId) return;

            const [
                storedOptions,
                storedAttempted,
                storedMarked,
                storedSkipped,
                storedMarkedWithAns,
            ] = await Promise.all([
                secureGetTestData(testId, "selectedOptions"),
                secureGetTestData(testId, "optionSelected"),
                secureGetTestData(testId, "markedForReview"),
                secureGetTestData(testId, "skippedQuestions"),
                secureGetTestData(testId, "marked_with_ans"),
            ]);

            if (storedOptions) setSelectedOptions(storedOptions);
            if (storedAttempted) setOptionSelected(storedAttempted);
            if (storedMarked) setMarkedForReview(storedMarked);
            if (storedSkipped) setSkippedQuestions(storedSkipped);
            if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
        };

        restoreEncryptedTestData();
    }, [testId]);

    // Load User Data
    const loadUserData = async () => {
        const user = await getUserDataDecrypted();
        const lang = await secureGet("language");
        setLanguage(lang);
        setUserInfo(user);
    };

    useEffect(() => {
        loadUserData();
    }, []);

    // Fetch Bookmarked Questions
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
                if (res.status_code === 200) {
                    const questionIds = (res.data.question_id?.data || []).map(item => item.id);
                    setBookmarkedQuestions(questionIds);
                }
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
            }
        };
        fetchBookmarks();
    }, [dispatch]);

    // Toggle Bookmark
    const handleToggleBookmark = async () => {
        const currentQuestionId = questionsState[currentQuestion]?.id;
        const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

        setBookmarkLoading(true);

        if (isBookmarked) {
            setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
        } else {
            setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
        }

        try {
            let result;
            if (isBookmarked) {
                result = await dispatch(removeUserCollectionSlice({
                    video_id: [],
                    lession_id: [],
                    class_note_id: [],
                    study_note_id: [],
                    article_id: [],
                    news_id: [],
                    question_id: [currentQuestionId],
                    test_series_id: [],
                    package_id: []
                })).unwrap();
            } else {
                result = await dispatch(saveCollectionSlice({
                    video_id: [],
                    lession_id: [],
                    class_note_id: [],
                    study_note_id: [],
                    article_id: [],
                    news_id: [],
                    question_id: [currentQuestionId],
                    test_series_id: [],
                    package_id: []
                })).unwrap();
            }

            if (result.status_code === 200) {
                showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
            } else {
                if (isBookmarked) {
                    setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
                } else {
                    setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
                }
                showErrorToast('Failed to update bookmark');
            }
        } catch (error) {
            console.error('Bookmark error:', error);
            if (isBookmarked) {
                setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
            } else {
                setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
            }
            showErrorToast('Something went wrong');
        } finally {
            setBookmarkLoading(false);
        }
    };

    // Handle Report Question
  // Replace the existing handleReportQuestion function with this:
const handleReportQuestion = async () => {
    if (!reportReason.trim()) {
        showErrorToast('Please enter a reason');
        return;
    }

    setReportLoading(true);
    const currentQuestionId = questionsState[currentQuestion]?.id;

    try {
        // ✅ API call with proper data structure
        const reportData = {
            question_id: currentQuestionId,
            reason: reportReason,
            test_id: state?.testInfo?.test_id, // Optional: if you want to track which test
        };

        const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

        if (res.status_code === 200 || res.success) {
            showSuccessToast('Question reported successfully');
            setShowReportModal(false);
            setReportReason('');
        } else {
            showErrorToast(res.message || 'Failed to report question');
        }
    } catch (error) {
        console.error('Report error:', error);
        showErrorToast(error.message || 'Failed to report question');
    } finally {
        setReportLoading(false);
    }
};

    // Fullscreen Functions
    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
            setIsFullScreen(true);
        } else if (elem.webkitRequestFullscreen) {
            setIsFullScreen(true);
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            setIsFullScreen(true);
            elem.msRequestFullscreen();
        }
    };

    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    };

    useEffect(() => {
        enterFullScreen();
    }, []);

    // Fetch Questions
    const getTestSeriesQuestion = async () => {
        try {
            setLoading(true);
            const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
            if (res.status_code == 200) {
                setQuestionsState(res.data);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTestSeriesQuestion();
    }, []);

    // Save Test Data
    useEffect(() => {
        if (!testId) return;
        secureSaveTestData(testId, "selectedOptions", selectedOptions);
    }, [selectedOptions]);

    useEffect(() => {
        if (!testId) return;
        secureSaveTestData(testId, "optionSelected", optionSelected);
    }, [optionSelected]);

    useEffect(() => {
        if (!testId) return;
        secureSaveTestData(testId, "markedForReview", markedForReview);
    }, [markedForReview]);

    useEffect(() => {
        if (!testId) return;
        secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
    }, [skippedQuestions]);

    useEffect(() => {
        if (!testId) return;
        secureSaveTestData(testId, "marked_with_ans", markedWithAns);
    }, [markedWithAns]);

    // Group Questions
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

    // Handle Option Change
    const handleOptionChange = async (questionId, optionKey) => {
        const testId = state?.testInfo?.test_id;
        const updated = { ...selectedOptions, [questionId]: optionKey };
        setSelectedOptions(updated);

        const updatedData = { ...selectedOptions, [questionId]: optionKey };
        await secureSaveTestData(testId, 'selectedOptions', updatedData);

        if (markedForReview.includes(questionId)) {
            if (!markedWithAns.includes(questionId)) {
                const updatedMarkedWithAns = [...markedWithAns, questionId];
                setMarkedWithAns(updatedMarkedWithAns);
                await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
            }
        }

        if (skippedQuestions.includes(questionId)) {
            const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
            setSkippedQuestions(updatedSkipped);
            await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
        }
    };

    // Handle Option Deselect
    const handleOptionDeselect = async (questionId) => {
        const testId = state?.testInfo?.test_id;

        const updatedSelectedOptions = { ...selectedOptions };
        delete updatedSelectedOptions[questionId];
        setSelectedOptions(updatedSelectedOptions);
        await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

        let updatedMarkedWithAns = markedWithAns;
        if (markedWithAns.includes(questionId)) {
            updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
            setMarkedWithAns(updatedMarkedWithAns);
            await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
        }

        let updatedSkipped = skippedQuestions;
        if (!skippedQuestions.includes(questionId)) {
            updatedSkipped = [...skippedQuestions, questionId];
            setSkippedQuestions(updatedSkipped);
            await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
        }
    };

    // Handle Save And Next
    const handleSaveAndNext = async () => {
        const testId = state?.testInfo?.test_id;
        const currentId = questionsState[currentQuestion]?.id;

        await updateSpentTime(currentId);

        const isOptionSelected = !!selectedOptions[currentId];
        const isAlreadySelected = optionSelected.includes(currentId);
        const isAlreadyMarked = markedForReview.includes(currentId);
        const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

        let updatedSelected = optionSelected;
        let updatedSkipped = skippedQuestions;
        let updatedMarkedWithAns = markedWithAns;
        let updatedMarked = markedForReview;

        if (isOptionSelected && !isAlreadySelected) {
            updatedSelected = [...optionSelected, currentId];
            setOptionSelected(updatedSelected);
            await secureSaveTestData(testId, 'optionSelected', updatedSelected);
        }

        if (isOptionSelected && skippedQuestions.includes(currentId)) {
            updatedSkipped = skippedQuestions.filter(id => id !== currentId);
            setSkippedQuestions(updatedSkipped);
            await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
        }

        if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
            updatedMarkedWithAns = [...markedWithAns, currentId];
            setMarkedWithAns(updatedMarkedWithAns);
            await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

            updatedMarked = markedForReview.filter(id => id !== currentId);
            setMarkedForReview(updatedMarked);
            await secureSaveTestData(testId, 'markedForReview', updatedMarked);
        }

        if (isAlreadyMarkedWithAns) {
            updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
            setMarkedWithAns(updatedMarkedWithAns);
            await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
        }

        if (isAlreadyMarked) {
            updatedMarked = markedForReview.filter(id => id !== currentId);
            setMarkedForReview(updatedMarked);
            await secureSaveTestData(testId, 'markedForReview', updatedMarked);
        }

        if (currentQuestion === questionsState.length - 1) {
            setCurrentQuestion(0);
        } else {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    // Handle Mark For Review
    const handleMarkForReview = async () => {
        const testId = state?.testInfo?.test_id;
        const currentId = questionsState[currentQuestion]?.id;

        const isOptionSelected = !!selectedOptions[currentId];
        const isAlreadyMarked = markedForReview.includes(currentId);
        const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

        if (isOptionSelected && !isAlreadyMarkedWithAns) {
            const updatedMarkedWithAns = [...markedWithAns, currentId];
            setMarkedWithAns(updatedMarkedWithAns);
            await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
        }

        if (!isOptionSelected && !isAlreadyMarked) {
            const updatedMarked = [...markedForReview, currentId];
            setMarkedForReview(updatedMarked);
            await secureSaveTestData(testId, 'markedForReview', updatedMarked);
        }

        if (currentQuestion === questionsState.length - 1) {
            setCurrentQuestion(0);
        } else {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    // Handle Next Question
    const handleNextQuestion = async () => {
        const testId = state?.testInfo?.test_id;
        const currentId = questionsState[currentQuestion]?.id;

        await updateSpentTime(currentId);

        if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
            const updatedSkipped = [...skippedQuestions, currentId];
            setSkippedQuestions(updatedSkipped);
            await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
        }

        if (currentQuestion === questionsState.length - 1) {
            setCurrentQuestion(0);
        } else {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    // Update Spent Time
    useEffect(() => {
        setQuestionStartTime(Date.now());
    }, [currentQuestion]);

    const updateSpentTime = async (questionId) => {
        const now = Date.now();
        const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
        const testId = state?.testInfo?.test_id;

        let existing = await secureGetTestData(testId, 'spentTime');
        existing = existing || [];

        const updated = (() => {
            const found = existing.find(item => item.questionId === questionId);
            if (found) {
                return existing.map(item =>
                    item.questionId === questionId
                        ? { ...item, time: item.time + timeSpentOnQuestion }
                        : item
                );
            } else {
                return [...existing, { questionId, time: timeSpentOnQuestion }];
            }
        })();

        await secureSaveTestData(testId, 'spentTime', updated);
    };

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentQuestion]);

    useEffect(() => {
        setElapsedSeconds(0);
    }, [currentQuestion]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Current Question
    const current = questionsState[currentQuestion];
    if (!current) return (
        <div className="p-4-400 text-red-500 w-full h-full flex items-center justify-center">
            <div className="fading-spinner">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`bar bar${i + 1}`}></div>
                ))}
            </div>
        </div>
    );

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

    // Pause Functions
    const handlePauseClick = () => {
        setShowPauseModal(true);
    };

    const handleConfirmPause = async () => {
        setShowPauseModal(false);
        const currentTestId = state?.testInfo?.test_id;

        try {
            const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
            const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

            updatedStatus.push({
                test_id: currentTestId,
                isPaused: true,
            });

            await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
            exitFullScreen();
            nav('/testpakages', { replace: true, state: { testId: state?.testId } });
        } catch (error) {
            console.error("❌ Failed to pause test securely:", error);
        }
    };

    const handleCancelPause = () => {
        setShowPauseModal(false);
    };

    const questionText = language === 'en' ? current.question_english : current.question_hindi;

    // Submit Test
    const handleSubmit = async () => {
        const testId = state?.testInfo?.test_id;
        const currentId = questionsState[currentQuestion]?.id;

        if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
            const updatedSelected = [...optionSelected, currentId];
            await secureSaveTestData(testId, 'optionSelected', updatedSelected);
        }

        const spentTime = await secureGetTestData(testId, 'spentTime') || [];
        const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
        const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
        const skippedQuestions = await secureGetTestData(testId, 'skippedQuestions') || [];
        const markedForReview = await secureGetTestData(testId, 'markedForReview') || [];
        const totalAttendedQuestions = optionSelected2.length;
        const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

        let correct = 0;
        let in_correct = 0;

        const allAttendedQuestions = optionSelected.map((questionId) => {
            const question = questionsState.find(q => q.id === questionId);
            const selectedAns = selectedOptions2[questionId];
            const rightAns = question?.hindi_ans;

            if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
                correct++;
            } else {
                in_correct++;
            }

            return {
                question_id: questionId,
                user_selected_ans: selectedAns,
                right_ans: rightAns
            };
        });

        const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
        const statMark = parseFloat(state?.testDetail[0]?.marks || 0);
        const markPer_ques = statMark / questionsState.length;
        const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
        const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

        const submissionData = {
            test_id: testId,
            total_attend_question: totalAttendedQuestions,
            total_not_answer_question: totalNotAnsweredQuestions,
            correct,
            in_correct,
            marks: marksScored,
            time: totalTimeSpent,
            negative_mark: negativeMark,
            all_attend_question: allAttendedQuestions,
            spent_time: spentTime,
            skip_question: skippedQuestions,
            attend_question: optionSelected2,
            mark_for_review: markedForReview
        };

        try {
            const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
            if (res.status_code == 200) {
                await clearAllTestData(testId);
                nav('/analysis', { replace: true, state });
            }
        } catch (error) {
            console.error("❌ Error in Submitting Test:", error);
        }
    };

    const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

    return (
        <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>
                <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm">
                    <TestTimer 
                        textleft={'Time Left:'} 
                        testId={state?.testInfo?.test_id} 
                        timeInMinutes={state?.testInfo?.time} 
                        onTimeUp={() => handleSubmit()} 
                    />
                </div>
                <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
                    <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
                    {isFullScreen ? (
                        <button 
                            onClick={() => { setIsFullScreen(false); exitFullScreen(); }} 
                            className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
                        >
                            Exit Full Screen
                        </button>
                    ) : (
                        <button 
                            onClick={() => { setIsFullScreen(true); enterFullScreen(); }} 
                            className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
                        >
                            Full Screen
                        </button>
                    )}
                    <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
                </div>
            </div>

            {/* Top Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
                <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
                    <button 
                        onMouseEnter={() => setIsModalOpen(true)} 
                        className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
                    >
                        SYMBOLS
                    </button>
                    <button 
                        onMouseEnter={() => setOpenModal(true)} 
                        className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
                    >
                        INSTRUCTIONS
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {selectedOptions[current.id] && (
                            <button 
                                onClick={() => handleOptionDeselect(current.id)} 
                                className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
                            >
                                Clear Option
                            </button>
                        )}
                        <button 
                            onClick={handleMarkForReview} 
                            className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
                        >
                            Mark for Review
                        </button>
                        {selectedOptions[current.id] ? (
                            <button 
                                onClick={handleSaveAndNext} 
                                className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
                            >
                                Save & Next
                            </button>
                        ) : (
                            <button 
                                onClick={handleNextQuestion} 
                                className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
                            >
                                Next
                            </button>
                        )}
                        <button 
                            onClick={() => setConfirmSubmit(true)} 
                            className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        >
                            Submit Test
                        </button>
                    </div>
                    <div className="text-right w-full lg:w-auto">
                        <TestTimer 
                            timeClr='text-blue-800' 
                            textleft={'LAST'} 
                            textBg='text-red-600' 
                            timeTextSize='text-2xl' 
                            textRight={'Minutes'} 
                            showSeconds={false} 
                            testId={state?.testInfo?.test_id} 
                            timeInMinutes={state?.testInfo?.time} 
                            onTimeUp={() => handleSubmit()} 
                        />
                    </div>
                </div>
            </div>

            {/* Main Body */}
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                <QuestionGridModal
                    question={questionsState}
                    groupedQuestions={groupedQuestions}
                    currentQuestion={currentQuestion}
                    optionSelected={optionSelected}
                    markedForReview={markedForReview}
                    markedForReviewAns={markedWithAns}
                    skippedQuestions={skippedQuestions}
                    setCurrentQuestion={(index) => setCurrentQuestion(index)}
                    onClose={() => setShowModal(false)}
                    onProceed={() => {}}
                />

                <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
                    {/* Question Header with Bookmark & Report */}
                    <div className="flex justify-between items-center mb-4 pb-3 border-b">
                        <div className="flex items-center gap-4">
                            <div className="text-base font-bold text-gray-900">
                                Question {currentQuestion + 1}/{questionsState.length}
                            </div>
                            <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                                Time: {formatTime(elapsedSeconds)}
                            </div>
                        </div>
                        
                        {/* Bookmark & Report Icons */}
                        <div className="flex items-center gap-2">
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)} 
                                className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                            </select>

                            <button
                                onClick={handleToggleBookmark}
                                disabled={bookmarkLoading}
                                className={`p-2.5 rounded-lg transition-all shadow-md ${
                                    isCurrentBookmarked 
                                        ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                            >
                                {bookmarkLoading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : isCurrentBookmarked ? (
                                    <BookmarkCheck size={20} />
                                ) : (
                                    <Bookmark size={20} />
                                )}
                            </button>

                            <button
                                onClick={() => setShowReportModal(true)}
                                className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
                                title="Report Question"
                            >
                                <Flag size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Question Text */}
                    <div className="mb-6">
                        <MathRenderer text={questionText} />
                    </div>

                    {/* Options */}
                    <div className="flex flex-col gap-3">
                        {Object.entries(options).map(([key, value]) => (
                            <label 
                                key={key} 
                                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${
                                    selectedOptions[current.id] === key 
                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                        : 'border-gray-200'
                                }`}
                            >
                                <input 
                                    type="radio" 
                                    name={`question_${current.id}`} 
                                    value={key} 
                                    checked={selectedOptions[current.id] === key} 
                                    onChange={() => handleOptionChange(current.id, key)}
                                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex-1 option-content text-sm">
                                    <MathRenderer text={value} />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Flag className="text-red-600" size={24} />
                                Report Question
                            </h3>
                            <button
                                onClick={() => {
                                    setShowReportModal(false);
                                    setReportReason('');
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={22} className="text-gray-600" />
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">
                            Help us improve! Please describe the issue with this question:
                        </p>
                        
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="E.g., Wrong answer, unclear question, typo..."
                            className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
                            rows={5}
                        />
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowReportModal(false);
                                    setReportReason('');
                                }}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReportQuestion}
                                disabled={reportLoading || !reportReason.trim()}
                                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {reportLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Report'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* All Other Modals */}
            <PauseTestModal 
                isOpen={showPauseModal} 
                onConfirm={handleConfirmPause} 
                onCancel={handleCancelPause} 
            />
            <ConfirmTestSubmitModal 
                show={confirmSubmit} 
                onClose={() => setConfirmSubmit(false)} 
                onConfirm={handleSubmit} 
            />
            <ExamInstructionsModal 
                isOpen={openModal} 
                onClose={() => setOpenModal(false)} 
                onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }} 
                testInfo={state?.testInfo || {}} 
                testData={state?.testDetail || []} 
            />
            <SymbolModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};

export default Screen5;
