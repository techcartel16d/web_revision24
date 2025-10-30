// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();
//     console.log('Screen5(Test Screen) State Data', state)
//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // Restore Test Data
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

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionId = questionsState[currentQuestion]?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     // Replace the existing handleReportQuestion function with this:
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionId = questionsState[currentQuestion]?.id;

//         try {
//             // ✅ API call with proper data structure
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id, // Optional: if you want to track which test
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
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

//     // Group Questions
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

//     // Handle Option Change
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
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const testId = state?.testInfo?.test_id;

//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Save And Next
//     const handleSaveAndNext = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (currentQuestion === questionsState.length - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Handle Mark For Review
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

//         if (currentQuestion === questionsState.length - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Handle Next Question
//     const handleNextQuestion = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (currentQuestion === questionsState.length - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
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
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // Current Question
//     const current = questionsState[currentQuestion];
//     if (!current) return (
//         <div className="p-4-400 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

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

//     // Pause Functions
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//             });

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

//     // Submit Test
//     const handleSubmit = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

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
//         const markPer_ques = statMark / questionsState.length;
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

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//             if (res.status_code == 200) {
//                 await clearAllTestData(testId);
//                 nav('/analysis', { replace: true, state });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//         }
//     };

//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm">
//                     <TestTimer
//                         textleft={'Time Left:'}
//                         testId={state?.testInfo?.test_id}
//                         timeInMinutes={state?.testInfo?.time}
//                         onTimeUp={() => handleSubmit()}
//                     />
//                 </div>
//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}
//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>
//                     <div className="text-right w-full lg:w-auto">
//                         <TestTimer
//                             timeClr='text-blue-800'
//                             textleft={'LAST'}
//                             textBg='text-red-600'
//                             timeTextSize='text-2xl'
//                             textRight={'Minutes'}
//                             showSeconds={false}
//                             testId={state?.testInfo?.test_id}
//                             timeInMinutes={state?.testInfo?.time}
//                             onTimeUp={() => handleSubmit()}
//                         />
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

//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header with Bookmark & Report */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             <div className="text-base font-bold text-gray-900">
//                                 Question {currentQuestion + 1}/{questionsState.length}
//                             </div>
//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Report Modal */}
//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* All Other Modals */}
//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default Screen5;

// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();
//     console.log('Screen5(Test Screen) State Data', state);

//     // ✅ Check if sectional test
//     const isSectionalTest =
//         state?.packageDetail?.exam_category?.title === 'SSC' &&
//         state?.testInfo?.test_series_type === 'mains';

//     console.log('🎯 Is Sectional Test:', isSectionalTest);

//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // ✅ Sectional Test States
//     const [currentSection, setCurrentSection] = useState(0);
//     const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
//     const [sectionCompleted, setSectionCompleted] = useState([]);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // ✅ Group questions by subject (for sectional tests)
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

//     // ✅ Get current section data
//     const getCurrentSectionData = () => {
//         if (!isSectionalTest || groupedQuestions.length === 0) return null;

//         const sectionData = state?.testDetail[currentSection];
//         const sectionQuestions = groupedQuestions[currentSection]?.questions || [];

//         return {
//             sectionName: groupedQuestions[currentSection]?.subject_name || `Section ${currentSection + 1}`,
//             sectionTime: sectionData?.sectional_time || 0,
//             totalQuestions: sectionQuestions.length,
//             questions: sectionQuestions
//         };
//     };

//     const currentSectionData = getCurrentSectionData();

//     // ✅ Handle Section Submit (NO API CALL - Only state update)
//     const handleSectionSubmit = () => {
//         setShowSectionSubmitConfirm(true);
//     };

//     const confirmSectionSubmit = async () => {
//         setShowSectionSubmitConfirm(false);

//         // ✅ Mark current section as completed (NO API CALL)
//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         // ✅ Move to next section or show final submit
//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Section ${currentSection + 1} completed! Moving to Section ${currentSection + 2}`);
//         } else {
//             // ✅ All sections completed - Show submit test button
//             showSuccessToast('All sections completed! Please submit the test.');
//         }
//     };

//     // ✅ Handle Section Time Up (Auto-advance to next section, NO API CALL)
//     const handleSectionTimeUp = async () => {
//         console.log('⏰ Section time up!');

//         // Mark section as completed
//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         // Auto-move to next section
//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Time up! Moving to Section ${currentSection + 2}`);
//         } else {
//             // ✅ Last section time up - Submit entire test
//             showSuccessToast('Test time completed! Submitting test...');
//             await handleSubmit();
//         }
//     };

//     // ✅ Initialize Sectional Test - Clear old data on fresh start
//     useEffect(() => {
//         const initializeSectionalTest = async () => {
//             if (!testId || !isSectionalTest) return;

//             // ✅ Check if this is a fresh start
//             const existingOptions = await secureGetTestData(testId, "selectedOptions");
//             const existingSection = await secureGetTestData(testId, "currentSection");
//             const existingCompleted = await secureGetTestData(testId, "sectionCompleted");

//             console.log('📊 Existing data check:', {
//                 hasOptions: !!existingOptions,
//                 optionsCount: existingOptions ? Object.keys(existingOptions).length : 0,
//                 currentSection: existingSection,
//                 completedSections: existingCompleted
//             });

//             // ✅ If no previous data, this is a fresh attempt
//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh test attempt - Resetting sectional data');
//                 setCurrentSection(0);
//                 setSectionCompleted([]);
//                 await secureSaveTestData(testId, "currentSection", 0);
//                 await secureSaveTestData(testId, "sectionCompleted", []);
//             }
//         };

//         // ✅ Only run after questions are loaded
//         if (questionsState.length > 0 && groupedQuestions.length > 0) {
//             initializeSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length]);

//     // ✅ Restore Test Data with validation
//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             if (!testId) return;

//             const [
//                 storedOptions,
//                 storedAttempted,
//                 storedMarked,
//                 storedSkipped,
//                 storedMarkedWithAns,
//                 storedCurrentSection,
//                 storedCompletedSections
//             ] = await Promise.all([
//                 secureGetTestData(testId, "selectedOptions"),
//                 secureGetTestData(testId, "optionSelected"),
//                 secureGetTestData(testId, "markedForReview"),
//                 secureGetTestData(testId, "skippedQuestions"),
//                 secureGetTestData(testId, "marked_with_ans"),
//                 secureGetTestData(testId, "currentSection"),
//                 secureGetTestData(testId, "sectionCompleted"),
//             ]);

//             if (storedOptions) setSelectedOptions(storedOptions);
//             if (storedAttempted) setOptionSelected(storedAttempted);
//             if (storedMarked) setMarkedForReview(storedMarked);
//             if (storedSkipped) setSkippedQuestions(storedSkipped);
//             if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

//             // ✅ Only restore section data if it's valid and we have questions loaded
//             if (isSectionalTest && groupedQuestions.length > 0) {
//                 if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//                     setCurrentSection(storedCurrentSection);
//                 } else {
//                     setCurrentSection(0);
//                 }

//                 if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//                     // ✅ Filter out invalid section numbers
//                     const validCompleted = storedCompletedSections.filter(
//                         sec => sec >= 0 && sec < groupedQuestions.length
//                     );
//                     setSectionCompleted(validCompleted);
//                 } else {
//                     setSectionCompleted([]);
//                 }
//             }
//         };

//         // ✅ Only restore after questions are loaded
//         if (questionsState.length > 0) {
//             restoreEncryptedTestData();
//         }
//     }, [testId, questionsState.length]);

