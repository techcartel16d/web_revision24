// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { getSingleCategoryPackageTestseriesQuestionSlice } from '../../redux/HomeSlice';
// import { useLocation } from 'react-router-dom';

// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const { state } = useLocation();
  
//   // console.log('ONline Exam state',  state)
//   // Extract data from state
//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
  
//   // Create sections from testDetail
//   const sections = testDetail.map(detail => detail.subject_name);
  
//   // Generate questions based on testDetail
//   const generateQuestions = () => {
//     let questions = [];
//     let questionId = 1;
    
//     testDetail.forEach((subject, subjectIndex) => {
//       const questionCount = parseInt(subject.no_of_question);
      
//       for (let i = 0; i < questionCount; i++) {
//         questions.push({
//           id: questionId++,
//           section: subject.subject_name,
//           subjectIndex: subjectIndex,
//           questionNumber: i + 1,
//           text: `Sample question ${i + 1} from ${subject.subject_name}`,
//           options: ['Option A', 'Option B', 'Option C', 'Option D'],
//           status: 'notVisited',
//           userAnswer: null,
//         });
//       }
//     });
    
//     return questions;
//   };

//   const [questions, setQuestions] = useState(generateQuestions());
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [activeSection, setActiveSection] = useState(sections[0] || 'General Awareness');
//   const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60); // Convert minutes to seconds
//   const [loading, setLoading] = useState(false);

//   // console.log('state rrb test screen', state);

//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//       console.log('res', res)
//       if (res.status_code === 200) {
//         console.log("question data fetching", res);
//         // Update questions with actual data from API
//         if (res.data && res.data.length > 0) {
//           const formattedQuestions = res.data.map((question, index) => ({
//             id: index + 1,
//             section: question.subject_name || sections[0],
//             text: question.question_text || `Question ${index + 1}`,
//             options: question.options || ['Option A', 'Option B', 'Option C', 'Option D'],
//             status: 'notVisited',
//             userAnswer: null,
//           }));
//           setQuestions(formattedQuestions);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (state?.testId || state?.testInfo?.test_id) {
//       getTestSeriesQuestion();
//     }
//   }, [state]);

//   // Timer effect
//   useEffect(() => {
//     if (timeLeft <= 0) return;
//     const timerId = setInterval(() => {
//       setTimeLeft(timeLeft - 1);
//     }, 1000);
//     return () => clearInterval(timerId);
//   }, [timeLeft]);

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   // Get questions for current section
//   const getCurrentSectionQuestions = () => {
//     return questions.filter(q => q.section === activeSection);
//   };

//   // Get question counts for each section
//   const getSectionCounts = () => {
//     return sections.map(section => ({
//       section,
//       total: questions.filter(q => q.section === section).length,
//       answered: questions.filter(q => q.section === section && q.status === 'answered').length,
//       marked: questions.filter(q => q.section === section && q.status === 'marked').length,
//       notAnswered: questions.filter(q => q.section === section && q.status === 'notAnswered').length,
//     }));
//   };

//   // Handlers
//   const handleOptionSelect = (option) => {
//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };

//   const goToNextQuestion = () => {
//     const currentSectionQuestions = getCurrentSectionQuestions();
//     const currentIndexInSection = currentSectionQuestions.findIndex(q => q.id === questions[activeQuestionIndex].id);
    
//     if (currentIndexInSection < currentSectionQuestions.length - 1) {
//       // Go to next question in current section
//       const nextQuestionInSection = currentSectionQuestions[currentIndexInSection + 1];
//       const nextGlobalIndex = questions.findIndex(q => q.id === nextQuestionInSection.id);
//       setActiveQuestionIndex(nextGlobalIndex);
//     }
//   };

//   const handleSaveAndNext = () => {
//     const newQuestions = [...questions];
//     const currentQuestion = newQuestions[activeQuestionIndex];
//     if (currentQuestion.userAnswer !== null) {
//       currentQuestion.status = 'answered';
//     } else {
//       currentQuestion.status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//     goToNextQuestion();
//   };

//   const handleMarkForReview = () => {
//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);
//     goToNextQuestion();
//   };

//   const handleClearResponse = () => {
//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };

//   const handlePaletteClick = (questionId) => {
//     const questionIndex = questions.findIndex(q => q.id === questionId);
//     setActiveQuestionIndex(questionIndex);
//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };

//   const handleSectionChange = (section) => {
//     setActiveSection(section);
//     // Find first question of the selected section
//     const firstQuestionOfSection = questions.find(q => q.section === section);
//     if (firstQuestionOfSection) {
//       const index = questions.findIndex(q => q.id === firstQuestionOfSection.id);
//       setActiveQuestionIndex(index);
//     }
//   };

//   // Get color for palette buttons based on question status
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'answered': return 'bg-green-500 text-white';
//       case 'notAnswered': return 'bg-red-500 text-white';
//       case 'marked': return 'bg-purple-500 text-white';
//       case 'notVisited': return 'bg-white text-gray-700';
//       default: return 'bg-white text-gray-700';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-lg font-semibold">Loading questions...</div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];
//   const currentSectionQuestions = getCurrentSectionQuestions();
//   const sectionCounts = getSectionCounts();

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       {/* Header */}
//       <header className="flex items-center justify-between p-2 bg-white border-b">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
//           <div className="ml-6 flex items-center border rounded">
//             {sections.map(section => (
//               <button
//                 key={section}
//                 onClick={() => handleSectionChange(section)}
//                 className={`px-4 py-1.5 text-sm border-r last:border-r-0 ${
//                   activeSection === section ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
//                 }`}
//               >
//                 {section.length > 20 ? `${section.substring(0, 20)}...` : section}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-gray-500">Time Left: <span className="font-semibold text-gray-800">{formatTime(timeLeft)}</span></span>
//           <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600">✕</button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Main Content */}
//         <main className="flex-1 p-6 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-4">
//                 <p className="font-semibold text-gray-800">Question No. {currentQuestion.id}</p>
//                 <p className="text-sm text-gray-600">Section: {currentQuestion.section}</p>
//               </div>
//               <p className="text-gray-700 mb-6">{currentQuestion.text}</p>
//               <div className="space-y-4">
//                 {currentQuestion.options.map((option, index) => (
//                   <label key={index} className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={currentQuestion.userAnswer === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mr-3"
//                     />
//                     <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
//                     {option}
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>

//         {/* Right Sidebar */}
//         <aside className="w-80 bg-blue-100 border-l p-4 flex flex-col">
//           <div className="flex justify-between items-center mb-4">
//             <button className="text-xs border border-gray-400 px-2 py-1 rounded">Switch to Full Screen</button>
//             <button className="text-xs border border-gray-400 px-2 py-1 rounded">Pause</button>
//           </div>
          
//           <div className="flex items-center mb-4">
//             <img src="https://i.pravatar.cc/40" alt="User" className="w-10 h-10 rounded-full mr-3"/>
//             <span className="font-semibold">Rajat</span>
//           </div>

//           {/* Test Info */}
//           <div className="bg-white p-3 rounded mb-4 text-sm">
//             <h4 className="font-semibold mb-2">Test: {testInfo.title}</h4>
//             <div className="space-y-1">
//               <div>Duration: {testInfo.time} minutes</div>
//               <div>Negative Marking: {testInfo.negative_mark}</div>
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="grid grid-cols-2 gap-1 text-xs mb-4">
//             <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div>Answered</div>
//             <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 mr-1"></div>Marked</div>
//             <div className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1"></div>Not Answered</div>
//             <div className="flex items-center"><div className="w-3 h-3 bg-white border mr-1"></div>Not Visited</div>
//           </div>

//           <div className="flex-1 overflow-y-auto border-t border-blue-200 pt-4">
//             <div className="mb-4">
//               <p className="font-semibold text-sm mb-2">SECTION: {activeSection}</p>
//               <p className="text-xs text-gray-600 mb-3">
//                 {currentSectionQuestions.length} Questions
//               </p>
//             </div>

//             <div className="grid grid-cols-5 gap-2 mb-4">
//               {currentSectionQuestions.map((q) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(q.id)}
//                   className={`w-10 h-10 flex items-center justify-center border rounded text-sm ${getStatusColor(q.status)} ${
//                     q.id === currentQuestion?.id ? 'ring-2 ring-blue-500' : ''
//                   }`}
//                 >
//                   {q.questionNumber || q.id}
//                 </button>
//               ))}
//             </div>

//             {/* Section Summary */}
//             <div className="bg-white p-3 rounded text-xs">
//               <h5 className="font-semibold mb-2">Section Summary</h5>
//               {sectionCounts.map(section => (
//                 <div key={section.section} className="mb-2">
//                   <div className="font-medium">{section.section}</div>
//                   <div className="text-gray-600">
//                     Answered: {section.answered}/{section.total}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mt-4 text-center text-sm">
//             <button className="bg-gray-200 py-2 rounded">Question Paper</button>
//             <button className="bg-gray-200 py-2 rounded">Instructions</button>
//             <button className="col-span-2 bg-blue-500 text-white py-2 rounded mt-2">Submit Test</button>
//           </div>
//         </aside>
//       </div>

//       {/* Footer */}
//       <footer className="flex items-center justify-between p-3 bg-white border-t">
//         <div>
//           <button onClick={handleMarkForReview} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2">
//             Mark for Review & Next
//           </button>
//           <button onClick={handleClearResponse} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded">
//             Clear Response
//           </button>
//         </div>
//         <button onClick={handleSaveAndNext} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded">
//           Save & Next
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default RRBTestPage;


// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { getSingleCategoryPackageTestseriesQuestionSlice } from '../../redux/HomeSlice';
// import { useLocation } from 'react-router-dom';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';

// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const { state } = useLocation();
  
//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
  
//   const sections = testDetail.map(detail => detail.subject_name);
  
//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [activeSection, setActiveSection] = useState(sections[0] || 'General Awareness');
//   const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60);
//   const [loading, setLoading] = useState(true);
//   const [confirmSubmit, setConfirmSubmit] = useState(false);
//   const [showPauseModal, setShowPauseModal] = useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // ✅ Fetch questions from API
//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(
//         getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)
//       ).unwrap();
      
//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         const questionsBySection = {};
        
//         res.data.forEach(question => {
//           const sectionName = question.subject_name;
//           if (!questionsBySection[sectionName]) {
//             questionsBySection[sectionName] = [];
//           }
//           questionsBySection[sectionName].push(question);
//         });
        
//         const formattedQuestions = res.data.map((question, globalIndex) => {
//           const sectionName = question.subject_name;
//           const sectionQuestions = questionsBySection[sectionName];
//           const questionNumberInSection = sectionQuestions.indexOf(question) + 1;
          
//           return {
//             id: question.id,
//             globalNumber: globalIndex + 1,
//             questionNumber: questionNumberInSection,
//             section: sectionName,
//             category: question.category_name,
//             text: question.question_hindi,
//             options: [
//               question.option_hindi_a,
//               question.option_hindi_b,
//               question.option_hindi_c,
//               question.option_hindi_d
//             ],
//             correctAnswer: question.hindi_ans,
//             explanation: question.explanation,
//             questionEnglish: question.question_english,
//             optionsEnglish: [
//               question.option_english_a,
//               question.option_english_b,
//               question.option_english_c,
//               question.option_english_d
//             ],
//             correctAnswerEnglish: question.english_ans,
//             explanationEnglish: question.explanation_english,
//             videoLink: question.solution_video_link,
//             status: 'notVisited',
//             userAnswer: null,
//             isMarked: false,
//             timeTaken: 0
//           };
//         });
        
//         setQuestions(formattedQuestions);
        
//         if (formattedQuestions.length > 0) {
//           setActiveSection(formattedQuestions[0].section);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (state?.testInfo?.test_id) {
//       getTestSeriesQuestion();
//     }
//   }, []);