//     // ✅ Save section progress
//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "currentSection", currentSection);
//     }, [currentSection, testId, isSectionalTest]);

//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "sectionCompleted", sectionCompleted);
//     }, [sectionCompleted, testId, isSectionalTest]);

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;

//         try {
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id,
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
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

//     // Handle Option Change
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
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const testId = state?.testInfo?.test_id;

//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // ✅ Handle Save And Next (Updated for sectional)
//     const handleSaveAndNext = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         // ✅ Navigate within section or to next question
//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Mark For Review (Updated for sectional)
//     const handleMarkForReview = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

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

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Next Question (Updated for sectional)
//     const handleNextQuestion = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
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
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // ✅ Get current question based on test type
//     const current = isSectionalTest
//         ? currentSectionData?.questions[currentQuestion]
//         : questionsState[currentQuestion];

//     if (!current) return (
//         <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

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

//     // Pause Functions
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//             });

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

//     // ✅ Submit Test (ONLY ONE API CALL - With section-wise data)
//     // const handleSubmit = async () => {
//     //     const testId = state?.testInfo?.test_id;
//     //     const currentQuestionData = isSectionalTest
//     //         ? currentSectionData?.questions[currentQuestion]
//     //         : questionsState[currentQuestion];
//     //     const currentId = currentQuestionData?.id;

//     //     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//     //         const updatedSelected = [...optionSelected, currentId];
//     //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     //     }

//     //     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     //     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     //     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     //     const skippedQuestions = await secureGetTestData(testId, 'skippedQuestions') || [];
//     //     const markedForReview = await secureGetTestData(testId, 'markedForReview') || [];
//     //     const totalAttendedQuestions = optionSelected2.length;
//     //     const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//     //     let correct = 0;
//     //     let in_correct = 0;

//     //     const allAttendedQuestions = optionSelected.map((questionId) => {
//     //         const question = questionsState.find(q => q.id === questionId);
//     //         const selectedAns = selectedOptions2[questionId];
//     //         const rightAns = question?.hindi_ans;

//     //         if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//     //             correct++;
//     //         } else {
//     //             in_correct++;
//     //         }

//     //         return {
//     //             question_id: questionId,
//     //             user_selected_ans: selectedAns,
//     //             right_ans: rightAns
//     //         };
//     //     });

//     //     const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);

//     //     // ✅ Calculate marks based on all test details (section-wise)
//     //     const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//     //     const markPer_ques = totalMarks / questionsState.length;
//     //     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     //     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     //     // ✅ One submission data for entire test
//     //     const submissionData = {
//     //         test_id: testId,
//     //         total_attend_question: totalAttendedQuestions,
//     //         total_not_answer_question: totalNotAnsweredQuestions,
//     //         correct,
//     //         in_correct,
//     //         marks: marksScored,
//     //         time: totalTimeSpent,
//     //         negative_mark: negativeMark,
//     //         all_attend_question: allAttendedQuestions,
//     //         spent_time: spentTime,
//     //         skip_question: skippedQuestions,
//     //         attend_question: optionSelected2,
//     //         mark_for_review: markedForReview
//     //     };

//     //     console.log('📤 Submitting ONE test entry:', submissionData);

//     //     try {
//     //         const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//     //         if (res.status_code == 200) {
//     //             await clearAllTestData(testId);
//     //             nav('/analysis', { replace: true, state });
//     //         }
//     //     } catch (error) {
//     //         console.error("❌ Error in Submitting Test:", error);
//     //     }
//     // };

//     // ✅ Updated Submit Test with Subject Information
//     // const handleSubmit = async () => {
//     //     const testId = state?.testInfo?.test_id;
//     //     const currentQuestionData = isSectionalTest
//     //         ? currentSectionData?.questions[currentQuestion]
//     //         : questionsState[currentQuestion];
//     //     const currentId = currentQuestionData?.id;

//     //     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//     //         const updatedSelected = [...optionSelected, currentId];
//     //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     //     }

//     //     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     //     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     //     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     //     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//     //     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
//     //     const totalAttendedQuestions = optionSelected2.length;
//     //     const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//     //     let correct = 0;
//     //     let in_correct = 0;

//     //     const allAttendedQuestions = optionSelected2.map((questionId) => {
//     //         const question = questionsState.find(q => q.id === questionId);
//     //         const selectedAns = selectedOptions2[questionId];
//     //         const rightAns = question?.hindi_ans;

//     //         if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//     //             correct++;
//     //         } else {
//     //             in_correct++;
//     //         }

//     //         return {
//     //             question_id: questionId,
//     //             user_selected_ans: selectedAns,
//     //             right_ans: rightAns,
//     //             subject_id: question?.subject_id || null,
//     //             subject_name: question?.subject_name || null
//     //         };
//     //     });

//     //     const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//     //     const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//     //     const markPer_ques = totalMarks / questionsState.length;
//     //     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     //     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     //     const submissionData = {
//     //         test_id: testId,
//     //         total_attend_question: totalAttendedQuestions,
//     //         total_not_answer_question: totalNotAnsweredQuestions,
//     //         correct,
//     //         in_correct,
//     //         marks: marksScored,
//     //         time: totalTimeSpent,
//     //         negative_mark: negativeMark,
//     //         all_attend_question: allAttendedQuestions,
//     //         spent_time: spentTime,
//     //         skip_question: skippedQuestions2,
//     //         attend_question: optionSelected2,
//     //         mark_for_review: markedForReview2
//     //     };

//     //     console.log('📤 Submitting test with subject info:', submissionData);

//     //     try {
//     //         const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//     //         console.log('✅ Exam Submit Response:', res);

//     //         if (res.status_code == 200) {
//     //             // ✅ GET THE ATTEND_ID FROM RESPONSE
//     //             const attendId = res.data?.id || res.data?.attend_id;

//     //             console.log('✅ Attend ID from submission:', attendId);

//     //             // ✅ Store it in encrypted storage
//     //             await secureSaveTestData(testId, 'attend_id', attendId);

//     //             // ✅ Clear other test data
//     //             await clearAllTestData(testId);

//     //             // ✅ Navigate with attend_id included in state
//     //             nav('/analysis', { 
//     //                 replace: true, 
//     //                 state: {
//     //                     ...state,
//     //                     attend_id: attendId,  // ✅ ADD THIS
//     //                     testInfo: {
//     //                         ...state.testInfo,
//     //                         attend_id: attendId,  // ✅ ADD THIS TOO
//     //                         test_id: testId
//     //                     }
//     //                 }
//     //             });
//     //         }
//     //     } catch (error) {
//     //         console.error("❌ Error in Submitting Test:", error);
//     //     }
//     // };

//     const handleSubmit = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//         let correct = 0;
//         let in_correct = 0;

//         const allAttendedQuestions = optionSelected2.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);
//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns,
//                 subject_id: question?.subject_id || null,
//                 subject_name: question?.subject_name || null
//             };
//         });

//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//         const markPer_ques = totalMarks / questionsState.length;
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
//             skip_question: skippedQuestions2,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview2
//         };

//         console.log('📤 Submitting test with subject info:', submissionData);

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//             console.log('✅ Exam Submit Response:', res);

//             if (res.status_code == 200) {
//                 // ✅ CAPTURE THE ATTEND_ID FROM RESPONSE (id: 878)
//                 const attendId = res.data?.id || res.data?.attend_id;

//                 console.log('✅ Attend ID from submission:', attendId);

//                 // ✅ Store it in encrypted storage
//                 await secureSaveTestData(testId, 'attend_id', attendId);

//                 // ✅ Clear other test data
//                 await clearAllTestData(testId);

//                 // ✅ Navigate with attend_id in ALL required places
//                 nav('/analysis', {
//                     replace: true,
//                     state: {
//                         ...state,
//                         attend_id: attendId,  // ✅ 1. Top-level attend_id
//                         testInfo: {
//                             ...state.testInfo,
//                             attend_id: attendId,  // ✅ 2. Inside testInfo
//                             test_id: testId
//                         },
//                         testData: {
//                             my_detail: {
//                                 test_id: testId,
//                                 attend_id: attendId  // ✅ 3. Inside testData.my_detail (ADDED)
//                             }
//                         }
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//             alert('Failed to submit test. Please try again.');
//         }
//     };



//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     // ✅ Check if all sections are completed
//     const allSectionsCompleted = isSectionalTest && sectionCompleted.length === groupedQuestions.length;

//     // return (
//     //     <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//     //         {/* Header */}
//     //         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//     //             <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//     //             {/* ✅ Timer - Sectional or Total */}
//     //             <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm">
//     //                 {isSectionalTest ? (
//     //                     <TestTimer
//     //                         textleft={`Section ${currentSection + 1} Time:`}
//     //                         testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//     //                         timeInMinutes={currentSectionData?.sectionTime || 0}
//     //                         onTimeUp={handleSectionTimeUp}
//     //                     />
//     //                 ) : (
//     //                     <TestTimer
//     //                         textleft={'Time Left:'}
//     //                         testId={state?.testInfo?.test_id}
//     //                         timeInMinutes={state?.testInfo?.time}
//     //                         onTimeUp={() => handleSubmit()}
//     //                     />
//     //                 )}
//     //             </div>

//     //             <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//     //                 <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//     //                 {isFullScreen ? (
//     //                     <button
//     //                         onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//     //                         className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//     //                     >
//     //                         Exit Full Screen
//     //                     </button>
//     //                 ) : (
//     //                     <button
//     //                         onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//     //                         className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//     //                     >
//     //                         Full Screen
//     //                     </button>
//     //                 )}
//     //                 <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//     //             </div>
//     //         </div>

//     //         {/* ✅ Section Progress Bar (for sectional tests) - FIXED */}
//     //         {isSectionalTest && groupedQuestions.length > 0 && (
//     //             <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border">
//     //                 <div className="flex justify-between items-center mb-2">
//     //                     <h3 className="font-bold text-lg">
//     //                         Section {currentSection + 1}: {currentSectionData?.sectionName}
//     //                     </h3>
//     //                     <span className="text-sm text-gray-600">
//     //                         Section {currentSection + 1} of {groupedQuestions.length}
//     //                     </span>
//     //                 </div>
//     //                 <div className="w-full bg-gray-200 rounded-full h-2">
//     //                     <div
//     //                         className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//     //                         style={{
//     //                             width: `${((currentSection + 1) / groupedQuestions.length) * 100}%`
//     //                         }}
//     //                     ></div>
//     //                 </div>
//     //                 <div className="mt-2 text-xs text-gray-600">
//     //                     {/* ✅ Fixed: Show completed sections correctly */}
//     //                     Sections Completed: {sectionCompleted.length} / {groupedQuestions.length}
//     //                 </div>
//     //             </div>
//     //         )}

//     //         {/* Top Controls */}
//     //         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//     //             <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//     //                 <button
//     //                     onMouseEnter={() => setIsModalOpen(true)}
//     //                     className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//     //                 >
//     //                     SYMBOLS
//     //                 </button>
//     //                 <button
//     //                     onMouseEnter={() => setOpenModal(true)}
//     //                     className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//     //                 >
//     //                     INSTRUCTIONS
//     //                 </button>
//     //             </div>

//     //             <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//     //                 <div className="flex flex-wrap gap-2">
//     //                     {selectedOptions[current.id] && (
//     //                         <button
//     //                             onClick={() => handleOptionDeselect(current.id)}
//     //                             className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//     //                         >
//     //                             Clear Option
//     //                         </button>
//     //                     )}
//     //                     <button
//     //                         onClick={handleMarkForReview}
//     //                         className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//     //                     >
//     //                         Mark for Review
//     //                     </button>
//     //                     {selectedOptions[current.id] ? (
//     //                         <button
//     //                             onClick={handleSaveAndNext}
//     //                             className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//     //                         >
//     //                             Save & Next
//     //                         </button>
//     //                     ) : (
//     //                         <button
//     //                             onClick={handleNextQuestion}
//     //                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//     //                         >
//     //                             Next
//     //                         </button>
//     //                     )}

//     //                     {/* ✅ Section Submit Button (Only saves state, no API call) */}
//     //                     {isSectionalTest && !sectionCompleted.includes(currentSection) && (
//     //                         <button
//     //                             onClick={handleSectionSubmit}
//     //                             className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//     //                         >
//     //                             Submit Section {currentSection + 1}
//     //                         </button>
//     //                     )}

//     //                     {/* ✅ Submit Test Button (ONLY ONE API CALL) */}
//     //                     {(!isSectionalTest || allSectionsCompleted || currentSection === groupedQuestions.length - 1) && (
//     //                         <button
//     //                             onClick={() => setConfirmSubmit(true)}
//     //                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//     //                         >
//     //                             Submit Test
//     //                         </button>
//     //                     )}
//     //                 </div>

//     //                 {/* ✅ Timer Display */}
//     //                 <div className="text-right w-full lg:w-auto">
//     //                     {isSectionalTest ? (
//     //                         <TestTimer
//     //                             timeClr='text-blue-800'
//     //                             textleft={'SECTION'}
//     //                             textBg='text-red-600'
//     //                             timeTextSize='text-2xl'
//     //                             textRight={'Minutes'}
//     //                             showSeconds={false}
//     //                             testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//     //                             timeInMinutes={currentSectionData?.sectionTime || 0}
//     //                             onTimeUp={handleSectionTimeUp}
//     //                         />
//     //                     ) : (
//     //                         <TestTimer
//     //                             timeClr='text-blue-800'
//     //                             textleft={'LAST'}
//     //                             textBg='text-red-600'
//     //                             timeTextSize='text-2xl'
//     //                             textRight={'Minutes'}
//     //                             showSeconds={false}
//     //                             testId={state?.testInfo?.test_id}
//     //                             timeInMinutes={state?.testInfo?.time}
//     //                             onTimeUp={() => handleSubmit()}
//     //                         />
//     //                     )}
//     //                 </div>
//     //             </div>
//     //         </div>

//     //         {/* Main Body */}
//     //         <div className="flex flex-col lg:flex-row gap-4 w-full">
//     //             <QuestionGridModal
//     //                 question={isSectionalTest ? currentSectionData?.questions : questionsState}
//     //                 groupedQuestions={isSectionalTest ? [currentSectionData] : groupedQuestions}
//     //                 currentQuestion={currentQuestion}
//     //                 optionSelected={optionSelected}
//     //                 markedForReview={markedForReview}
//     //                 markedForReviewAns={markedWithAns}
//     //                 skippedQuestions={skippedQuestions}
//     //                 setCurrentQuestion={(index) => setCurrentQuestion(index)}
//     //                 onClose={() => setShowModal(false)}
//     //                 onProceed={() => { }}
//     //             />