//   // Timer effect
//   useEffect(() => {
//     if (timeLeft <= 0 || loading) return;
//     const timerId = setInterval(() => {
//       setTimeLeft(timeLeft - 1);
//     }, 1000);
//     return () => clearInterval(timerId);
//   }, [timeLeft, loading]);

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const getCurrentSectionQuestions = () => {
//     return questions.filter(q => q.section === activeSection);
//   };

//   const getSectionCounts = () => {
//     return sections.map(section => ({
//       section,
//       total: questions.filter(q => q.section === section).length,
//       answered: questions.filter(q => q.section === section && q.status === 'answered').length,
//       marked: questions.filter(q => q.section === section && q.status === 'marked').length,
//       notAnswered: questions.filter(q => q.section === section && q.status === 'notAnswered').length,
//     }));
//   };

//   const handleOptionSelect = (option) => {
//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };

//   const goToNextQuestion = () => {
//     const currentSectionQuestions = getCurrentSectionQuestions();
//     const currentIndexInSection = currentSectionQuestions.findIndex(
//       q => q.id === questions[activeQuestionIndex].id
//     );
    
//     if (currentIndexInSection < currentSectionQuestions.length - 1) {
//       const nextQuestionInSection = currentSectionQuestions[currentIndexInSection + 1];
//       const nextGlobalIndex = questions.findIndex(q => q.id === nextQuestionInSection.id);
//       setActiveQuestionIndex(nextGlobalIndex);
//     }
//   };

//   const handleSaveAndNext = () => {
//     const newQuestions = [...questions];
//     const currentQuestion = newQuestions[activeQuestionIndex];
//     if (currentQuestion.userAnswer !== null) {
//       currentQuestion.status = 'answered';
//     } else {
//       currentQuestion.status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//     goToNextQuestion();
//   };

//   const handleMarkForReview = () => {
//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);
//     goToNextQuestion();
//   };

//   const handleClearResponse = () => {
//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };

//   const handlePaletteClick = (questionId) => {
//     const questionIndex = questions.findIndex(q => q.id === questionId);
//     setActiveQuestionIndex(questionIndex);
//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };

//   const handleSectionChange = (section) => {
//     setActiveSection(section);
//     const firstQuestionOfSection = questions.find(q => q.section === section);
//     if (firstQuestionOfSection) {
//       const index = questions.findIndex(q => q.id === firstQuestionOfSection.id);
//       setActiveQuestionIndex(index);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'answered': return 'bg-green-500 text-white';
//       case 'notAnswered': return 'bg-red-500 text-white';
//       case 'marked': return 'bg-purple-500 text-white';
//       case 'notVisited': return 'bg-white text-gray-700';
//       default: return 'bg-white text-gray-700';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">No questions available</div>
//           <button onClick={() => window.history.back()} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];
//   const currentSectionQuestions = getCurrentSectionQuestions();
//   const sectionCounts = getSectionCounts();


//     // Submit Test
//       const handleSubmit = async () => {
//           const testId = state?.testInfo?.test_id;
//           const currentId = questionsState[currentQuestion]?.id;
  
//           if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//               const updatedSelected = [...optionSelected, currentId];
//               await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//           }
  
//           const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//           const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//           const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//           const skippedQuestions = await secureGetTestData(testId, 'skippedQuestions') || [];
//           const markedForReview = await secureGetTestData(testId, 'markedForReview') || [];
//           const totalAttendedQuestions = optionSelected2.length;
//           const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;
  
//           let correct = 0;
//           let in_correct = 0;
  
//           const allAttendedQuestions = optionSelected.map((questionId) => {
//               const question = questionsState.find(q => q.id === questionId);
//               const selectedAns = selectedOptions2[questionId];
//               const rightAns = question?.hindi_ans;
  
//               if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                   correct++;
//               } else {
//                   in_correct++;
//               }
  
//               return {
//                   question_id: questionId,
//                   user_selected_ans: selectedAns,
//                   right_ans: rightAns
//               };
//           });
  
//           const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//           const statMark = parseFloat(state?.testDetail[0]?.marks || 0);
//           const markPer_ques = statMark / questionsState.length;
//           const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//           const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);
  
//           const submissionData = {
//               test_id: testId,
//               total_attend_question: totalAttendedQuestions,
//               total_not_answer_question: totalNotAnsweredQuestions,
//               correct,
//               in_correct,
//               marks: marksScored,
//               time: totalTimeSpent,
//               negative_mark: negativeMark,
//               all_attend_question: allAttendedQuestions,
//               spent_time: spentTime,
//               skip_question: skippedQuestions,
//               attend_question: optionSelected2,
//               mark_for_review: markedForReview
//           };
  
//           try {
//               const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//               if (res.status_code == 200) {
//                   await clearAllTestData(testId);
//                   nav('/analysis', { replace: true, state });
//               }
//           } catch (error) {
//               console.error("❌ Error in Submitting Test:", error);
//           }
//       };

//       const handleConfirmPause = async () => {
//           setShowPauseModal(false);
//           const currentTestId = state?.testInfo?.test_id;
  
//           try {
//               const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//               const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);
  
//               updatedStatus.push({
//                   test_id: currentTestId,
//                   isPaused: true,
//               });
  
//               await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//               exitFullScreen();
//               nav('/testpakages', { replace: true, state: { testId: state?.testId } });
//           } catch (error) {
//               console.error("❌ Failed to pause test securely:", error);
//           }
//       };
//          const handleCancelPause = () => {
//         setShowPauseModal(false);
//     };
//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       {/* Header */}
//       <header className="flex items-center justify-between p-2 bg-white border-b">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
//           <div className="ml-6 flex items-center border rounded">
//             {sections.map(section => (
//               <button
//                 key={section}
//                 onClick={() => handleSectionChange(section)}
//                 className={`px-4 py-1.5 text-sm border-r last:border-r-0 ${
//                   activeSection === section ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
//                 }`}
//               >
//                 {section.length > 20 ? `${section.substring(0, 20)}...` : section}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-gray-500">
//             Time Left: <span className="font-semibold text-gray-800">{formatTime(timeLeft)}</span>
//           </span>
//           <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600">
//             ✕
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Main Content */}
//         <main className="flex-1 p-6 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-4">
//                 <p className="font-semibold text-gray-800">Question No. {currentQuestion.globalNumber}</p>
//                 <p className="text-sm text-gray-600">Section: {currentQuestion.section}</p>
//               </div>
//               <p className="text-gray-700 mb-6">{currentQuestion.text}</p>
//               <div className="space-y-4">
//                 {currentQuestion.options.map((option, index) => (
//                   <label 
//                     key={index} 
//                     className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={currentQuestion.userAnswer === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mr-3"
//                     />
//                     <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
//                     {option}
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>

//         {/* Right Sidebar */}
//         <aside className="w-80 bg-blue-100 border-l p-4 flex flex-col">
//           <div className="flex justify-between items-center mb-4">
//             <button className="text-xs border border-gray-400 px-2 py-1 rounded">Switch to Full Screen</button>
//             <button className="text-xs border border-gray-400 px-2 py-1 rounded">Pause</button>
//           </div>
          
//           <div className="flex items-center mb-4">
//             <img src="https://i.pravatar.cc/40" alt="User" className="w-10 h-10 rounded-full mr-3"/>
//             <span className="font-semibold">Rajat</span>
//           </div>

//           <div className="bg-white p-3 rounded mb-4 text-sm">
//             <h4 className="font-semibold mb-2">Test: {testInfo.title}</h4>
//             <div className="space-y-1">
//               <div>Duration: {testInfo.time} minutes</div>
//               <div>Negative Marking: {testInfo.negative_mark}</div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-1 text-xs mb-4">
//             <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div>Answered</div>
//             <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 mr-1"></div>Marked</div>
//             <div className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1"></div>Not Answered</div>
//             <div className="flex items-center"><div className="w-3 h-3 bg-white border mr-1"></div>Not Visited</div>
//           </div>

//           <div className="flex-1 overflow-y-auto border-t border-blue-200 pt-4">
//             <div className="mb-4">
//               <p className="font-semibold text-sm mb-2">SECTION: {activeSection}</p>
//               <p className="text-xs text-gray-600 mb-3">{currentSectionQuestions.length} Questions</p>
//             </div>

//             <div className="grid grid-cols-5 gap-2 mb-4">
//               {currentSectionQuestions.map((q) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(q.id)}
//                   className={`w-10 h-10 flex items-center justify-center border rounded text-sm ${getStatusColor(q.status)} ${
//                     q.id === currentQuestion?.id ? 'ring-2 ring-blue-500' : ''
//                   }`}
//                 >
//                   {q.questionNumber}
//                 </button>
//               ))}
//             </div>

//             <div className="bg-white p-3 rounded text-xs">
//               <h5 className="font-semibold mb-2">Section Summary</h5>
//               {sectionCounts.map(section => (
//                 <div key={section.section} className="mb-2">
//                   <div className="font-medium">{section.section}</div>
//                   <div className="text-gray-600">
//                     Answered: {section.answered}/{section.total}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mt-4 text-center text-sm">
//             <button className="bg-gray-200 py-2 rounded">Question Paper</button>
//             <button className="bg-gray-200 py-2 rounded">Instructions</button>
//             <button className="col-span-2 bg-blue-500 text-white py-2 rounded mt-2" onClick={() => setConfirmSubmit(true)}>Submit Test</button>
//           </div>
//         </aside>
//       </div>

//       {/* Footer */}
//       <footer className="flex items-center justify-between p-3 bg-white border-t">
//         <div>
//           <button 
//             onClick={handleMarkForReview} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2"
//           >
//             Mark for Review & Next
//           </button>
//           <button 
//             onClick={handleClearResponse} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
//           >
//             Clear Response
//           </button>
//         </div>
//         <button 
//           onClick={handleSaveAndNext} 
//           className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded"
//         >
//           Save & Next
//         </button>
//       </footer>




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
//     </div>
//   );
// };

// export default RRBTestPage;

// Section Wise Test Page Show

// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { 
//   getSingleCategoryPackageTestseriesQuestionSlice,
//   attendQuestionSubmitSlice 
// } from '../../redux/HomeSlice';
// import {
//   secureSaveTestData,
//   secureGetTestData,
//   clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';

// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();
  
//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
//   const testId = state?.testInfo?.test_id;
  
//   // ✅ All States
//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [activeSection, setActiveSection] = useState('');
//   const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60);
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
  
//   // ✅ Question States (from SSC)
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
//   const sections = testDetail.map(detail => detail.subject_name);

//   // ✅ Load User Data
//   useEffect(() => {
//     const loadUserData = async () => {
//       const user = await getUserDataDecrypted();
//       setUserInfo(user);
//     };
//     loadUserData();
//   }, []);

//   // ✅ Restore Encrypted Test Data
//   useEffect(() => {
//     const restoreTestData = async () => {
//       if (!testId) return;

//       const [
//         storedOptions,
//         storedAttempted,
//         storedMarked,
//         storedSkipped,
//         storedMarkedWithAns,
//       ] = await Promise.all([
//         secureGetTestData(testId, "selectedOptions"),
//         secureGetTestData(testId, "optionSelected"),
//         secureGetTestData(testId, "markedForReview"),
//         secureGetTestData(testId, "skippedQuestions"),
//         secureGetTestData(testId, "marked_with_ans"),
//       ]);

//       if (storedOptions) setSelectedOptions(storedOptions);
//       if (storedAttempted) setOptionSelected(storedAttempted);
//       if (storedMarked) setMarkedForReview(storedMarked);
//       if (storedSkipped) setSkippedQuestions(storedSkipped);
//       if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//     };

//     restoreTestData();
//   }, [testId]);

//   // ✅ Fetch Questions from API
//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(
//         getSingleCategoryPackageTestseriesQuestionSlice(testId)
//       ).unwrap();
      
//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         const formattedQuestions = res.data.map((question, index) => ({
//           id: question.id,
//           globalNumber: index + 1,
//           section: question.subject_name,
//           text: question.question_hindi,
//           options: [
//             question.option_hindi_a,
//             question.option_hindi_b,
//             question.option_hindi_c,
//             question.option_hindi_d
//           ],
//           correctAnswer: question.hindi_ans,
//           explanation: question.explanation,
//           status: 'notVisited',
//           userAnswer: null,
//         }));
        
//         setQuestions(formattedQuestions);
//         if (formattedQuestions.length > 0) {
//           setActiveSection(formattedQuestions[0].section);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (testId) {
//       getTestSeriesQuestion();
//     }
//   }, [testId]);

//   // ✅ Save Test Data to Encrypted Storage
//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "selectedOptions", selectedOptions);
//   }, [selectedOptions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "optionSelected", optionSelected);
//   }, [optionSelected, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "markedForReview", markedForReview);
//   }, [markedForReview, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//   }, [skippedQuestions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//   }, [markedWithAns, testId]);

//   // ✅ Timer Effect
//   useEffect(() => {
//     if (timeLeft <= 0 || loading) {
//       if (timeLeft <= 0) handleSubmit();
//       return;
//     }
    
//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);
    
//     return () => clearInterval(timerId);
//   }, [timeLeft, loading]);

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   // ✅ Update Question Start Time
//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [activeQuestionIndex]);

//   // ✅ Update Spent Time
//   const updateSpentTime = async (questionId) => {
//     const now = Date.now();
//     const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
    
//     let existing = await secureGetTestData(testId, 'spentTime');
//     existing = existing || [];

//     const updated = (() => {
//       const found = existing.find(item => item.questionId === questionId);
//       if (found) {
//         return existing.map(item =>
//           item.questionId === questionId
//             ? { ...item, time: item.time + timeSpentOnQuestion }
//             : item
//         );
//       } else {
//         return [...existing, { questionId, time: timeSpentOnQuestion }];
//       }
//     })();

//     await secureSaveTestData(testId, 'spentTime', updated);
//   };

//   // ✅ Get Questions for Current Section
//   const getCurrentSectionQuestions = () => {
//     return questions.filter(q => q.section === activeSection);
//   };

//   // ✅ Get Section Counts
//   const getSectionCounts = () => {
//     return sections.map(section => ({
//       section,
//       total: questions.filter(q => q.section === section).length,
//       answered: questions.filter(q => q.section === section && optionSelected.includes(q.id)).length,
//       marked: questions.filter(q => q.section === section && markedForReview.includes(q.id)).length,
//       notAnswered: questions.filter(q => q.section === section && skippedQuestions.includes(q.id)).length,
//     }));
//   };

//   // ✅ Handle Option Select
//   const handleOptionSelect = async (option) => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updated = { ...selectedOptions, [currentId]: option };
//     setSelectedOptions(updated);
//     await secureSaveTestData(testId, 'selectedOptions', updated);

//     // Update status
//     const newQuestions = [...questions];
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     setQuestions(newQuestions);