//     //             <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//     //                 {/* Question Header with Bookmark & Report */}
//     //                 <div className="flex justify-between items-center mb-4 pb-3 border-b">
//     //                     <div className="flex items-center gap-4">
//     //                         <div className="text-base font-bold text-gray-900">
//     //                             Question {currentQuestion + 1}/{isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
//     //                             {isSectionalTest && (
//     //                                 <span className="ml-2 text-sm text-gray-600">
//     //                                     (Section {currentSection + 1})
//     //                                 </span>
//     //                             )}
//     //                         </div>
//     //                         <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//     //                             Time: {formatTime(elapsedSeconds)}
//     //                         </div>
//     //                     </div>

//     //                     {/* Bookmark & Report Icons */}
//     //                     <div className="flex items-center gap-2">
//     //                         <select
//     //                             value={language}
//     //                             onChange={(e) => setLanguage(e.target.value)}
//     //                             className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//     //                         >
//     //                             <option value="en">English</option>
//     //                             <option value="hi">Hindi</option>
//     //                         </select>

//     //                         <button
//     //                             onClick={handleToggleBookmark}
//     //                             disabled={bookmarkLoading}
//     //                             className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//     //                                 ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//     //                                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//     //                                 }`}
//     //                             title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//     //                         >
//     //                             {bookmarkLoading ? (
//     //                                 <Loader2 size={20} className="animate-spin" />
//     //                             ) : isCurrentBookmarked ? (
//     //                                 <BookmarkCheck size={20} />
//     //                             ) : (
//     //                                 <Bookmark size={20} />
//     //                             )}
//     //                         </button>

//     //                         <button
//     //                             onClick={() => setShowReportModal(true)}
//     //                             className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//     //                             title="Report Question"
//     //                         >
//     //                             <Flag size={20} />
//     //                         </button>
//     //                     </div>
//     //                 </div>

//     //                 {/* Question Text */}
//     //                 <div className="mb-6">
//     //                     <MathRenderer text={questionText} />
//     //                 </div>

//     //                 {/* Options */}
//     //                 <div className="flex flex-col gap-3">
//     //                     {Object.entries(options).map(([key, value]) => (
//     //                         <label
//     //                             key={key}
//     //                             className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//     //                                 ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//     //                                 : 'border-gray-200'
//     //                                 }`}
//     //                         >
//     //                             <input
//     //                                 type="radio"
//     //                                 name={`question_${current.id}`}
//     //                                 value={key}
//     //                                 checked={selectedOptions[current.id] === key}
//     //                                 onChange={() => handleOptionChange(current.id, key)}
//     //                                 className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//     //                             />
//     //                             <div className="flex-1 option-content text-sm">
//     //                                 <MathRenderer text={value} />
//     //                             </div>
//     //                         </label>
//     //                     ))}
//     //                 </div>
//     //             </div>
//     //         </div>

//     //         {/* ✅ Section Submit Confirmation Modal (No API call) */}
//     //         {showSectionSubmitConfirm && (
//     //             <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//     //                 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//     //                     <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//     //                     <p className="text-gray-600 mb-6">
//     //                         This will mark Section {currentSection + 1} as complete.
//     //                         {currentSection < groupedQuestions.length - 1
//     //                             ? ' You will move to the next section.'
//     //                             : ' After this, you can submit the entire test.'}
//     //                     </p>
//     //                     <div className="flex gap-3">
//     //                         <button
//     //                             onClick={() => setShowSectionSubmitConfirm(false)}
//     //                             className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//     //                         >
//     //                             Cancel
//     //                         </button>
//     //                         <button
//     //                             onClick={confirmSectionSubmit}
//     //                             className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
//     //                         >
//     //                             Confirm
//     //                         </button>
//     //                     </div>
//     //                 </div>
//     //             </div>
//     //         )}

//     //         {/* Report Modal */}
//     //         {showReportModal && (
//     //             <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//     //                 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//     //                     <div className="flex justify-between items-center mb-4">
//     //                         <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//     //                             <Flag className="text-red-600" size={24} />
//     //                             Report Question
//     //                         </h3>
//     //                         <button
//     //                             onClick={() => {
//     //                                 setShowReportModal(false);
//     //                                 setReportReason('');
//     //                             }}
//     //                             className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//     //                         >
//     //                             <X size={22} className="text-gray-600" />
//     //                         </button>
//     //                     </div>

//     //                     <p className="text-sm text-gray-600 mb-4">
//     //                         Help us improve! Please describe the issue with this question:
//     //                     </p>

//     //                     <textarea
//     //                         value={reportReason}
//     //                         onChange={(e) => setReportReason(e.target.value)}
//     //                         placeholder="E.g., Wrong answer, unclear question, typo..."
//     //                         className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//     //                         rows={5}
//     //                     />

//     //                     <div className="flex gap-3 mt-6">
//     //                         <button
//     //                             onClick={() => {
//     //                                 setShowReportModal(false);
//     //                                 setReportReason('');
//     //                             }}
//     //                             className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//     //                         >
//     //                             Cancel
//     //                         </button>
//     //                         <button
//     //                             onClick={handleReportQuestion}
//     //                             disabled={reportLoading || !reportReason.trim()}
//     //                             className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//     //                         >
//     //                             {reportLoading ? (
//     //                                 <>
//     //                                     <Loader2 size={18} className="animate-spin" />
//     //                                     Submitting...
//     //                                 </>
//     //                             ) : (
//     //                                 'Submit Report'
//     //                             )}
//     //                         </button>
//     //                     </div>
//     //                 </div>
//     //             </div>
//     //         )}

//     //         {/* All Other Modals */}
//     //         <PauseTestModal
//     //             isOpen={showPauseModal}
//     //             onConfirm={handleConfirmPause}
//     //             onCancel={handleCancelPause}
//     //         />
//     //         <ConfirmTestSubmitModal
//     //             show={confirmSubmit}
//     //             onClose={() => setConfirmSubmit(false)}
//     //             onConfirm={handleSubmit}
//     //         />
//     //         <ExamInstructionsModal
//     //             isOpen={openModal}
//     //             onClose={() => setOpenModal(false)}
//     //             onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//     //             testInfo={state?.testInfo || {}}
//     //             testData={state?.testDetail || []}
//     //         />
//     //         <SymbolModal
//     //             isOpen={isModalOpen}
//     //             onClose={() => setIsModalOpen(false)}
//     //         />
//     //     </div>
//     // );
//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//                 {/* ✅ Timer - Sectional or Total */}
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm">
//                     {isSectionalTest ? (
//                         <TestTimer
//                             textleft={`Section ${currentSection + 1} Time:`}
//                             testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//                             timeInMinutes={currentSectionData?.sectionTime || 0}
//                             onTimeUp={handleSectionTimeUp}
//                         />
//                     ) : (
//                         <TestTimer
//                             textleft={'Time Left:'}
//                             testId={state?.testInfo?.test_id}
//                             timeInMinutes={state?.testInfo?.time}
//                             onTimeUp={() => handleSubmit()}
//                         />
//                     )}
//                 </div>

//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* ❌ REMOVED: Section Progress Bar completely */}

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}

//                         {/* ✅ KEPT: Submit Section Button (for sectional tests only) */}
//                         {isSectionalTest && !sectionCompleted.includes(currentSection) && (
//                             <button
//                                 onClick={handleSectionSubmit}
//                                 className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//                             >
//                                 Submit Section {currentSection + 1}
//                             </button>
//                         )}

//                         {/* ✅ NEW: Submit Test Button (always visible for whole exam submission) */}
//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>