//     if (markedForReview.includes(currentId)) {
//       if (!markedWithAns.includes(currentId)) {
//         const updatedMarkedWithAns = [...markedWithAns, currentId];
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//       }
//     }

//     if (skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }
//   };

//   // ✅ Handle Save And Next
//   const handleSaveAndNext = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];
//     const isAlreadySelected = optionSelected.includes(currentId);

//     if (isOptionSelected && !isAlreadySelected) {
//       const updatedSelected = [...optionSelected, currentId];
//       setOptionSelected(updatedSelected);
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     // Update status to answered
//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'answered';
//     setQuestions(newQuestions);

//     goToNextQuestion();
//   };

//   // ✅ Handle Mark For Review
//   const handleMarkForReview = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];

//     if (isOptionSelected && !markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = [...markedWithAns, currentId];
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!isOptionSelected && !markedForReview.includes(currentId)) {
//       const updatedMarked = [...markedForReview, currentId];
//       setMarkedForReview(updatedMarked);
//       await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }

//     // Update status
//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);

//     goToNextQuestion();
//   };

//   // ✅ Handle Clear Response
//   const handleClearResponse = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
    
//     const updatedSelectedOptions = { ...selectedOptions };
//     delete updatedSelectedOptions[currentId];
//     setSelectedOptions(updatedSelectedOptions);
//     await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//     if (markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     // Update UI
//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };

//   // ✅ Go to Next Question
//   const goToNextQuestion = () => {
//     const currentSectionQuestions = getCurrentSectionQuestions();
//     const currentQuestion = questions[activeQuestionIndex];
//     const currentIndexInSection = currentSectionQuestions.findIndex(q => q.id === currentQuestion.id);
    
//     if (currentIndexInSection < currentSectionQuestions.length - 1) {
//       const nextQuestionInSection = currentSectionQuestions[currentIndexInSection + 1];
//       const nextGlobalIndex = questions.findIndex(q => q.id === nextQuestionInSection.id);
//       setActiveQuestionIndex(nextGlobalIndex);
      
//       // Mark as not answered if not visited
//       const newQuestions = [...questions];
//       if (newQuestions[nextGlobalIndex].status === 'notVisited') {
//         newQuestions[nextGlobalIndex].status = 'notAnswered';
//       }
//       setQuestions(newQuestions);
//     }
//   };

//   // ✅ Handle Palette Click
//   const handlePaletteClick = (questionId) => {
//     const questionIndex = questions.findIndex(q => q.id === questionId);
//     setActiveQuestionIndex(questionIndex);
    
//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };

//   // ✅ Handle Section Change
//   const handleSectionChange = (section) => {
//     setActiveSection(section);
    
//     const sectionQuestions = questions.filter(q => q.section === section);
//     if (sectionQuestions.length > 0) {
//       const firstQuestion = sectionQuestions[0];
//       const index = questions.findIndex(q => q.id === firstQuestion.id);
//       setActiveQuestionIndex(index);
      
//       const newQuestions = [...questions];
//       if (newQuestions[index].status === 'notVisited') {
//         newQuestions[index].status = 'notAnswered';
//       }
//       setQuestions(newQuestions);
//     }
//   };

//   // ✅ Handle Submit Test
//   const handleSubmit = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//       const updatedSelected = [...optionSelected, currentId];
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
    
//     const totalAttendedQuestions = optionSelected2.length;
//     const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

//     let correct = 0;
//     let in_correct = 0;

//     const allAttendedQuestions = optionSelected2.map((questionId) => {
//       const question = questions.find(q => q.id === questionId);
//       const selectedAns = selectedOptions2[questionId];
//       const rightAns = question?.correctAnswer;

//       if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//         correct++;
//       } else {
//         in_correct++;
//       }

//       return {
//         question_id: questionId,
//         user_selected_ans: selectedAns,
//         right_ans: rightAns
//       };
//     });

//     const negativeMark = parseFloat(testInfo.negative_mark || 0);
//     const statMark = parseFloat(testDetail[0]?.marks || 0);
//     const markPer_ques = statMark / questions.length;
//     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     const submissionData = {
//       test_id: testId,
//       total_attend_question: totalAttendedQuestions,
//       total_not_answer_question: totalNotAnsweredQuestions,
//       correct,
//       in_correct,
//       marks: marksScored,
//       time: totalTimeSpent,
//       negative_mark: negativeMark,
//       all_attend_question: allAttendedQuestions,
//       spent_time: spentTime,
//       skip_question: skippedQuestions2,
//       attend_question: optionSelected2,
//       mark_for_review: markedForReview2
//     };

//     try {
//       const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//       if (res.status_code == 200) {
//         await clearAllTestData(testId);
//         navigate('/analysis', { replace: true, state });
//       }
//     } catch (error) {
//       console.error("Error submitting test:", error);
//     }
//   };

//   // ✅ Get Status Color
//   const getStatusColor = (status) => {
//     if (optionSelected.includes(status)) return 'bg-green-500 text-white';
//     if (markedForReview.includes(status)) return 'bg-purple-500 text-white';
//     if (skippedQuestions.includes(status)) return 'bg-red-500 text-white';
//     return 'bg-white text-gray-700';
//   };

//   // ✅ Loading State
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ No Questions State
//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="text-xl font-semibold text-gray-700 mb-2">No questions available</div>
//           <button 
//             onClick={() => navigate(-1)}
//             className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];
//   const currentSectionQuestions = getCurrentSectionQuestions();
//   const sectionCounts = getSectionCounts();

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       {/* Header */}
//       <header className="flex items-center justify-between p-2 bg-white border-b">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
//           <div className="ml-6 flex items-center border rounded">
//             {sections.map(section => (
//               <button
//                 key={section}
//                 onClick={() => handleSectionChange(section)}
//                 className={`px-4 py-1.5 text-sm border-r last:border-r-0 ${
//                   activeSection === section ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
//                 }`}
//               >
//                 {section.length > 20 ? `${section.substring(0, 20)}...` : section}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-gray-500">
//             Time Left: <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
//           </span>
//           <button 
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600"
//           >
//             ✕
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Main Content */}
//         <main className="flex-1 p-6 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-4">
//                 <p className="font-semibold text-gray-800">Question No. {currentQuestion.globalNumber}</p>
//                 <p className="text-sm text-gray-600">Section: {currentQuestion.section}</p>
//               </div>
//               <p className="text-gray-700 mb-6">{currentQuestion.text}</p>
//               <div className="space-y-4">
//                 {currentQuestion.options.map((option, index) => (
//                   <label 
//                     key={index} 
//                     className={`flex items-center cursor-pointer p-3 border-2 rounded-lg transition-all ${
//                       selectedOptions[currentQuestion.id] === option
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={selectedOptions[currentQuestion.id] === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mr-3"
//                     />
//                     <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
//                     {option}
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>

//         {/* Right Sidebar */}
//         <aside className="w-80 bg-blue-100 border-l p-4 flex flex-col">
//           <div className="flex justify-between items-center mb-4">
//             <button className="text-xs border border-gray-400 px-2 py-1 rounded bg-white hover:bg-gray-50">
//               Switch to Full Screen
//             </button>
//             <button className="text-xs border border-gray-400 px-2 py-1 rounded bg-white hover:bg-gray-50">
//               Pause
//             </button>
//           </div>
          
//           <div className="flex items-center mb-4">
//             <img 
//               src={userInfo?.profile || "https://i.pravatar.cc/40"} 
//               alt="User" 
//               className="w-10 h-10 rounded-full mr-3"
//             />
//             <span className="font-semibold">{userInfo?.name || 'Student'}</span>
//           </div>

//           <div className="bg-white p-3 rounded mb-4 text-sm">
//             <h4 className="font-semibold mb-2">Test: {testInfo.title}</h4>
//             <div className="space-y-1">
//               <div>Duration: {testInfo.time} minutes</div>
//               <div>Negative Marking: {testInfo.negative_mark}</div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-1 text-xs mb-4">
//             <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div>Answered</div>
//             <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 mr-1"></div>Marked</div>
//             <div className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1"></div>Not Answered</div>
//             <div className="flex items-center"><div className="w-3 h-3 bg-white border mr-1"></div>Not Visited</div>
//           </div>

//           <div className="flex-1 overflow-y-auto border-t border-blue-200 pt-4">
//             <div className="mb-4">
//               <p className="font-semibold text-sm mb-2">SECTION: {activeSection}</p>
//               <p className="text-xs text-gray-600 mb-3">{currentSectionQuestions.length} Questions</p>
//             </div>

//             <div className="grid grid-cols-5 gap-2 mb-4">
//               {currentSectionQuestions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(q.id)}
//                   className={`w-10 h-10 flex items-center justify-center border rounded text-sm font-semibold ${getStatusColor(q.id)} ${
//                     q.id === currentQuestion?.id ? 'ring-2 ring-blue-500' : ''
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <div className="bg-white p-3 rounded text-xs">
//               <h5 className="font-semibold mb-2">Section Summary</h5>
//               {sectionCounts.map(section => (
//                 <div key={section.section} className="mb-2">
//                   <div className="font-medium">{section.section}</div>
//                   <div className="text-gray-600">
//                     Answered: {section.answered}/{section.total}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mt-4 text-center text-sm">
//             <button className="bg-gray-200 py-2 rounded hover:bg-gray-300">Question Paper</button>
//             <button className="bg-gray-200 py-2 rounded hover:bg-gray-300">Instructions</button>
//             <button 
//               onClick={handleSubmit}
//               className="col-span-2 bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600 font-semibold"
//             >
//               Submit Test
//             </button>
//           </div>
//         </aside>
//       </div>

//       {/* Footer */}
//       <footer className="flex items-center justify-between p-3 bg-white border-t">
//         <div>
//           <button 
//             onClick={handleMarkForReview} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2"
//           >
//             Mark for Review & Next
//           </button>
//           <button 
//             onClick={handleClearResponse} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
//           >
//             Clear Response
//           </button>
//         </div>
//         <button 
//           onClick={handleSaveAndNext} 
//           className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded"
//         >
//           Save & Next
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default RRBTestPage;


// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { 
//   getSingleCategoryPackageTestseriesQuestionSlice,
//   attendQuestionSubmitSlice 
// } from '../../redux/HomeSlice';
// import {
//   secureSaveTestData,
//   secureGetTestData,
//   clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';

// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();
  
//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
//   const testId = state?.testInfo?.test_id;
  
//   // States
//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [activeSection, setActiveSection] = useState('All Questions');
//   const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60);
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
//   const [hasSections, setHasSections] = useState(false); // ✅ New state
//   const [sections, setSections] = useState([]); // ✅ Dynamic sections
  
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());

//   // ✅ Load User Data
//   useEffect(() => {
//     const loadUserData = async () => {
//       const user = await getUserDataDecrypted();
//       setUserInfo(user);
//     };
//     loadUserData();
//   }, []);

//   // ✅ Restore Test Data
//   useEffect(() => {
//     const restoreTestData = async () => {
//       if (!testId) return;

//       const [
//         storedOptions,
//         storedAttempted,
//         storedMarked,
//         storedSkipped,
//         storedMarkedWithAns,
//       ] = await Promise.all([
//         secureGetTestData(testId, "selectedOptions"),
//         secureGetTestData(testId, "optionSelected"),
//         secureGetTestData(testId, "markedForReview"),
//         secureGetTestData(testId, "skippedQuestions"),
//         secureGetTestData(testId, "marked_with_ans"),
//       ]);

//       if (storedOptions) setSelectedOptions(storedOptions);
//       if (storedAttempted) setOptionSelected(storedAttempted);
//       if (storedMarked) setMarkedForReview(storedMarked);
//       if (storedSkipped) setSkippedQuestions(storedSkipped);
//       if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//     };

//     restoreTestData();
//   }, [testId]);

//   // ✅ Fetch Questions - Handle Both Types
//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(
//         getSingleCategoryPackageTestseriesQuestionSlice(testId)
//       ).unwrap();
      
//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         // ✅ Check if questions have sections
//         const uniqueSections = [...new Set(res.data.map(q => q.subject_name))];
//         const hasMultipleSections = uniqueSections.length > 1;
        
//         setHasSections(hasMultipleSections);
        
//         if (hasMultipleSections) {
//           // ✅ Section-wise mode
//           setSections(uniqueSections);
//           setActiveSection(uniqueSections[0]);
//         } else {
//           // ✅ Direct mode (no sections)
//           setSections(['All Questions']);
//           setActiveSection('All Questions');
//         }
        
//         const formattedQuestions = res.data.map((question, index) => ({
//           id: question.id,
//           globalNumber: index + 1,
//           section: question.subject_name || 'All Questions',
//           text: question.question_hindi,
//           options: [
//             question.option_hindi_a,
//             question.option_hindi_b,
//             question.option_hindi_c,
//             question.option_hindi_d
//           ],
//           correctAnswer: question.hindi_ans,
//           explanation: question.explanation,
//           status: 'notVisited',
//           userAnswer: null,
//         }));
        
//         setQuestions(formattedQuestions);
        
//         console.log('✅ Questions loaded:', formattedQuestions.length);
//         console.log('✅ Has sections:', hasMultipleSections);
//         console.log('✅ Sections:', hasMultipleSections ? uniqueSections : ['All Questions']);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (testId) {
//       getTestSeriesQuestion();
//     }
//   }, [testId]);

//   // ✅ Save Test Data
//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "selectedOptions", selectedOptions);
//   }, [selectedOptions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "optionSelected", optionSelected);
//   }, [optionSelected, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "markedForReview", markedForReview);
//   }, [markedForReview, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//   }, [skippedQuestions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//   }, [markedWithAns, testId]);

//   // ✅ Timer
//   useEffect(() => {
//     if (timeLeft <= 0 || loading) {
//       if (timeLeft <= 0) handleSubmit();
//       return;
//     }
    
//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);
    
//     return () => clearInterval(timerId);
//   }, [timeLeft, loading]);

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   // ✅ Update Question Start Time
//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [activeQuestionIndex]);

//   // ✅ Update Spent Time
//   const updateSpentTime = async (questionId) => {
//     const now = Date.now();
//     const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
    
//     let existing = await secureGetTestData(testId, 'spentTime');
//     existing = existing || [];

//     const updated = (() => {
//       const found = existing.find(item => item.questionId === questionId);
//       if (found) {
//         return existing.map(item =>
//           item.questionId === questionId
//             ? { ...item, time: item.time + timeSpentOnQuestion }
//             : item
//         );
//       } else {
//         return [...existing, { questionId, time: timeSpentOnQuestion }];
//       }
//     })();

//     await secureSaveTestData(testId, 'spentTime', updated);
//   };

//   // ✅ Get Current Section Questions
//   const getCurrentSectionQuestions = () => {
//     if (!hasSections || activeSection === 'All Questions') {
//       return questions;
//     }
//     return questions.filter(q => q.section === activeSection);
//   };

//   // ✅ Get Section Counts
//   const getSectionCounts = () => {
//     return sections.map(section => {
//       const sectionQuestions = section === 'All Questions' 
//         ? questions 
//         : questions.filter(q => q.section === section);
      
//       return {
//         section,
//         total: sectionQuestions.length,
//         answered: sectionQuestions.filter(q => optionSelected.includes(q.id)).length,
//         marked: sectionQuestions.filter(q => markedForReview.includes(q.id)).length,
//         notAnswered: sectionQuestions.filter(q => skippedQuestions.includes(q.id)).length,
//       };
//     });
//   };

//   // ✅ Handle Option Select
//   const handleOptionSelect = async (option) => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updated = { ...selectedOptions, [currentId]: option };
//     setSelectedOptions(updated);
//     await secureSaveTestData(testId, 'selectedOptions', updated);

//     const newQuestions = [...questions];
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     setQuestions(newQuestions);

//     if (markedForReview.includes(currentId)) {
//       if (!markedWithAns.includes(currentId)) {
//         const updatedMarkedWithAns = [...markedWithAns, currentId];
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//       }
//     }

//     if (skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }
//   };

//   // ✅ Handle Save And Next
//   const handleSaveAndNext = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];
//     const isAlreadySelected = optionSelected.includes(currentId);

//     if (isOptionSelected && !isAlreadySelected) {
//       const updatedSelected = [...optionSelected, currentId];
//       setOptionSelected(updatedSelected);
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'answered';
//     setQuestions(newQuestions);

//     goToNextQuestion();
//   };

//   // ✅ Handle Mark For Review
//   const handleMarkForReview = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];

//     if (isOptionSelected && !markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = [...markedWithAns, currentId];
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!isOptionSelected && !markedForReview.includes(currentId)) {
//       const updatedMarked = [...markedForReview, currentId];
//       setMarkedForReview(updatedMarked);
//       await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);

//     goToNextQuestion();
//   };

//   // ✅ Handle Clear Response
//   const handleClearResponse = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
    
//     const updatedSelectedOptions = { ...selectedOptions };
//     delete updatedSelectedOptions[currentId];
//     setSelectedOptions(updatedSelectedOptions);
//     await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//     if (markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };

//   // ✅ Go to Next Question
//   const goToNextQuestion = () => {
//     const currentSectionQuestions = getCurrentSectionQuestions();
//     const currentQuestion = questions[activeQuestionIndex];
//     const currentIndexInSection = currentSectionQuestions.findIndex(q => q.id === currentQuestion.id);
    
//     if (currentIndexInSection < currentSectionQuestions.length - 1) {
//       const nextQuestionInSection = currentSectionQuestions[currentIndexInSection + 1];
//       const nextGlobalIndex = questions.findIndex(q => q.id === nextQuestionInSection.id);
//       setActiveQuestionIndex(nextGlobalIndex);
      
//       const newQuestions = [...questions];
//       if (newQuestions[nextGlobalIndex].status === 'notVisited') {
//         newQuestions[nextGlobalIndex].status = 'notAnswered';
//       }
//       setQuestions(newQuestions);
//     } else {
//       // ✅ Loop back to first question
//       setActiveQuestionIndex(0);
//     }
//   };

//   // ✅ Handle Palette Click
//   const handlePaletteClick = (questionId) => {
//     const questionIndex = questions.findIndex(q => q.id === questionId);
//     setActiveQuestionIndex(questionIndex);
    
//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };

//   // ✅ Handle Section Change
//   const handleSectionChange = (section) => {
//     setActiveSection(section);
    
//     const sectionQuestions = section === 'All Questions' 
//       ? questions 
//       : questions.filter(q => q.section === section);
    
//     if (sectionQuestions.length > 0) {
//       const firstQuestion = sectionQuestions[0];
//       const index = questions.findIndex(q => q.id === firstQuestion.id);
//       setActiveQuestionIndex(index);
      
//       const newQuestions = [...questions];
//       if (newQuestions[index].status === 'notVisited') {
//         newQuestions[index].status = 'notAnswered';
//       }
//       setQuestions(newQuestions);
//     }
//   };

//   // ✅ Handle Submit
//   const handleSubmit = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//       const updatedSelected = [...optionSelected, currentId];
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
    
//     const totalAttendedQuestions = optionSelected2.length;
//     const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

//     let correct = 0;
//     let in_correct = 0;

//     const allAttendedQuestions = optionSelected2.map((questionId) => {
//       const question = questions.find(q => q.id === questionId);
//       const selectedAns = selectedOptions2[questionId];
//       const rightAns = question?.correctAnswer;

//       if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//         correct++;
//       } else {
//         in_correct++;
//       }

//       return {
//         question_id: questionId,
//         user_selected_ans: selectedAns,
//         right_ans: rightAns
//       };
//     });

//     const negativeMark = parseFloat(testInfo.negative_mark || 0);
//     const statMark = parseFloat(testDetail[0]?.marks || 0);
//     const markPer_ques = statMark / questions.length;
//     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     const submissionData = {
//       test_id: testId,
//       total_attend_question: totalAttendedQuestions,
//       total_not_answer_question: totalNotAnsweredQuestions,
//       correct,
//       in_correct,
//       marks: marksScored,
//       time: totalTimeSpent,
//       negative_mark: negativeMark,
//       all_attend_question: allAttendedQuestions,
//       spent_time: spentTime,
//       skip_question: skippedQuestions2,
//       attend_question: optionSelected2,
//       mark_for_review: markedForReview2
//     };

//     try {
//       const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//       if (res.status_code == 200) {
//         await clearAllTestData(testId);
//         navigate('/analysis', { replace: true, state });
//       }
//     } catch (error) {
//       console.error("Error submitting test:", error);
//     }
//   };

//   // ✅ Get Status Color
//   const getStatusColor = (questionId) => {
//     if (optionSelected.includes(questionId)) return 'bg-green-500 text-white';
//     if (markedForReview.includes(questionId)) return 'bg-purple-500 text-white';
//     if (skippedQuestions.includes(questionId)) return 'bg-red-500 text-white';
//     return 'bg-white text-gray-700 border-gray-300';
//   };

//   // ✅ Loading State
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ No Questions State
//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="text-xl font-semibold text-gray-700 mb-2">No questions available</div>
//           <button 
//             onClick={() => navigate(-1)}
//             className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];
//   const currentSectionQuestions = getCurrentSectionQuestions();
//   const sectionCounts = getSectionCounts();

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       {/* Header */}
//       <header className="flex items-center justify-between p-2 bg-white border-b">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
          
//           {/* ✅ Conditional Section Tabs */}
//           {hasSections && (
//             <div className="ml-6 flex items-center border rounded">
//               {sections.map(section => (
//                 <button
//                   key={section}
//                   onClick={() => handleSectionChange(section)}
//                   className={`px-4 py-1.5 text-sm border-r last:border-r-0 ${
//                     activeSection === section ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
//                   }`}
//                 >
//                   {section.length > 20 ? `${section.substring(0, 20)}...` : section}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-gray-500">
//             Time Left: <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
//           </span>
//           <button 
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
//           >
//             ✕
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Main Content */}
//         <main className="flex-1 p-6 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-4">
//                 <p className="font-semibold text-gray-800">
//                   Question No. {currentQuestion.globalNumber}
//                 </p>
//                 {hasSections && (
//                   <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
//                     Section: {currentQuestion.section}
//                   </p>
//                 )}
//               </div>
//               <p className="text-gray-700 mb-6 text-lg leading-relaxed">{currentQuestion.text}</p>
//               <div className="space-y-3">
//                 {currentQuestion.options.map((option, index) => (
//                   <label 
//                     key={index} 
//                     className={`flex items-start cursor-pointer p-4 border-2 rounded-xl transition-all ${
//                       selectedOptions[currentQuestion.id] === option
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={selectedOptions[currentQuestion.id] === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mt-1 mr-3 w-4 h-4"
//                     />
//                     <div className="flex-1">
//                       <span className="font-bold text-gray-700 mr-2">
//                         {String.fromCharCode(65 + index)}.
//                       </span>
//                       <span className="text-gray-800">{option}</span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>

//         {/* Right Sidebar */}
//         <aside className="w-80 bg-blue-50 border-l p-4 flex flex-col overflow-y-auto">
//           <div className="flex gap-2 mb-4">
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50">
//               Switch to Full Screen
//             </button>
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50">
//               Pause
//             </button>
//           </div>
          
//           <div className="flex items-center mb-4 p-3 bg-white rounded-lg">
//             <img 
//               src={userInfo?.profile || "https://i.pravatar.cc/40"} 
//               alt="User" 
//               className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
//             />
//             <span className="font-semibold text-gray-800">{userInfo?.name || 'Student'}</span>
//           </div>

//           <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
//             <h4 className="font-bold text-gray-800 mb-3">Test: {testInfo.title}</h4>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div>Duration: <span className="font-semibold">{testInfo.time} minutes</span></div>
//               <div>Negative Marking: <span className="font-semibold">{testInfo.negative_mark}</span></div>
//               <div>Total Questions: <span className="font-semibold">{questions.length}</span></div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-xs mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-green-500 rounded"></div>
//               <span>Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-purple-500 rounded"></div>
//               <span>Marked</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-red-500 rounded"></div>
//               <span>Not Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-white border-2 rounded"></div>
//               <span>Not Visited</span>
//             </div>
//           </div>

//           <div className="flex-1 border-t pt-4">
//             <div className="mb-4">
//               <p className="font-bold text-sm mb-2">
//                 {hasSections ? `SECTION: ${activeSection}` : 'ALL QUESTIONS'}
//               </p>
//               <p className="text-xs text-gray-600">{currentSectionQuestions.length} Questions</p>
//             </div>

//             <div className="grid grid-cols-5 gap-2 mb-4">
//               {currentSectionQuestions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(q.id)}
//                   className={`w-11 h-11 flex items-center justify-center border-2 rounded-lg text-sm font-semibold transition-all ${getStatusColor(q.id)} ${
//                     q.id === currentQuestion?.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             {hasSections && (
//               <div className="bg-white p-4 rounded-lg text-xs shadow-sm">
//                 <h5 className="font-bold text-sm mb-3">Section Summary</h5>
//                 {sectionCounts.map(section => (
//                   <div key={section.section} className="mb-3 pb-3 border-b last:border-b-0">
//                     <div className="font-semibold text-gray-800 mb-1">{section.section}</div>
//                     <div className="text-gray-600 space-y-1">
//                       <div>Answered: <span className="font-semibold text-green-600">{section.answered}/{section.total}</span></div>
//                       <div>Not Answered: <span className="font-semibold text-red-600">{section.notAnswered}</span></div>
//                       <div>Marked: <span className="font-semibold text-purple-600">{section.marked}</span></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium">
//               Question Paper
//             </button>
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium">
//               Instructions
//             </button>
//             <button 
//               onClick={handleSubmit}
//               className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold mt-2 shadow-md"
//             >
//               Submit Test
//             </button>
//           </div>
//         </aside>
//       </div>

//       {/* Footer */}
//       <footer className="flex items-center justify-between p-4 bg-white border-t shadow-lg">
//         <div className="flex gap-3">
//           <button 
//             onClick={handleMarkForReview} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Mark for Review & Next
//           </button>
//           <button 
//             onClick={handleClearResponse} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Clear Response
//           </button>
//         </div>
//         <button 
//           onClick={handleSaveAndNext} 
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-md"
//         >
//           Save & Next
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default RRBTestPage;



// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { 
//   getSingleCategoryPackageTestseriesQuestionSlice,
//   attendQuestionSubmitSlice 
// } from '../../redux/HomeSlice';
// import {
//   secureSaveTestData,
//   secureGetTestData,
//   clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import MathRenderer from '../../utils/MathRenderer';

// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();
  
//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
//   const testId = state?.testInfo?.test_id;
  
//   // ✅ States
//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60);
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
  
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());