//                     {/* ✅ Timer Display */}
//                     <div className="text-right w-full lg:w-auto">
//                         {isSectionalTest ? (
//                             <TestTimer
//                                 timeClr='text-blue-800'
//                                 textleft={'SECTION'}
//                                 textBg='text-red-600'
//                                 timeTextSize='text-2xl'
//                                 textRight={'Minutes'}
//                                 showSeconds={false}
//                                 testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                             />
//                         ) : (
//                             <TestTimer
//                                 timeClr='text-blue-800'
//                                 textleft={'LAST'}
//                                 textBg='text-red-600'
//                                 timeTextSize='text-2xl'
//                                 textRight={'Minutes'}
//                                 showSeconds={false}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={state?.testInfo?.time}
//                                 onTimeUp={() => handleSubmit()}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 <QuestionGridModal
//                     question={isSectionalTest ? currentSectionData?.questions : questionsState}
//                     groupedQuestions={isSectionalTest ? [currentSectionData] : groupedQuestions}
//                     currentQuestion={currentQuestion}
//                     optionSelected={optionSelected}
//                     markedForReview={markedForReview}
//                     markedForReviewAns={markedWithAns}
//                     skippedQuestions={skippedQuestions}
//                     setCurrentQuestion={(index) => setCurrentQuestion(index)}
//                     onClose={() => setShowModal(false)}
//                     onProceed={() => { }}
//                 />

//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header with Bookmark & Report */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             <div className="text-base font-bold text-gray-900">
//                                 Question {currentQuestion + 1}/{isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
//                                 {isSectionalTest && (
//                                     <span className="ml-2 text-sm text-gray-600">
//                                         (Section {currentSection + 1})
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ KEPT: Section Submit Confirmation Modal */}
//             {showSectionSubmitConfirm && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//                         <p className="text-gray-600 mb-6">
//                             This will mark Section {currentSection + 1} as complete.
//                             {currentSection < groupedQuestions.length - 1
//                                 ? ' You will move to the next section.'
//                                 : ' You can still submit the entire test later.'}
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowSectionSubmitConfirm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmSectionSubmit}
//                                 className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Report Modal */}
//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* All Other Modals */}
//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );

// };

// export default Screen5;