//   // ✅ Load User Data
//   useEffect(() => {
//     const loadUserData = async () => {
//       const user = await getUserDataDecrypted();
//       setUserInfo(user);
//     };
//     loadUserData();
//   }, []);

//   // ✅ Restore Test Data
//   useEffect(() => {
//     const restoreTestData = async () => {
//       if (!testId) return;

//       const [
//         storedOptions,
//         storedAttempted,
//         storedMarked,
//         storedSkipped,
//         storedMarkedWithAns,
//       ] = await Promise.all([
//         secureGetTestData(testId, "selectedOptions"),
//         secureGetTestData(testId, "optionSelected"),
//         secureGetTestData(testId, "markedForReview"),
//         secureGetTestData(testId, "skippedQuestions"),
//         secureGetTestData(testId, "marked_with_ans"),
//       ]);

//       if (storedOptions) setSelectedOptions(storedOptions);
//       if (storedAttempted) setOptionSelected(storedAttempted);
//       if (storedMarked) setMarkedForReview(storedMarked);
//       if (storedSkipped) setSkippedQuestions(storedSkipped);
//       if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//     };

//     restoreTestData();
//   }, [testId]);

//   // ✅ Fetch Questions - All in One Track
//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(
//         getSingleCategoryPackageTestseriesQuestionSlice(testId)
//       ).unwrap();
      
//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         const formattedQuestions = res.data.map((question, index) => ({
//           id: question.id,
//           questionNumber: index + 1,
//           section: question.subject_name || 'General',
//           text: question.question_hindi,
//           options: [
//             question.option_hindi_a,
//             question.option_hindi_b,
//             question.option_hindi_c,
//             question.option_hindi_d
//           ],
//           correctAnswer: question.hindi_ans,
//           explanation: question.explanation,
//           status: 'notVisited',
//           userAnswer: null,
//         }));
        
//         setQuestions(formattedQuestions);
//         console.log('✅ Total Questions loaded:', formattedQuestions.length);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (testId) {
//       getTestSeriesQuestion();
//     }
//   }, [testId]);

//   // ✅ Save Test Data
//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "selectedOptions", selectedOptions);
//   }, [selectedOptions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "optionSelected", optionSelected);
//   }, [optionSelected, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "markedForReview", markedForReview);
//   }, [markedForReview, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//   }, [skippedQuestions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//   }, [markedWithAns, testId]);

//   // ✅ Timer
//   useEffect(() => {
//     if (timeLeft <= 0 || loading) {
//       if (timeLeft <= 0) handleSubmit();
//       return;
//     }
    
//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);
    
//     return () => clearInterval(timerId);
//   }, [timeLeft, loading]);

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   // ✅ Update Question Start Time
//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [activeQuestionIndex]);

//   // ✅ Update Spent Time
//   const updateSpentTime = async (questionId) => {
//     const now = Date.now();
//     const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
    
//     let existing = await secureGetTestData(testId, 'spentTime');
//     existing = existing || [];

//     const updated = (() => {
//       const found = existing.find(item => item.questionId === questionId);
//       if (found) {
//         return existing.map(item =>
//           item.questionId === questionId
//             ? { ...item, time: item.time + timeSpentOnQuestion }
//             : item
//         );
//       } else {
//         return [...existing, { questionId, time: timeSpentOnQuestion }];
//       }
//     })();

//     await secureSaveTestData(testId, 'spentTime', updated);
//   };

//   // ✅ Handle Option Select
//   const handleOptionSelect = async (option) => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updated = { ...selectedOptions, [currentId]: option };
//     setSelectedOptions(updated);
//     await secureSaveTestData(testId, 'selectedOptions', updated);

//     const newQuestions = [...questions];
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     setQuestions(newQuestions);

//     if (markedForReview.includes(currentId)) {
//       if (!markedWithAns.includes(currentId)) {
//         const updatedMarkedWithAns = [...markedWithAns, currentId];
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//       }
//     }

//     if (skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }
//   };

//   // ✅ Handle Save And Next
//   const handleSaveAndNext = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];
//     const isAlreadySelected = optionSelected.includes(currentId);

//     if (isOptionSelected && !isAlreadySelected) {
//       const updatedSelected = [...optionSelected, currentId];
//       setOptionSelected(updatedSelected);
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'answered';
//     setQuestions(newQuestions);

//     // ✅ Go to next question (loop back to start if at end)
//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };

//   // ✅ Handle Mark For Review
//   const handleMarkForReview = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];

//     if (isOptionSelected && !markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = [...markedWithAns, currentId];
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!isOptionSelected && !markedForReview.includes(currentId)) {
//       const updatedMarked = [...markedForReview, currentId];
//       setMarkedForReview(updatedMarked);
//       await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);

//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };

//   // ✅ Handle Clear Response
//   const handleClearResponse = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
    
//     const updatedSelectedOptions = { ...selectedOptions };
//     delete updatedSelectedOptions[currentId];
//     setSelectedOptions(updatedSelectedOptions);
//     await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//     if (markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };

//   // ✅ Handle Palette Click
//   const handlePaletteClick = (questionIndex) => {
//     setActiveQuestionIndex(questionIndex);
    
//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };

//   // ✅ Handle Submit
//   // const handleSubmit = async () => {
//   //   const currentId = questions[activeQuestionIndex]?.id;
//   //   await updateSpentTime(currentId);

//   //   if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//   //     const updatedSelected = [...optionSelected, currentId];
//   //     await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//   //   }

//   //   const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//   //   const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//   //   const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//   //   const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//   //   const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
    
//   //   const totalAttendedQuestions = optionSelected2.length;
//   //   const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

//   //   let correct = 0;
//   //   let in_correct = 0;

//   //   const allAttendedQuestions = optionSelected2.map((questionId) => {
//   //     const question = questions.find(q => q.id === questionId);
//   //     const selectedAns = selectedOptions2[questionId];
//   //     const rightAns = question?.correctAnswer;

//   //     if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//   //       correct++;
//   //     } else {
//   //       in_correct++;
//   //     }

//   //     return {
//   //       question_id: questionId,
//   //       user_selected_ans: selectedAns,
//   //       right_ans: rightAns
//   //     };
//   //   });

//   //   const negativeMark = parseFloat(testInfo.negative_mark || 0);
//   //   const statMark = parseFloat(testDetail[0]?.marks || 0);
//   //   const markPer_ques = statMark / questions.length;
//   //   const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//   //   const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//   //   const submissionData = {
//   //     test_id: testId,
//   //     total_attend_question: totalAttendedQuestions,
//   //     total_not_answer_question: totalNotAnsweredQuestions,
//   //     correct,
//   //     in_correct,
//   //     marks: marksScored,
//   //     time: totalTimeSpent,
//   //     negative_mark: negativeMark,
//   //     all_attend_question: allAttendedQuestions,
//   //     spent_time: spentTime,
//   //     skip_question: skippedQuestions2,
//   //     attend_question: optionSelected2,
//   //     mark_for_review: markedForReview2
//   //   };

//   //   try {
//   //     const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//   //     if (res.status_code == 200) {
//   //       await clearAllTestData(testId);
//   //       navigate('/analysis', { replace: true, state });
//   //     }
//   //   } catch (error) {
//   //     console.error("Error submitting test:", error);
//   //   }
//   // };

//   // ✅ Complete Handle Submit with Section-wise Analytics
// const handleSubmit = async () => {
//   const currentId = questions[activeQuestionIndex]?.id;
//   await updateSpentTime(currentId);

//   if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//     const updatedSelected = [...optionSelected, currentId];
//     await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//   }

//   const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//   const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//   const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//   const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//   const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
  
//   const totalAttendedQuestions = optionSelected2.length;
//   const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

//   let correct = 0;
//   let in_correct = 0;

//   const allAttendedQuestions = optionSelected2.map((questionId) => {
//     const question = questions.find(q => q.id === questionId);
//     const selectedAns = selectedOptions2[questionId];
//     const rightAns = question?.correctAnswer;

//     if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//       correct++;
//     } else {
//       in_correct++;
//     }

//     return {
//       question_id: questionId,
//       user_selected_ans: selectedAns,
//       right_ans: rightAns,
//       section: question?.section,
//       question_number: question?.questionNumber,
//     };
//   });

//   // ✅ Section-wise Statistics
//   const sectionWiseStats = {};
//   const uniqueSections = [...new Set(questions.map(q => q.section))];

//   uniqueSections.forEach(section => {
//     const sectionQuestions = questions.filter(q => q.section === section);
//     const sectionAttended = allAttendedQuestions.filter(q => q.section === section);
    
//     const sectionCorrect = sectionAttended.filter(q => 
//       q.user_selected_ans && q.right_ans && 
//       q.user_selected_ans.toLowerCase() === q.right_ans.toLowerCase()
//     ).length;
    
//     const sectionIncorrect = sectionAttended.filter(q => 
//       q.user_selected_ans && q.right_ans && 
//       q.user_selected_ans.toLowerCase() !== q.right_ans.toLowerCase()
//     ).length;

//     const sectionSkipped = skippedQuestions2.filter(qId => {
//       const question = questions.find(q => q.id === qId);
//       return question?.section === section;
//     }).length;

//     const sectionMarked = markedForReview2.filter(qId => {
//       const question = questions.find(q => q.id === qId);
//       return question?.section === section;
//     }).length;

//     const negativeMark = parseFloat(testInfo.negative_mark || 0);
//     const statMark = parseFloat(testDetail[0]?.marks || 0);
//     const markPer_ques = statMark / questions.length;
//     const sectionMarks = (sectionCorrect * markPer_ques) - (sectionIncorrect * negativeMark);

//     const sectionAccuracy = sectionAttended.length > 0 
//       ? ((sectionCorrect / sectionAttended.length) * 100).toFixed(2)
//       : 0;

//     const sectionTimeSpent = spentTime
//       .filter(item => {
//         const question = questions.find(q => q.id === item.questionId);
//         return question?.section === section;
//       })
//       .reduce((acc, item) => acc + (item.time || 0), 0);

//     const avgTimePerQuestion = sectionAttended.length > 0
//       ? (sectionTimeSpent / sectionAttended.length).toFixed(2)
//       : 0;

//     sectionWiseStats[section] = {
//       section_name: section,
//       total_questions: sectionQuestions.length,
//       attempted: sectionAttended.length,
//       correct: sectionCorrect,
//       incorrect: sectionIncorrect,
//       skipped: sectionSkipped,
//       marked: sectionMarked,
//       not_attempted: sectionQuestions.length - sectionAttended.length,
//       marks_scored: parseFloat(sectionMarks.toFixed(2)),
//       accuracy: parseFloat(sectionAccuracy),
//       time_spent: sectionTimeSpent,
//       avg_time_per_question: parseFloat(avgTimePerQuestion),
//       questions: sectionQuestions.map(q => ({
//         id: q.id,
//         question_number: q.questionNumber,
//         text: q.text.substring(0, 100) + '...', // Preview
//         is_attempted: optionSelected2.includes(q.id),
//         is_correct: optionSelected2.includes(q.id) && 
//                    selectedOptions2[q.id]?.toLowerCase() === q.correctAnswer?.toLowerCase(),
//         user_answer: selectedOptions2[q.id] || null,
//         correct_answer: q.correctAnswer,
//       }))
//     };
//   });

//   const negativeMark = parseFloat(testInfo.negative_mark || 0);
//   const statMark = parseFloat(testDetail[0]?.marks || 0);
//   const markPer_ques = statMark / questions.length;
//   const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//   const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//   const overallAccuracy = totalAttendedQuestions > 0 
//     ? ((correct / totalAttendedQuestions) * 100).toFixed(2)
//     : 0;

//   const avgTimePerQuestion = totalAttendedQuestions > 0
//     ? (totalTimeSpent / totalAttendedQuestions).toFixed(2)
//     : 0;

//   const submissionData = {
//     test_id: testId,
//     total_attend_question: totalAttendedQuestions,
//     total_not_answer_question: totalNotAnsweredQuestions,
//     correct,
//     in_correct,
//     marks: parseFloat(marksScored.toFixed(2)),
//     time: totalTimeSpent,
//     negative_mark: negativeMark,
//     accuracy: parseFloat(overallAccuracy),
//     avg_time_per_question: parseFloat(avgTimePerQuestion),
//     all_attend_question: allAttendedQuestions,
//     spent_time: spentTime,
//     skip_question: skippedQuestions2,
//     attend_question: optionSelected2,
//     mark_for_review: markedForReview2,
//     section_wise_stats: Object.values(sectionWiseStats),
//     total_sections: uniqueSections.length,
//   };

//   console.log('📊 Complete Submission Data:', submissionData);
//   console.log('📈 Section-wise Breakdown:', sectionWiseStats);

//   try {
//     const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//     if (res.status_code == 200) {
//       await clearAllTestData(testId);
      
//       navigate('/analysis', { 
//         replace: true, 
//         state: {
//           ...state,
//           testResults: submissionData,
//           sectionWiseStats: Object.values(sectionWiseStats),
//           allQuestions: questions,
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Error submitting test:", error);
//   }
// };


//   // ✅ Get Status Color
//   const getStatusColor = (questionId) => {
//     if (optionSelected.includes(questionId)) return 'bg-green-500 text-white';
//     if (markedForReview.includes(questionId)) return 'bg-purple-500 text-white';
//     if (skippedQuestions.includes(questionId)) return 'bg-red-500 text-white';
//     return 'bg-white text-gray-700 border-gray-300';
//   };

//   // ✅ Loading State
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ No Questions State
//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="text-xl font-semibold text-gray-700 mb-2">No questions available</div>
//           <button 
//             onClick={() => navigate(-1)}
//             className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       {/* Header */}
//       <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-gray-600">
//             Time Left: <span className="font-bold text-red-600 text-lg">{formatTime(timeLeft)}</span>
//           </span>
//           <button 
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
//           >
//             ✕
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Main Content */}
//         <main className="flex-1 p-8 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-6">
//                 <p className="text-lg font-bold text-gray-800">
//                   Question No. {currentQuestion.questionNumber}
//                 </p>
//                 <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
//                   Section: {currentQuestion.section}
//                 </p>
//               </div>
              
//               <p className="text-gray-800 text-lg mb-8 leading-relaxed">
//                 {/* {currentQuestion.text} */}
//                 <MathRenderer text={currentQuestion.text} />
//               </p>
              
//               <div className="space-y-3">
//                 {currentQuestion.options.map((option, index) => (
//                   <label 
//                     key={index} 
//                     className={`flex items-start cursor-pointer p-4 border-2 rounded-xl transition-all ${
//                       selectedOptions[currentQuestion.id] === option
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={selectedOptions[currentQuestion.id] === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mt-1 mr-3 w-4 h-4"
//                     />
//                     <div className="flex-1">
//                       <span className="font-bold text-gray-700 mr-2">
//                         {String.fromCharCode(65 + index)}.
//                       </span>
//                       <span className="text-gray-800 " > <MathRenderer text={option} />  </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>

//         {/* Right Sidebar */}
//         <aside className="w-80 bg-blue-50 border-l p-4 flex flex-col overflow-y-auto">
//           <div className="flex gap-2 mb-4">
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
//               Switch to Full Screen
//             </button>
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
//               Pause
//             </button>
//           </div>
          
//           <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
//             <img 
//               src={userInfo?.profile || "https://i.pravatar.cc/40"} 
//               alt="User" 
//               className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
//             />
//             <span className="font-semibold text-gray-800">{userInfo?.name || 'Student'}</span>
//           </div>

//           <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
//             <h4 className="font-bold text-gray-800 mb-3">Test: {testInfo.title}</h4>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div>Duration: <span className="font-semibold text-gray-800">{testInfo.time} minutes</span></div>
//               <div>Negative Marking: <span className="font-semibold text-gray-800">{testInfo.negative_mark}</span></div>
//               <div>Total Questions: <span className="font-semibold text-gray-800">{questions.length}</span></div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-xs mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-green-500 rounded"></div>
//               <span>Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-purple-500 rounded"></div>
//               <span>Marked</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-red-500 rounded"></div>
//               <span>Not Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-white border-2 rounded"></div>
//               <span>Not Visited</span>
//             </div>
//           </div>

//           <div className="flex-1 border-t border-gray-300 pt-4">
//             <div className="mb-4">
//               <p className="font-bold text-sm mb-2">ALL QUESTIONS</p>
//               <p className="text-xs text-gray-600">{questions.length} Questions</p>
//             </div>

//             {/* ✅ All Questions Palette */}
//             <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto">
//               {questions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(index)}
//                   className={`w-11 h-11 flex items-center justify-center border-2 rounded-lg text-sm font-semibold transition-all ${getStatusColor(q.id)} ${
//                     index === activeQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             {/* ✅ Summary */}
//             <div className="bg-white p-4 rounded-lg text-xs shadow-sm">
//               <h5 className="font-bold text-sm mb-3">Summary</h5>
//               <div className="space-y-2 text-gray-600">
//                 <div className="flex justify-between">
//                   <span>Total Questions:</span>
//                   <span className="font-semibold text-gray-800">{questions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Answered:</span>
//                   <span className="font-semibold text-green-600">{optionSelected.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Answered:</span>
//                   <span className="font-semibold text-red-600">{skippedQuestions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Marked for Review:</span>
//                   <span className="font-semibold text-purple-600">{markedForReview.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Visited:</span>
//                   <span className="font-semibold text-gray-600">
//                     {questions.length - optionSelected.length - skippedQuestions.length - markedForReview.length}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Question Paper
//             </button>
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Instructions
//             </button>
//             <button 
//               onClick={handleSubmit}
//               className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold mt-2 shadow-md transition-colors"
//             >
//               Submit Test
//             </button>
//           </div>
//         </aside>
//       </div>

//       {/* Footer */}
//       <footer className="flex items-center justify-between p-4 bg-white border-t shadow-lg">
//         <div className="flex gap-3">
//           <button 
//             onClick={handleMarkForReview} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Mark for Review & Next
//           </button>
//           <button 
//             onClick={handleClearResponse} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Clear Response
//           </button>
//         </div>
//         <button 
//           onClick={handleSaveAndNext} 
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-md"
//         >
//           Save & Next
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default RRBTestPage;





// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { 
//   getSingleCategoryPackageTestseriesQuestionSlice,
//   attendQuestionSubmitSlice 
// } from '../../redux/HomeSlice';
// import {
//   secureSaveTestData,
//   secureGetTestData,
//   clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import MathRenderer from '../../utils/MathRenderer';

// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();
  
//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
//   const testId = state?.testInfo?.test_id;
  
//   // ✅ All States
//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60);
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());

//   // ✅ Load User Data
//   useEffect(() => {
//     const loadUserData = async () => {
//       const user = await getUserDataDecrypted();
//       setUserInfo(user);
//     };
//     loadUserData();
//   }, []);

//   // ✅ Restore Test Data
//   useEffect(() => {
//     const restoreTestData = async () => {
//       if (!testId) return;

//       const [
//         storedOptions,
//         storedAttempted,
//         storedMarked,
//         storedSkipped,
//         storedMarkedWithAns,
//       ] = await Promise.all([
//         secureGetTestData(testId, "selectedOptions"),
//         secureGetTestData(testId, "optionSelected"),
//         secureGetTestData(testId, "markedForReview"),
//         secureGetTestData(testId, "skippedQuestions"),
//         secureGetTestData(testId, "marked_with_ans"),
//       ]);

//       if (storedOptions) setSelectedOptions(storedOptions);
//       if (storedAttempted) setOptionSelected(storedAttempted);
//       if (storedMarked) setMarkedForReview(storedMarked);
//       if (storedSkipped) setSkippedQuestions(storedSkipped);
//       if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//     };

//     restoreTestData();
//   }, [testId]);

//   // ✅ Fetch Questions
//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(
//         getSingleCategoryPackageTestseriesQuestionSlice(testId)
//       ).unwrap();
      
//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         const formattedQuestions = res.data.map((question, index) => ({
//           id: question.id,
//           questionNumber: index + 1,
//           section: question.subject_name || 'General',
//           text: question.question_hindi,
//           options: [
//             question.option_hindi_a,
//             question.option_hindi_b,
//             question.option_hindi_c,
//             question.option_hindi_d
//           ],
//           correctAnswer: question.hindi_ans,
//           explanation: question.explanation,
//           status: 'notVisited',
//           userAnswer: null,
//         }));
        
//         setQuestions(formattedQuestions);
//         console.log('✅ Total Questions loaded:', formattedQuestions.length);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (testId) {
//       getTestSeriesQuestion();
//     }
//   }, [testId]);

//   // ✅ Save Test Data to Encrypted Storage
//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "selectedOptions", selectedOptions);
//   }, [selectedOptions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "optionSelected", optionSelected);
//   }, [optionSelected, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "markedForReview", markedForReview);
//   }, [markedForReview, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//   }, [skippedQuestions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//   }, [markedWithAns, testId]);

//   // ✅ Timer Effect
//   useEffect(() => {
//     if (timeLeft <= 0 || loading) {
//       if (timeLeft <= 0) handleSubmitTest();
//       return;
//     }
    
//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);
    
//     return () => clearInterval(timerId);
//   }, [timeLeft, loading]);

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   // ✅ Update Question Start Time
//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [activeQuestionIndex]);

//   // ✅ Update Spent Time
//   const updateSpentTime = async (questionId) => {
//     const now = Date.now();
//     const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
    
//     let existing = await secureGetTestData(testId, 'spentTime');
//     existing = existing || [];

//     const updated = (() => {
//       const found = existing.find(item => item.questionId === questionId);
//       if (found) {
//         return existing.map(item =>
//           item.questionId === questionId
//             ? { ...item, time: item.time + timeSpentOnQuestion }
//             : item
//         );
//       } else {
//         return [...existing, { questionId, time: timeSpentOnQuestion }];
//       }
//     })();

//     await secureSaveTestData(testId, 'spentTime', updated);
//   };

//   // ✅ Handle Option Select
//   const handleOptionSelect = async (option) => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updated = { ...selectedOptions, [currentId]: option };
//     setSelectedOptions(updated);
//     await secureSaveTestData(testId, 'selectedOptions', updated);

//     const newQuestions = [...questions];
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     setQuestions(newQuestions);

//     if (markedForReview.includes(currentId)) {
//       if (!markedWithAns.includes(currentId)) {
//         const updatedMarkedWithAns = [...markedWithAns, currentId];
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//       }
//     }

//     if (skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }
//   };

//   // ✅ Handle Save And Next
//   const handleSaveAndNext = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];
//     const isAlreadySelected = optionSelected.includes(currentId);

//     if (isOptionSelected && !isAlreadySelected) {
//       const updatedSelected = [...optionSelected, currentId];
//       setOptionSelected(updatedSelected);
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'answered';
//     setQuestions(newQuestions);

//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };

//   // ✅ Handle Mark For Review
//   const handleMarkForReview = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];