import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    console.log('Screen5(Test Screen) State Data', state);

    // ✅ Check if sectional test
    const isSectionalTest =
        state?.packageDetail?.exam_category?.title === 'SSC' &&
        state?.testInfo?.test_series_type === 'mains';

    console.log('🎯 Is Sectional Test:', isSectionalTest);

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

    // ✅ Sectional Test States
    const [currentSection, setCurrentSection] = useState(0);
    const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
    const [sectionCompleted, setSectionCompleted] = useState([]);

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

    // ✅ Prevent browser back button and show pause confirmation
    useEffect(() => {
        const handleBackButton = (e) => {
            e.preventDefault();
            setShowPauseModal(true); // Show pause modal on back button
        };

        // Push a dummy state to history to intercept back button
        window.history.pushState(null, '', window.location.pathname);

        // Listen for popstate (back button)
        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, []);

    // ✅ Group questions by subject (for sectional tests)
    // const groupedQuestions = questionsState.reduce((acc, question) => {
    //     const subject = acc.find((grp) => grp.subject_name === question.subject_name);
    //     if (subject) {
    //         subject.questions.push(question);
    //     } else {
    //         acc.push({
    //             subject_name: question.subject_name,
    //             questions: [question],
    //         });
    //     }
    //     return acc;
    // }, []);

    // // ✅ Get current section data
    // const getCurrentSectionData = () => {
    //     if (!isSectionalTest || groupedQuestions.length === 0) return null;

    //     const sectionData = state?.testDetail[currentSection];
    //     const sectionQuestions = groupedQuestions[currentSection]?.questions || [];

    //     return {
    //         sectionName: groupedQuestions[currentSection]?.subject_name || `Section ${currentSection + 1}`,
    //         sectionTime: sectionData?.sectional_time || 0,
    //         totalQuestions: sectionQuestions.length,
    //         questions: sectionQuestions
    //     };
    // };

    // ✅ Group questions by section (using testDetail)
    // const groupedQuestions = React.useMemo(() => {
    //     if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
    //         return [];
    //     }

    //     const grouped = [];
    //     let startIndex = 0;

    //     state.testDetail.forEach((section, sectionIndex) => {
    //         const sectionQuestionCount = parseInt(section.no_of_question) || 0;
    //         const sectionQuestions = questionsState.slice(startIndex, startIndex + sectionQuestionCount);

    //         grouped.push({
    //             subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
    //             sectionTime: parseInt(section.sectional_time) || 0,
    //             marks: parseFloat(section.marks) || 0,
    //             negative_mark: section.negative_mark || "1",
    //             totalQuestions: sectionQuestionCount,
    //             questions: sectionQuestions
    //         });

    //         startIndex += sectionQuestionCount;
    //     });

    //     console.log('📦 Grouped Questions by Section:', grouped);
    //     console.log('📊 Section Details:');
    //     grouped.forEach((section, idx) => {
    //         console.log(`  Section ${idx + 1}: ${section.subject_name} - ${section.questions.length} questions`);
    //     });

    //     return grouped;
    // }, [questionsState, isSectionalTest, state?.testDetail]);


    const groupedQuestions = useMemo(() => {
        if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
            return [];
        }

        const grouped = [];
        let startIndex = 0;

        state.testDetail.forEach((section, sectionIndex) => {
            const sectionQuestionCount = parseInt(section.no_of_question) || 0;
            const sectionQuestions = questionsState.slice(startIndex, startIndex + sectionQuestionCount);

            // ✅ Parse sectionTime as integer
            const sectionTime = parseInt(section.sectional_time) || 0;

            console.log(`📦 Section ${sectionIndex + 1} Setup:`, {
                subject: section.subject_name,
                questionCount: sectionQuestionCount,
                sectionTime: sectionTime,  // ← Should be 60 for Section 2
                rawValue: section.sectional_time
            });

            grouped.push({
                subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
                sectionTime: sectionTime,  // ✅ Make sure this is correct
                marks: parseFloat(section.marks) || 0,
                negative_mark: section.negative_mark || "1",
                totalQuestions: sectionQuestionCount,
                questions: sectionQuestions
            });

            startIndex += sectionQuestionCount;
        });

        console.log('📦 All Grouped Sections:', grouped);
        return grouped;
    }, [questionsState, isSectionalTest, state?.testDetail]);



    // ✅ Get current section data (simplified)
    const getCurrentSectionData = () => {
        if (!isSectionalTest || groupedQuestions.length === 0) return null;

        const sectionData = groupedQuestions[currentSection];

        if (!sectionData) {
            console.error(`❌ Section ${currentSection} data not found!`);
            return null;
        }

        console.log(`✅ Current Section ${currentSection + 1}:`, {
            name: sectionData.subject_name,
            totalQuestions: sectionData.totalQuestions,
            actualQuestions: sectionData.questions.length,
            sectionTime: sectionData.sectionTime
        });

        return sectionData;
    };



    const currentSectionData = getCurrentSectionData();

    // ✅ Handle Section Submit (NO API CALL - Only state update)
    const handleSectionSubmit = () => {
        setShowSectionSubmitConfirm(true);
    };

    const confirmSectionSubmit = async () => {
        setShowSectionSubmitConfirm(false);

        // ✅ Mark current section as completed (NO API CALL)
        const updatedCompleted = [...sectionCompleted, currentSection];
        setSectionCompleted(updatedCompleted);
        await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

        // ✅ Move to next section or show final submit
        if (currentSection < groupedQuestions.length - 1) {
            setCurrentSection(prev => prev + 1);
            setCurrentQuestion(0);
            showSuccessToast(`Section ${currentSection + 1} completed! Moving to Section ${currentSection + 2}`);
        } else {
            showSuccessToast('All sections completed! Please submit the test.');
        }
    };

    // ✅ Handle Section Time Up (Auto-advance to next section, NO API CALL)
    const handleSectionTimeUp = async () => {
        console.log('⏰ Section time up!');

        const updatedCompleted = [...sectionCompleted, currentSection];
        setSectionCompleted(updatedCompleted);
        await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

        if (currentSection < groupedQuestions.length - 1) {
            setCurrentSection(prev => prev + 1);
            setCurrentQuestion(0);
            showSuccessToast(`Time up! Moving to Section ${currentSection + 2}`);
        } else {
            showSuccessToast('Test time completed! Submitting test...');
            await handleSubmit();
        }
    };

    // ✅ Initialize Sectional Test
    useEffect(() => {
        const initializeSectionalTest = async () => {
            if (!testId || !isSectionalTest) return;

            const existingOptions = await secureGetTestData(testId, "selectedOptions");
            const existingSection = await secureGetTestData(testId, "currentSection");
            const existingCompleted = await secureGetTestData(testId, "sectionCompleted");

            if (!existingOptions || Object.keys(existingOptions).length === 0) {
                console.log('🆕 Fresh test attempt - Resetting sectional data');
                setCurrentSection(0);
                setSectionCompleted([]);
                await secureSaveTestData(testId, "currentSection", 0);
                await secureSaveTestData(testId, "sectionCompleted", []);
            }
        };

        if (questionsState.length > 0 && groupedQuestions.length > 0) {
            initializeSectionalTest();
        }
    }, [testId, isSectionalTest, questionsState.length]);

    // ✅ Restore Test Data
    // useEffect(() => {
    //     const restoreEncryptedTestData = async () => {
    //         if (!testId) return;

    //         const [
    //             storedOptions,
    //             storedAttempted,
    //             storedMarked,
    //             storedSkipped,
    //             storedMarkedWithAns,
    //             storedCurrentSection,
    //             storedCompletedSections
    //         ] = await Promise.all([
    //             secureGetTestData(testId, "selectedOptions"),
    //             secureGetTestData(testId, "optionSelected"),
    //             secureGetTestData(testId, "markedForReview"),
    //             secureGetTestData(testId, "skippedQuestions"),
    //             secureGetTestData(testId, "marked_with_ans"),
    //             secureGetTestData(testId, "currentSection"),
    //             secureGetTestData(testId, "sectionCompleted"),
    //         ]);

    //         if (storedOptions) setSelectedOptions(storedOptions);
    //         if (storedAttempted) setOptionSelected(storedAttempted);
    //         if (storedMarked) setMarkedForReview(storedMarked);
    //         if (storedSkipped) setSkippedQuestions(storedSkipped);
    //         if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

    //         if (isSectionalTest && groupedQuestions.length > 0) {
    //             if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
    //                 setCurrentSection(storedCurrentSection);
    //             } else {
    //                 setCurrentSection(0);
    //             }

    //             if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
    //                 const validCompleted = storedCompletedSections.filter(
    //                     sec => sec >= 0 && sec < groupedQuestions.length
    //                 );
    //                 setSectionCompleted(validCompleted);
    //             } else {
    //                 setSectionCompleted([]);
    //             }
    //         }
    //     };

    //     if (questionsState.length > 0) {
    //         restoreEncryptedTestData();
    //     }
    // }, [testId, questionsState.length]);

    // ✅ Restore Test Data - IMPROVED VERSION
    useEffect(() => {
        const restoreEncryptedTestData = async () => {
            // if (!testId) {
            //     console.log('❌ No testId found, skipping restoration');
            //     return;
            // }

            // console.log('🔄 Attempting to restore test data for testId:', testId);

            const testIdToUse = state?.testInfo?.test_id;

            if (!testIdToUse) {
                console.error('❌ No testId found in state:', state);
                return;
            }

            console.log(`🔑 Using testId for restoration: ${testIdToUse}`);
            console.log('🎯 State data:', state);

            try {
                const [
                    storedOptions,
                    storedAttempted,
                    storedMarked,
                    storedSkipped,
                    storedMarkedWithAns,
                    storedCurrentSection,
                    storedCompletedSections
                ] = await Promise.all([
                    secureGetTestData(testId, "selectedOptions"),
                    secureGetTestData(testId, "optionSelected"),
                    secureGetTestData(testId, "markedForReview"),
                    secureGetTestData(testId, "skippedQuestions"),
                    secureGetTestData(testId, "marked_with_ans"),
                    secureGetTestData(testId, "currentSection"),
                    secureGetTestData(testId, "sectionCompleted"),
                ]);

                console.log('📦 Restored Data:', {
                    selectedOptions: storedOptions ? Object.keys(storedOptions).length : 0,
                    optionSelected: storedAttempted ? storedAttempted.length : 0,
                    markedForReview: storedMarked ? storedMarked.length : 0,
                    skippedQuestions: storedSkipped ? storedSkipped.length : 0,
                    markedWithAns: storedMarkedWithAns ? storedMarkedWithAns.length : 0,
                    currentSection: storedCurrentSection,
                    completedSections: storedCompletedSections ? storedCompletedSections.length : 0,
                });

                // ✅ Restore state
                if (storedOptions && Object.keys(storedOptions).length > 0) {
                    setSelectedOptions(storedOptions);
                    console.log('✅ Restored selectedOptions');
                }

                if (storedAttempted && storedAttempted.length > 0) {
                    setOptionSelected(storedAttempted);
                    console.log('✅ Restored optionSelected');
                }

                if (storedMarked) setMarkedForReview(storedMarked);
                if (storedSkipped) setSkippedQuestions(storedSkipped);
                if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

                // ✅ Restore section data
                if (isSectionalTest && groupedQuestions.length > 0) {
                    if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
                        setCurrentSection(storedCurrentSection);
                        console.log(`✅ Restored currentSection: ${storedCurrentSection}`);
                    } else {
                        setCurrentSection(0);
                    }

                    if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
                        const validCompleted = storedCompletedSections.filter(
                            sec => sec >= 0 && sec < groupedQuestions.length
                        );
                        setSectionCompleted(validCompleted);
                        console.log('✅ Restored completedSections:', validCompleted);
                    } else {
                        setSectionCompleted([]);
                    }
                }

                // ✅ Clear pause status AFTER restoration
                if (state?.isResuming) {
                    const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
                    const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
                    await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
                    console.log('✅ Cleared pause status for testId:', testId);
                }

            } catch (error) {
                console.error('❌ Error restoring test data:', error);
            }
        };

        // ✅ Run restoration when questions are loaded
        if (questionsState.length > 0) {
            console.log(`✅ Questions loaded (${questionsState.length}), starting restoration`);
            restoreEncryptedTestData();
        }
    }, [testId, questionsState.length, state?.isResuming]);

    // ✅ Save section progress
    useEffect(() => {
        if (!testId || !isSectionalTest) return;
        secureSaveTestData(testId, "currentSection", currentSection);
    }, [currentSection, testId, isSectionalTest]);

    useEffect(() => {
        if (!testId || !isSectionalTest) return;
        secureSaveTestData(testId, "sectionCompleted", sectionCompleted);
    }, [sectionCompleted, testId, isSectionalTest]);

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
        const currentQuestionData = isSectionalTest
            ? currentSectionData?.questions[currentQuestion]
            : questionsState[currentQuestion];
        const currentQuestionId = currentQuestionData?.id;
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
    const handleReportQuestion = async () => {
        if (!reportReason.trim()) {
            showErrorToast('Please enter a reason');
            return;
        }

        setReportLoading(true);
        const currentQuestionData = isSectionalTest
            ? currentSectionData?.questions[currentQuestion]
            : questionsState[currentQuestion];
        const currentQuestionId = currentQuestionData?.id;

        try {
            const reportData = {
                question_id: currentQuestionId,
                reason: reportReason,
                test_id: state?.testInfo?.test_id,
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

    // ✅ Handle Save And Next
    const handleSaveAndNext = async () => {
        const testId = state?.testInfo?.test_id;
        const currentQuestionData = isSectionalTest
            ? currentSectionData?.questions[currentQuestion]
            : questionsState[currentQuestion];
        const currentId = currentQuestionData?.id;

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

        const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
        if (currentQuestion === totalQuestions - 1) {
            setCurrentQuestion(0);
        } else {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    // ✅ Handle Mark For Review
    const handleMarkForReview = async () => {
        const testId = state?.testInfo?.test_id;
        const currentQuestionData = isSectionalTest
            ? currentSectionData?.questions[currentQuestion]
            : questionsState[currentQuestion];
        const currentId = currentQuestionData?.id;

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

        const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
        if (currentQuestion === totalQuestions - 1) {
            setCurrentQuestion(0);
        } else {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    // ✅ Handle Next Question
    const handleNextQuestion = async () => {
        const testId = state?.testInfo?.test_id;
        const currentQuestionData = isSectionalTest
            ? currentSectionData?.questions[currentQuestion]
            : questionsState[currentQuestion];
        const currentId = currentQuestionData?.id;

        await updateSpentTime(currentId);

        if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
            const updatedSkipped = [...skippedQuestions, currentId];
            setSkippedQuestions(updatedSkipped);
            await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
        }

        const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
        if (currentQuestion === totalQuestions - 1) {
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

    // ✅ Get current question
    const current = isSectionalTest
        ? currentSectionData?.questions[currentQuestion]
        : questionsState[currentQuestion];

    if (!current) return (
        <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
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

    // ✅ Pause/Back Functions (unified handler for both pause button and back button)
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
        // ✅ Push state again to prevent actual back navigation
        window.history.pushState(null, '', window.location.pathname);
    };

    const questionText = language === 'en' ? current.question_english : current.question_hindi;

    // ✅ Submit Test (ONE API CALL)
    // const handleSubmit = async () => {
    //     const testId = state?.testInfo?.test_id;
    //     const currentQuestionData = isSectionalTest
    //         ? currentSectionData?.questions[currentQuestion]
    //         : questionsState[currentQuestion];
    //     const currentId = currentQuestionData?.id;

    //     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
    //         const updatedSelected = [...optionSelected, currentId];
    //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
    //     }

    //     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
    //     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
    //     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
    //     const skippedQuestions = await secureGetTestData(testId, 'skippedQuestions') || [];
    //     const markedForReview = await secureGetTestData(testId, 'markedForReview') || [];
    //     const totalAttendedQuestions = optionSelected2.length;
    //     const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

    //     let correct = 0;
    //     let in_correct = 0;

    //     const allAttendedQuestions = optionSelected2.map((questionId) => {
    //         const question = questionsState.find(q => q.id === questionId);
    //         const selectedAns = selectedOptions2[questionId];
    //         const rightAns = question?.hindi_ans;

    //         if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
    //             correct++;
    //         } else {
    //             in_correct++;
    //         }

    //         return {
    //             question_id: questionId,
    //             user_selected_ans: selectedAns,
    //             right_ans: rightAns,
    //             subject_id: question?.subject_id || null,
    //             subject_name: question?.subject_name || null
    //         };
    //     });

    //     const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
    //     const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
    //     const markPer_ques = totalMarks / questionsState.length;
    //     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
    //     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

    //     const submissionData = {
    //         test_id: testId,
    //         total_attend_question: totalAttendedQuestions,
    //         total_not_answer_question: totalNotAnsweredQuestions,
    //         correct,
    //         in_correct,
    //         marks: marksScored,
    //         time: totalTimeSpent,
    //         negative_mark: negativeMark,
    //         all_attend_question: allAttendedQuestions,
    //         spent_time: spentTime,
    //         skip_question: skippedQuestions,
    //         attend_question: optionSelected2,
    //         mark_for_review: markedForReview
    //     };

    //     console.log('📤 Submitting test:', submissionData);

    //     try {
    //         const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
    //         if (res.status_code == 200) {
    //             await clearAllTestData(testId);
    //             nav('/analysis', { replace: true, state });
    //         }
    //     } catch (error) {
    //         console.error("❌ Error in Submitting Test:", error);
    //     }
    // };

    // const handleSubmit = async () => {
    //     const testId = state?.testInfo?.test_id;
    //     const currentQuestionData = isSectionalTest
    //         ? currentSectionData?.questions[currentQuestion]
    //         : questionsState[currentQuestion];
    //     const currentId = currentQuestionData?.id;

    //     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
    //         const updatedSelected = [...optionSelected, currentId];
    //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
    //     }

    //     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
    //     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
    //     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
    //     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
    //     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
    //     const totalAttendedQuestions = optionSelected2.length;
    //     const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

    //     let correct = 0;
    //     let in_correct = 0;

    //     const allAttendedQuestions = optionSelected2.map((questionId) => {
    //         const question = questionsState.find(q => q.id === questionId);
    //         const selectedAns = selectedOptions2[questionId];
    //         const rightAns = question?.hindi_ans;

    //         if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
    //             correct++;
    //         } else {
    //             in_correct++;
    //         }

    //         return {
    //             question_id: questionId,
    //             user_selected_ans: selectedAns,
    //             right_ans: rightAns,
    //             subject_id: question?.subject_id || null,
    //             subject_name: question?.subject_name || null
    //         };
    //     });

    //     const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
    //     const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
    //     const markPer_ques = totalMarks / questionsState.length;
    //     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
    //     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

    //     const submissionData = {
    //         test_id: testId,
    //         total_attend_question: totalAttendedQuestions,
    //         total_not_answer_question: totalNotAnsweredQuestions,
    //         correct,
    //         in_correct,
    //         marks: marksScored,
    //         time: totalTimeSpent,
    //         negative_mark: negativeMark,
    //         all_attend_question: allAttendedQuestions,
    //         spent_time: spentTime,
    //         skip_question: skippedQuestions2,
    //         attend_question: optionSelected2,
    //         mark_for_review: markedForReview2
    //     };

    //     console.log('📤 Submitting test with subject info:', submissionData);

    //     try {
    //         const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

    //         console.log('✅ Exam Submit Response:', res);

    //         if (res.status_code == 200) {
    //             // ✅ CAPTURE THE ATTEND_ID FROM RESPONSE (id: 878)
    //             const attendId = res.data?.id || res.data?.attend_id;

    //             console.log('✅ Attend ID from submission:', attendId);

    //             // ✅ Store it in encrypted storage
    //             await secureSaveTestData(testId, 'attend_id', attendId);

    //             // ✅ Clear other test data
    //             await clearAllTestData(testId);

    //             // ✅ Navigate with attend_id in ALL required places
    //             nav('/analysis', {
    //                 replace: true,
    //                 state: {
    //                     ...state,
    //                     attend_id: attendId,  // ✅ 1. Top-level attend_id
    //                     testInfo: {
    //                         ...state.testInfo,
    //                         attend_id: attendId,  // ✅ 2. Inside testInfo
    //                         test_id: testId
    //                     },
    //                     testData: {
    //                         my_detail: {
    //                             test_id: testId,
    //                             attend_id: attendId  // ✅ 3. Inside testData.my_detail (ADDED)
    //                         }
    //                     }
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         console.error("❌ Error in Submitting Test:", error);
    //         alert('Failed to submit test. Please try again.');
    //     }
    // };

    const handleSubmit = async () => {
        const testId = state?.testInfo?.test_id;
        const currentQuestionData = isSectionalTest
            ? currentSectionData?.questions[currentQuestion]
            : questionsState[currentQuestion];
        const currentId = currentQuestionData?.id;

        // ✅ Save current question if answered
        if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
            const updatedSelected = [...optionSelected, currentId];
            await secureSaveTestData(testId, 'optionSelected', updatedSelected);
        }

        // ✅ Get all saved data
        const spentTime = await secureGetTestData(testId, 'spentTime') || [];
        const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
        const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
        const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
        const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

        const totalAttendedQuestions = optionSelected2.length;
        const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

        let correct = 0;
        let in_correct = 0;

        // ✅ Calculate correct/incorrect answers
        const allAttendedQuestions = optionSelected2.map((questionId) => {
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
                right_ans: rightAns,
                subject_id: question?.subject_id || null,
                subject_name: question?.subject_name || null
            };
        });

        // ✅ Calculate marks
        const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
        const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
        const markPer_ques = totalMarks / questionsState.length;
        const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
        const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

        // ✅ Prepare submission data
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
            skip_question: skippedQuestions2,
            attend_question: optionSelected2,
            mark_for_review: markedForReview2
        };

        console.log('📤 Submitting test:', submissionData);

        try {
            const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

            console.log('✅ Exam Submit Response:', res);

            if (res.status_code == 200) {
                // ✅ CAPTURE attend_id from response
                const attendId = res.data?.id || res.data?.attend_id;

                console.log('✅ Attend ID captured:', attendId);

                // ✅ Store attend_id in encrypted storage
                if (attendId) {
                    await secureSaveTestData(testId, 'attend_id', attendId);
                }

                // ✅ Clear test data
                await clearAllTestData(testId);

                // ✅ Navigate with attend_id in state
                nav('/analysis', {
                    replace: true,
                    state: {
                        ...state,
                        attend_id: attendId,  // ✅ Top-level attend_id
                        testInfo: {
                            ...state?.testInfo,
                            attend_id: attendId,  // ✅ Inside testInfo
                            test_id: testId
                        },
                        testData: {
                            my_detail: {
                                test_id: testId,
                                attend_id: attendId  // ✅ Inside testData.my_detail
                            }
                        },
                        userData: userInfo  // ✅ Include user data
                    }
                });
            }
        } catch (error) {
            console.error("❌ Error in Submitting Test:", error);
            showErrorToast('Failed to submit test. Please try again.');
        }
    };


    const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

    return (
        <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
            {/* Header */}
            {/* <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

          
                <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm">
                    {isSectionalTest ? (
                        <TestTimer
                            textleft={`Section ${currentSection + 1} Time:`}
                            testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
                            timeInMinutes={currentSectionData?.sectionTime || 0}
                            onTimeUp={handleSectionTimeUp}
                        />
                    ) : (
                        <TestTimer
                            textleft={'Time Left:'}
                            testId={state?.testInfo?.test_id}
                            timeInMinutes={state?.testInfo?.time}
                            onTimeUp={() => handleSubmit()}
                        />
                    )}
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
            </div> */}

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

                {/* ✅ Timer - Show Total Time instead of Section Time */}
                <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm px-4 py-2">
                    {isSectionalTest ? (
                        // ✅ For Sectional Test: Show "Total Time" with testInfo.time
                        <div className="flex items-center gap-2 text-base font-semibold">
                            <span>Total Time:</span>
                            <span className="text-yellow-400">{state?.testInfo?.time} minutes</span>
                        </div>
                    ) : (
                        // ✅ For Regular Test: Show actual countdown timer
                        <TestTimer
                            textleft={'Time Left:'}
                            testId={state?.testInfo?.test_id}
                            timeInMinutes={state?.testInfo?.time}
                            onTimeUp={() => handleSubmit()}
                        />
                    )}
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

                        {/* Submit Section Button */}
                        {isSectionalTest && !sectionCompleted.includes(currentSection) && (
                            <button
                                onClick={handleSectionSubmit}
                                className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
                            >
                                Submit Section {currentSection + 1}
                            </button>
                        )}

                        {/* Submit Test Button */}
                        <button
                            onClick={() => setConfirmSubmit(true)}
                            className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        >
                            Submit Test
                        </button>
                    </div>

                    {/* Timer Display */}
                    <div className="text-right w-full lg:w-auto">
                        {/* {isSectionalTest ? (
                            <TestTimer
                                timeClr='text-blue-800'
                                textleft={'SECTION'}
                                textBg='text-red-600'
                                timeTextSize='text-2xl'
                                textRight={'Minutes'}
                                showSeconds={true}
                                testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
                                timeInMinutes={currentSectionData?.sectionTime || 0}
                                onTimeUp={handleSectionTimeUp}
                            />

                        ) : (
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
                        )} */}

                        {isSectionalTest ? (
                            <TestTimer
                                key={`section_${currentSection}_${questionsState.length}`}
                                timeClr='text-blue-800'
                                textleft={'SECTION'}
                                textBg='text-red-600'
                                timeTextSize='text-2xl'
                                textRight={'Minutes'}
                                showSeconds={true}
                                testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
                                timeInMinutes={currentSectionData?.sectionTime || 0}
                                onTimeUp={handleSectionTimeUp}
                                isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
                            />
                        ) : (
                            <TestTimer
                                key={`test_${state?.testInfo?.test_id}_${questionsState.length}`}
                                timeClr='text-blue-800'
                                textleft={'TIME LEFT'}
                                textBg='text-red-600'
                                timeTextSize='text-2xl'
                                textRight={''}
                                showSeconds={true}
                                testId={state?.testInfo?.test_id}
                                timeInMinutes={parseInt(state?.testInfo?.test_time) || 0}
                                onTimeUp={handleTimeUp}
                                isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
                            />
                        )}


                    </div>
                </div>
            </div>

            {/* Main Body */}
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                <QuestionGridModal
                    question={isSectionalTest ? currentSectionData?.questions : questionsState}
                    groupedQuestions={isSectionalTest ? [currentSectionData] : groupedQuestions}
                    currentQuestion={currentQuestion}
                    optionSelected={optionSelected}
                    markedForReview={markedForReview}
                    markedForReviewAns={markedWithAns}
                    skippedQuestions={skippedQuestions}
                    setCurrentQuestion={(index) => setCurrentQuestion(index)}
                    onClose={() => setShowModal(false)}
                    onProceed={() => { }}
                />

                <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
                    {/* Question Header */}
                    <div className="flex justify-between items-center mb-4 pb-3 border-b">
                        <div className="flex items-center gap-4">
                            <div className="text-base font-bold text-gray-900">
                                Question {currentQuestion + 1}/{isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
                                {isSectionalTest && (
                                    <span className="ml-2 text-sm text-gray-600">
                                        (Section {currentSection + 1})
                                    </span>
                                )}
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
                                className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
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
                                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
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

            {/* Section Submit Confirmation Modal */}
            {showSectionSubmitConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
                        <p className="text-gray-600 mb-6">
                            This will mark Section {currentSection + 1} as complete.
                            {currentSection < groupedQuestions.length - 1
                                ? ' You will move to the next section.'
                                : ' You can still submit the entire test later.'}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSectionSubmitConfirm(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSectionSubmit}
                                className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