//     if (isOptionSelected && !markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = [...markedWithAns, currentId];
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!isOptionSelected && !markedForReview.includes(currentId)) {
//       const updatedMarked = [...markedForReview, currentId];
//       setMarkedForReview(updatedMarked);
//       await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);

//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };

//   // ✅ Handle Clear Response
//   const handleClearResponse = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
    
//     const updatedSelectedOptions = { ...selectedOptions };
//     delete updatedSelectedOptions[currentId];
//     setSelectedOptions(updatedSelectedOptions);
//     await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//     if (markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };

//   // ✅ Handle Palette Click
//   const handlePaletteClick = (questionIndex) => {
//     setActiveQuestionIndex(questionIndex);
    
//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };

//   // ✅ Show Submit Confirmation
//   const handleSubmitClick = () => {
//     setShowSubmitModal(true);
//   };

//   // ✅ Cancel Submit
//   const handleCancelSubmit = () => {
//     setShowSubmitModal(false);
//   };

//   // ✅ Confirm and Submit Test with Section-wise Data
//   const handleSubmitTest = async () => {
//     setShowSubmitModal(false);
//     setIsSubmitting(true);

//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//       const updatedSelected = [...optionSelected, currentId];
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
    
//     const totalAttendedQuestions = optionSelected2.length;
//     const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

//     let correct = 0;
//     let in_correct = 0;

//     const allAttendedQuestions = optionSelected2.map((questionId) => {
//       const question = questions.find(q => q.id === questionId);
//       const selectedAns = selectedOptions2[questionId];
//       const rightAns = question?.correctAnswer;

//       if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//         correct++;
//       } else {
//         in_correct++;
//       }

//       return {
//         question_id: questionId,
//         user_selected_ans: selectedAns,
//         right_ans: rightAns,
//         section: question?.section,
//         question_number: question?.questionNumber,
//       };
//     });

//     // ✅ Calculate Section-wise Statistics
//     const sectionWiseStats = {};
//     const uniqueSections = [...new Set(questions.map(q => q.section))];

//     uniqueSections.forEach(section => {
//       const sectionQuestions = questions.filter(q => q.section === section);
//       const sectionAttended = allAttendedQuestions.filter(q => q.section === section);
      
//       const sectionCorrect = sectionAttended.filter(q => 
//         q.user_selected_ans && q.right_ans && 
//         q.user_selected_ans.toLowerCase() === q.right_ans.toLowerCase()
//       ).length;
      
//       const sectionIncorrect = sectionAttended.filter(q => 
//         q.user_selected_ans && q.right_ans && 
//         q.user_selected_ans.toLowerCase() !== q.right_ans.toLowerCase()
//       ).length;

//       const sectionSkipped = skippedQuestions2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === section;
//       }).length;

//       const sectionMarked = markedForReview2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === section;
//       }).length;

//       const negativeMark = parseFloat(testInfo.negative_mark || 0);
//       const statMark = parseFloat(testDetail[0]?.marks || 0);
//       const markPer_ques = statMark / questions.length;
//       const sectionMarks = (sectionCorrect * markPer_ques) - (sectionIncorrect * negativeMark);

//       const sectionAccuracy = sectionAttended.length > 0 
//         ? ((sectionCorrect / sectionAttended.length) * 100).toFixed(2)
//         : 0;

//       const sectionTimeSpent = spentTime
//         .filter(item => {
//           const question = questions.find(q => q.id === item.questionId);
//           return question?.section === section;
//         })
//         .reduce((acc, item) => acc + (item.time || 0), 0);

//       const avgTimePerQuestion = sectionAttended.length > 0
//         ? (sectionTimeSpent / sectionAttended.length).toFixed(2)
//         : 0;

//       sectionWiseStats[section] = {
//         section_name: section,
//         total_questions: sectionQuestions.length,
//         attempted: sectionAttended.length,
//         correct: sectionCorrect,
//         incorrect: sectionIncorrect,
//         skipped: sectionSkipped,
//         marked: sectionMarked,
//         not_attempted: sectionQuestions.length - sectionAttended.length,
//         marks_scored: parseFloat(sectionMarks.toFixed(2)),
//         accuracy: parseFloat(sectionAccuracy),
//         time_spent: sectionTimeSpent,
//         avg_time_per_question: parseFloat(avgTimePerQuestion),
//       };
//     });

//     const negativeMark = parseFloat(testInfo.negative_mark || 0);
//     const statMark = parseFloat(testDetail[0]?.marks || 0);
//     const markPer_ques = statMark / questions.length;
//     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     const overallAccuracy = totalAttendedQuestions > 0 
//       ? ((correct / totalAttendedQuestions) * 100).toFixed(2)
//       : 0;

//     const avgTimePerQuestion = totalAttendedQuestions > 0
//       ? (totalTimeSpent / totalAttendedQuestions).toFixed(2)
//       : 0;

//     const submissionData = {
//       test_id: testId,
//       total_attend_question: totalAttendedQuestions,
//       total_not_answer_question: totalNotAnsweredQuestions,
//       correct,
//       in_correct,
//       marks: parseFloat(marksScored.toFixed(2)),
//       time: totalTimeSpent,
//       negative_mark: negativeMark,
//       accuracy: parseFloat(overallAccuracy),
//       avg_time_per_question: parseFloat(avgTimePerQuestion),
//       all_attend_question: allAttendedQuestions,
//       spent_time: spentTime,
//       skip_question: skippedQuestions2,
//       attend_question: optionSelected2,
//       mark_for_review: markedForReview2,
//       section_wise_stats: Object.values(sectionWiseStats),
//       total_sections: uniqueSections.length,
//     };

//     console.log('📊 Complete Submission Data:', submissionData);
//     console.log('📈 Section-wise Breakdown:', sectionWiseStats);

//     try {
//       const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//       if (res.status_code == 200) {
//         await clearAllTestData(testId);
        
//         navigate('/analysis', { 
//           replace: true, 
//           state: {
//             ...state,
//             testResults: submissionData,
//             sectionWiseStats: Object.values(sectionWiseStats),
//             allQuestions: questions,
//           }
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting test:", error);
//       setIsSubmitting(false);
//     }
//   };

//   // ✅ Get Status Color
//   const getStatusColor = (questionId) => {
//     if (optionSelected.includes(questionId)) return 'bg-green-500 text-white';
//     if (markedForReview.includes(questionId)) return 'bg-purple-500 text-white';
//     if (skippedQuestions.includes(questionId)) return 'bg-red-500 text-white';
//     return 'bg-white text-gray-700 border-gray-300';
//   };

//   // ✅ Loading State
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ No Questions State
//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="text-xl font-semibold text-gray-700 mb-2">No questions available</div>
//           <button 
//             onClick={() => navigate(-1)}
//             className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       {/* Header */}
//       <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-gray-600">
//             Time Left: <span className="font-bold text-red-600 text-lg">{formatTime(timeLeft)}</span>
//           </span>
//           <button 
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
//           >
//             ✕
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Main Content */}
//         <main className="flex-1 p-8 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-6">
//                 <p className="text-lg font-bold text-gray-800">
//                   Question No. {currentQuestion.questionNumber}
//                 </p>
//                 <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
//                   Section: {currentQuestion.section}
//                 </p>
//               </div>
              
//               <div className="text-gray-800 text-lg mb-8 leading-relaxed">
//                 <MathRenderer text={currentQuestion.text} />
//               </div>
              
//               <div className="space-y-3">
//                 {currentQuestion.options.map((option, index) => (
//                   <label 
//                     key={index} 
//                     className={`flex items-start cursor-pointer p-4 border-2 rounded-xl transition-all ${
//                       selectedOptions[currentQuestion.id] === option
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={selectedOptions[currentQuestion.id] === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mt-1 mr-3 w-4 h-4"
//                     />
//                     <div className="flex-1">
//                       <span className="font-bold text-gray-700 mr-2">
//                         {String.fromCharCode(65 + index)}.
//                       </span>
//                       <span className="text-gray-800">
//                         <MathRenderer text={option} />
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>

//         {/* Right Sidebar */}
//         <aside className="w-80 bg-blue-50 border-l p-4 flex flex-col overflow-y-auto">
//           <div className="flex gap-2 mb-4">
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
//               Switch to Full Screen
//             </button>
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
//               Pause
//             </button>
//           </div>
          
//           <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
//             <img 
//               src={userInfo?.profile || "https://i.pravatar.cc/40"} 
//               alt="User" 
//               className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
//             />
//             <span className="font-semibold text-gray-800">{userInfo?.name || 'Student'}</span>
//           </div>

//           <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
//             <h4 className="font-bold text-gray-800 mb-3">Test: {testInfo.title}</h4>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div>Duration: <span className="font-semibold text-gray-800">{testInfo.time} minutes</span></div>
//               <div>Negative Marking: <span className="font-semibold text-gray-800">{testInfo.negative_mark}</span></div>
//               <div>Total Questions: <span className="font-semibold text-gray-800">{questions.length}</span></div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-xs mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-green-500 rounded"></div>
//               <span>Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-purple-500 rounded"></div>
//               <span>Marked</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-red-500 rounded"></div>
//               <span>Not Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-white border-2 rounded"></div>
//               <span>Not Visited</span>
//             </div>
//           </div>

//           <div className="flex-1 border-t border-gray-300 pt-4">
//             <div className="mb-4">
//               <p className="font-bold text-sm mb-2">ALL QUESTIONS</p>
//               <p className="text-xs text-gray-600">{questions.length} Questions</p>
//             </div>

//             <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto">
//               {questions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(index)}
//                   className={`w-11 h-11 flex items-center justify-center border-2 rounded-lg text-sm font-semibold transition-all ${getStatusColor(q.id)} ${
//                     index === activeQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <div className="bg-white p-4 rounded-lg text-xs shadow-sm">
//               <h5 className="font-bold text-sm mb-3">Summary</h5>
//               <div className="space-y-2 text-gray-600">
//                 <div className="flex justify-between">
//                   <span>Total Questions:</span>
//                   <span className="font-semibold text-gray-800">{questions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Answered:</span>
//                   <span className="font-semibold text-green-600">{optionSelected.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Answered:</span>
//                   <span className="font-semibold text-red-600">{skippedQuestions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Marked for Review:</span>
//                   <span className="font-semibold text-purple-600">{markedForReview.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Visited:</span>
//                   <span className="font-semibold text-gray-600">
//                     {questions.length - optionSelected.length - skippedQuestions.length - markedForReview.length}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Question Paper
//             </button>
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Instructions
//             </button>
//             <button 
//               onClick={handleSubmitClick}
//               disabled={isSubmitting}
//               className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold mt-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit Test'}
//             </button>
//           </div>
//         </aside>
//       </div>

//       {/* Footer */}
//       <footer className="flex items-center justify-between p-4 bg-white border-t shadow-lg">
//         <div className="flex gap-3">
//           <button 
//             onClick={handleMarkForReview} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Mark for Review & Next
//           </button>
//           <button 
//             onClick={handleClearResponse} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Clear Response
//           </button>
//         </div>
//         <button 
//           onClick={handleSaveAndNext} 
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-md"
//         >
//           Save & Next
//         </button>
//       </footer>

//       {/* ✅ Submit Confirmation Modal */}
//       {showSubmitModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Test?</h3>
//             <p className="text-gray-600 mb-2">
//               You have answered <span className="font-bold text-green-600">{optionSelected.length}</span> out of <span className="font-bold">{questions.length}</span> questions.
//             </p>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to submit the test?
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleCancelSubmit}
//                 className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitTest}
//                 className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
//               >
//                 Yes, Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RRBTestPage;




import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  getSingleCategoryPackageTestseriesQuestionSlice,
  attendQuestionSubmitSlice 
} from '../../redux/HomeSlice';
import {
  secureSaveTestData,
  secureGetTestData,
  clearAllTestData,
} from '../../helpers/testStorage';
import { getUserDataDecrypted } from '../../helpers/userStorage';
import MathRenderer from '../../utils/MathRenderer';

const RRBTestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const testInfo = state?.testInfo || {};
  const testDetail = state?.testDetail || [];
  const testId = state?.testInfo?.test_id;
  
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedOptions, setSelectedOptions] = useState({});
  const [optionSelected, setOptionSelected] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [markedWithAns, setMarkedWithAns] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    const loadUserData = async () => {
      const user = await getUserDataDecrypted();
      setUserInfo(user);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const restoreTestData = async () => {
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

    restoreTestData();
  }, [testId]);

  const getTestSeriesQuestion = async () => {
    try {
      setLoading(true);
      const res = await dispatch(
        getSingleCategoryPackageTestseriesQuestionSlice(testId)
      ).unwrap();
      
      if (res.status_code === 200 && res.data && res.data.length > 0) {
        const formattedQuestions = res.data.map((question, index) => ({
          id: question.id,
          questionNumber: index + 1,
          section: question.subject_name || 'General',
          text: question.question_hindi,
          options: [
            question.option_hindi_a,
            question.option_hindi_b,
            question.option_hindi_c,
            question.option_hindi_d
          ],
          correctAnswer: question.hindi_ans,
          explanation: question.explanation,
          status: 'notVisited',
          userAnswer: null,
        }));
        
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testId) {
      getTestSeriesQuestion();
    }
  }, [testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "selectedOptions", selectedOptions);
  }, [selectedOptions, testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "optionSelected", optionSelected);
  }, [optionSelected, testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "markedForReview", markedForReview);
  }, [markedForReview, testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
  }, [skippedQuestions, testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "marked_with_ans", markedWithAns);
  }, [markedWithAns, testId]);

  useEffect(() => {
    if (timeLeft <= 0 || loading) {
      if (timeLeft <= 0) handleSubmitTest();
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft, loading]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [activeQuestionIndex]);

  const updateSpentTime = async (questionId) => {
    const now = Date.now();
    const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
    
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

  const handleOptionSelect = async (option) => {
    const currentId = questions[activeQuestionIndex]?.id;
    const updated = { ...selectedOptions, [currentId]: option };
    setSelectedOptions(updated);
    await secureSaveTestData(testId, 'selectedOptions', updated);

    const newQuestions = [...questions];
    if (newQuestions[activeQuestionIndex].status === 'notVisited') {
      newQuestions[activeQuestionIndex].status = 'notAnswered';
    }
    newQuestions[activeQuestionIndex].userAnswer = option;
    setQuestions(newQuestions);

    if (markedForReview.includes(currentId)) {
      if (!markedWithAns.includes(currentId)) {
        const updatedMarkedWithAns = [...markedWithAns, currentId];
        setMarkedWithAns(updatedMarkedWithAns);
        await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
      }
    }

    if (skippedQuestions.includes(currentId)) {
      const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
      setSkippedQuestions(updatedSkipped);
      await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
    }
  };

  const handleSaveAndNext = async () => {
    const currentId = questions[activeQuestionIndex]?.id;
    await updateSpentTime(currentId);

    const isOptionSelected = !!selectedOptions[currentId];
    const isAlreadySelected = optionSelected.includes(currentId);

    if (isOptionSelected && !isAlreadySelected) {
      const updatedSelected = [...optionSelected, currentId];
      setOptionSelected(updatedSelected);
      await secureSaveTestData(testId, 'optionSelected', updatedSelected);
    }

    if (isOptionSelected && skippedQuestions.includes(currentId)) {
      const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
      setSkippedQuestions(updatedSkipped);
      await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
    }

    // ✅ Add to skipped if not answered
    if (!isOptionSelected && !skippedQuestions.includes(currentId)) {
      const updatedSkipped = [...skippedQuestions, currentId];
      setSkippedQuestions(updatedSkipped);
      await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
    }

    const newQuestions = [...questions];
    newQuestions[activeQuestionIndex].status = isOptionSelected ? 'answered' : 'notAnswered';
    setQuestions(newQuestions);

    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else {
      setActiveQuestionIndex(0);
    }
  };

  const handleMarkForReview = async () => {
    const currentId = questions[activeQuestionIndex]?.id;
    await updateSpentTime(currentId);

    const isOptionSelected = !!selectedOptions[currentId];

    if (isOptionSelected && !markedWithAns.includes(currentId)) {
      const updatedMarkedWithAns = [...markedWithAns, currentId];
      setMarkedWithAns(updatedMarkedWithAns);
      await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
    }

    if (!isOptionSelected && !markedForReview.includes(currentId)) {
      const updatedMarked = [...markedForReview, currentId];
      setMarkedForReview(updatedMarked);
      await secureSaveTestData(testId, 'markedForReview', updatedMarked);
    }

    const newQuestions = [...questions];
    newQuestions[activeQuestionIndex].status = 'marked';
    setQuestions(newQuestions);

    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else {
      setActiveQuestionIndex(0);
    }
  };

  const handleClearResponse = async () => {
    const currentId = questions[activeQuestionIndex]?.id;
    
    const updatedSelectedOptions = { ...selectedOptions };
    delete updatedSelectedOptions[currentId];
    setSelectedOptions(updatedSelectedOptions);
    await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

    if (markedWithAns.includes(currentId)) {
      const updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
      setMarkedWithAns(updatedMarkedWithAns);
      await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
    }

    if (!skippedQuestions.includes(currentId)) {
      const updatedSkipped = [...skippedQuestions, currentId];
      setSkippedQuestions(updatedSkipped);
      await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
    }

    const newQuestions = [...questions];
    newQuestions[activeQuestionIndex].userAnswer = null;
    newQuestions[activeQuestionIndex].status = 'notAnswered';
    setQuestions(newQuestions);
  };

  const handlePaletteClick = (questionIndex) => {
    setActiveQuestionIndex(questionIndex);
    
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].status === 'notVisited') {
      newQuestions[questionIndex].status = 'notAnswered';
    }
    setQuestions(newQuestions);
  };

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleCancelSubmit = () => {
    setShowSubmitModal(false);
  };

  // ✅ Fixed Submit Function - Simplified for API
  // const handleSubmitTest = async () => {
  //   setShowSubmitModal(false);
  //   setIsSubmitting(true);

  //   const currentId = questions[activeQuestionIndex]?.id;
  //   await updateSpentTime(currentId);

  //   if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
  //     const updatedSelected = [...optionSelected, currentId];
  //     await secureSaveTestData(testId, 'optionSelected', updatedSelected);
  //   }

  //   const spentTime = await secureGetTestData(testId, 'spentTime') || [];
  //   const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
  //   const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
  //   const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
  //   const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
    
  //   const totalAttendedQuestions = optionSelected2.length;
  //   const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

  //   let correct = 0;
  //   let in_correct = 0;

  //   // ✅ Simplified attended questions array
  //   const allAttendedQuestions = optionSelected2.map((questionId) => {
  //     const question = questions.find(q => q.id === questionId);
  //     const selectedAns = selectedOptions2[questionId];
  //     const rightAns = question?.correctAnswer;

  //     if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
  //       correct++;
  //     } else {
  //       in_correct++;
  //     }

  //     return {
  //       question_id: questionId,
  //       user_selected_ans: selectedAns,
  //       right_ans: rightAns
  //     };
  //   });

  //   const negativeMark = parseFloat(testInfo.negative_mark || 0);
  //   const statMark = parseFloat(testDetail[0]?.marks || 0);
  //   const markPer_ques = statMark / questions.length;
  //   const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
  //   const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

  //   // ✅ Simplified submission data - matching SSC format
  //   const submissionData = {
  //     test_id: testId,
  //     total_attend_question: totalAttendedQuestions,
  //     total_not_answer_question: totalNotAnsweredQuestions,
  //     correct: correct,
  //     in_correct: in_correct,
  //     marks: parseFloat(marksScored.toFixed(2)),
  //     time: totalTimeSpent,
  //     negative_mark: negativeMark,
  //     all_attend_question: allAttendedQuestions,
  //     spent_time: spentTime,
  //     skip_question: skippedQuestions2,
  //     attend_question: optionSelected2,
  //     mark_for_review: markedForReview2
  //   };

  //   console.log('📊 Submission Data:', submissionData);

  //   try {
  //     // const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
      
  //     // console.log('✅ API Response:', res);
      
  //     // if (res.status_code == 200) {
  //     //   await clearAllTestData(testId);
        
  //     //   navigate('/analysis', { 
  //     //     replace: true, 
  //     //     state: {
  //     //       ...state,
  //     //       testResults: submissionData,
  //     //       allQuestions: questions,
  //     //     }
  //     //   });
  //     // }
  //        const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
  //       if (res.status_code == 200) {
  //           await clearAllTestData(testId);
  //           nav('/analysis', { replace: true, state });
  //       }
  //     else {
  //       console.error('❌ API Error:', res);
  //       setIsSubmitting(false);
  //       alert(`Error: ${res.message || 'Failed to submit test'}`);
  //     }
  //   } catch (error) {
  //     console.error("❌ Submit Error:", error);
  //     setIsSubmitting(false);
  //     alert('Failed to submit test. Please try again.');
  //   }
  // };

  // ✅ Complete Submit Function with Section-wise Data
const handleSubmitTest = async () => {
  setShowSubmitModal(false);
  setIsSubmitting(true);

  const currentId = questions[activeQuestionIndex]?.id;
  await updateSpentTime(currentId);

  if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
    const updatedSelected = [...optionSelected, currentId];
    await secureSaveTestData(testId, 'optionSelected', updatedSelected);
  }

  const spentTime = await secureGetTestData(testId, 'spentTime') || [];
  const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
  const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
  const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
  const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
  
  const totalAttendedQuestions = optionSelected2.length;
  const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

  let correct = 0;
  let in_correct = 0;

  const allAttendedQuestions = optionSelected2.map((questionId) => {
    const question = questions.find(q => q.id === questionId);
    const selectedAns = selectedOptions2[questionId];
    const rightAns = question?.correctAnswer;

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

  const negativeMark = parseFloat(testInfo.negative_mark || 0);
  const statMark = parseFloat(testDetail[0]?.marks || 0);
  const markPer_ques = statMark / questions.length;
  const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
  const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

  // ✅ Calculate Section-wise Statistics
  const sectionWiseStats = testDetail.map(detail => {
    const sectionQuestions = questions.filter(q => q.section === detail.subject_name);
    const sectionAttended = optionSelected2.filter(qId => {
      const question = questions.find(q => q.id === qId);
      return question?.section === detail.subject_name;
    });

    const sectionCorrect = sectionAttended.filter(qId => {
      const question = questions.find(q => q.id === qId);
      const selectedAns = selectedOptions2[qId];
      const rightAns = question?.correctAnswer;
      return selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase();
    }).length;

    const sectionIncorrect = sectionAttended.length - sectionCorrect;

    const sectionSkipped = skippedQuestions2.filter(qId => {
      const question = questions.find(q => q.id === qId);
      return question?.section === detail.subject_name;
    }).length;

    const sectionMarked = markedForReview2.filter(qId => {
      const question = questions.find(q => q.id === qId);
      return question?.section === detail.subject_name;
    }).length;

    const sectionMarkPer_ques = parseFloat(detail.marks) / detail.no_of_question;
    const sectionMarks = (sectionCorrect * sectionMarkPer_ques) - (sectionIncorrect * parseFloat(detail.negative_mark));

    const sectionAccuracy = sectionAttended.length > 0 
      ? ((sectionCorrect / sectionAttended.length) * 100).toFixed(2)
      : 0;

    const sectionTimeSpent = spentTime
      .filter(item => {
        const question = questions.find(q => q.id === item.questionId);
        return question?.section === detail.subject_name;
      })
      .reduce((acc, item) => acc + (item.time || 0), 0);

    const avgTimePerQuestion = sectionAttended.length > 0
      ? (sectionTimeSpent / sectionAttended.length).toFixed(2)
      : 0;

    return {
      subject_name: detail.subject_name,
      chapter_name: detail.chapter_name,
      total_questions: detail.no_of_question,
      marks: detail.marks,
      negative_mark: detail.negative_mark,
      sectional_time: detail.sectional_time,
      attempted: sectionAttended.length,
      correct: sectionCorrect,
      incorrect: sectionIncorrect,
      skipped: sectionSkipped,
      marked: sectionMarked,
      not_attempted: detail.no_of_question - sectionAttended.length,
      marks_scored: parseFloat(sectionMarks.toFixed(2)),
      accuracy: parseFloat(sectionAccuracy),
      time_spent: sectionTimeSpent,
      avg_time_per_question: parseFloat(avgTimePerQuestion),
    };
  });

  const submissionData = {
    test_id: testId,
    total_attend_question: totalAttendedQuestions,
    total_not_answer_question: totalNotAnsweredQuestions,
    correct: correct,
    in_correct: in_correct,
    marks: parseFloat(marksScored.toFixed(2)),
    time: totalTimeSpent,
    negative_mark: negativeMark,
    all_attend_question: allAttendedQuestions,
    spent_time: spentTime,
    skip_question: skippedQuestions2,
    attend_question: optionSelected2,
    mark_for_review: markedForReview2
  };

  console.log('📊 Submission Data:', submissionData);
  console.log('📈 Section-wise Stats:', sectionWiseStats);

  try {
    const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
    
    console.log('✅ API Response:', res);
    
    if (res.status_code == 200) {
      await clearAllTestData(testId);
      
      // ✅ Send complete data to analysis screen
      navigate('/analysis', { 
        replace: true, 
        state: {
          ...state, // Includes userData, testInfo, testId, testDetail
          testResults: submissionData,
          sectionWiseStats: sectionWiseStats, // ✅ Section-wise breakdown
          allQuestions: questions,
        }
      });
    } else {
      console.error('❌ API Error:', res);
      setIsSubmitting(false);
      alert(`Error: ${res.message || 'Failed to submit test'}`);
    }
  } catch (error) {
    console.error("❌ Submit Error:", error);
    setIsSubmitting(false);
    alert('Failed to submit test. Please try again.');
  }
};


  // ✅ Fixed Color Function - Red for not answered/skipped
  const getStatusColor = (questionId) => {
    if (optionSelected.includes(questionId)) return 'bg-green-500 text-white';
    if (markedForReview.includes(questionId) || markedWithAns.includes(questionId)) return 'bg-purple-500 text-white';
    if (skippedQuestions.includes(questionId)) return 'bg-red-500 text-white';
    return 'bg-white text-gray-700 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700 mb-2">No questions available</div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[activeQuestionIndex];

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Time Left: <span className="font-bold text-red-600 text-lg">{formatTime(timeLeft)}</span>
          </span>
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-8 overflow-y-auto bg-white">
          {currentQuestion && (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg font-bold text-gray-800">
                  Question No. {currentQuestion.questionNumber}
                </p>
                <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  Section: {currentQuestion.section}
                </p>
              </div>
              
              <div className="text-gray-800 text-lg mb-8 leading-relaxed">
                <MathRenderer text={currentQuestion.text} />
              </div>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label 
                    key={index} 
                    className={`flex items-start cursor-pointer p-4 border-2 rounded-xl transition-all ${
                      selectedOptions[currentQuestion.id] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={selectedOptions[currentQuestion.id] === option}
                      onChange={() => handleOptionSelect(option)}
                      className="mt-1 mr-3 w-4 h-4"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-gray-700 mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-gray-800">
                        <MathRenderer text={option} />
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </main>

        <aside className="w-80 bg-blue-50 border-l p-4 flex flex-col overflow-y-auto">
          <div className="flex gap-2 mb-4">
            <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              Switch to Full Screen
            </button>
            <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              Pause
            </button>
          </div>
          
          <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
            <img 
              src={userInfo?.profile || "https://i.pravatar.cc/40"} 
              alt="User" 
              className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
            />
            <span className="font-semibold text-gray-800">{userInfo?.name || 'Student'}</span>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-3">Test: {testInfo.title}</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Duration: <span className="font-semibold text-gray-800">{testInfo.time} minutes</span></div>
              <div>Negative Marking: <span className="font-semibold text-gray-800">{testInfo.negative_mark}</span></div>
              <div>Total Questions: <span className="font-semibold text-gray-800">{questions.length}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Marked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 rounded"></div>
              <span>Not Visited</span>
            </div>
          </div>

          <div className="flex-1 border-t border-gray-300 pt-4">
            <div className="mb-4">
              <p className="font-bold text-sm mb-2">ALL QUESTIONS</p>
              <p className="text-xs text-gray-600">{questions.length} Questions</p>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => handlePaletteClick(index)}
                  className={`w-11 h-11 flex items-center justify-center border-2 rounded-lg text-sm font-semibold transition-all ${getStatusColor(q.id)} ${
                    index === activeQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="bg-white p-4 rounded-lg text-xs shadow-sm">
              <h5 className="font-bold text-sm mb-3">Summary</h5>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-semibold text-gray-800">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-semibold text-green-600">{optionSelected.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Not Answered:</span>
                  <span className="font-semibold text-red-600">{skippedQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Marked for Review:</span>
                  <span className="font-semibold text-purple-600">{markedForReview.length + markedWithAns.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Not Visited:</span>
                  <span className="font-semibold text-gray-600">
                    {questions.length - optionSelected.length - skippedQuestions.length - markedForReview.length - markedWithAns.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
              Question Paper
            </button>
            <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
              Instructions
            </button>
            <button 
              onClick={handleSubmitClick}
              disabled={isSubmitting}
              className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold mt-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </button>
          </div>
        </aside>
      </div>

      <footer className="flex items-center justify-between p-4 bg-white border-t shadow-lg">
        <div className="flex gap-3">
          <button 
            onClick={handleMarkForReview} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
          >
            Mark for Review & Next
          </button>
          <button 
            onClick={handleClearResponse} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
          >
            Clear Response
          </button>
        </div>
        <button 
          onClick={handleSaveAndNext} 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-md"
        >
          Save & Next
        </button>
      </footer>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Test?</h3>
            <p className="text-gray-600 mb-2">
              You have answered <span className="font-bold text-green-600">{optionSelected.length}</span> out of <span className="font-bold">{questions.length}</span> questions.
            </p>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit the test?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelSubmit}
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RRBTestPage;
