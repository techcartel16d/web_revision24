import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getSingleCategoryPackageTestseriesQuestionSlice } from '../../redux/HomeSlice';
import { useLocation } from 'react-router-dom';

const RRBTestPage = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  
  // Extract data from state
  const testInfo = state?.testInfo || {};
  const testDetail = state?.testDetail || [];
  
  // Create sections from testDetail
  const sections = testDetail.map(detail => detail.subject_name);
  
  // Generate questions based on testDetail
  const generateQuestions = () => {
    let questions = [];
    let questionId = 1;
    
    testDetail.forEach((subject, subjectIndex) => {
      const questionCount = parseInt(subject.no_of_question);
      
      for (let i = 0; i < questionCount; i++) {
        questions.push({
          id: questionId++,
          section: subject.subject_name,
          subjectIndex: subjectIndex,
          questionNumber: i + 1,
          text: `Sample question ${i + 1} from ${subject.subject_name}`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          status: 'notVisited',
          userAnswer: null,
        });
      }
    });
    
    return questions;
  };

  const [questions, setQuestions] = useState(generateQuestions());
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(sections[0] || 'General Awareness');
  const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60); // Convert minutes to seconds
  const [loading, setLoading] = useState(false);

  console.log('state rrb test screen', state);

  const getTestSeriesQuestion = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testId || state?.testInfo?.test_id)).unwrap();
      if (res.status_code === 200) {
        console.log("question data fetching", res);
        // Update questions with actual data from API
        if (res.data && res.data.length > 0) {
          const formattedQuestions = res.data.map((question, index) => ({
            id: index + 1,
            section: question.subject_name || sections[0],
            text: question.question_text || `Question ${index + 1}`,
            options: question.options || ['Option A', 'Option B', 'Option C', 'Option D'],
            status: 'notVisited',
            userAnswer: null,
          }));
          setQuestions(formattedQuestions);
        }
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state?.testId || state?.testInfo?.test_id) {
      getTestSeriesQuestion();
    }
  }, [state]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Get questions for current section
  const getCurrentSectionQuestions = () => {
    return questions.filter(q => q.section === activeSection);
  };

  // Get question counts for each section
  const getSectionCounts = () => {
    return sections.map(section => ({
      section,
      total: questions.filter(q => q.section === section).length,
      answered: questions.filter(q => q.section === section && q.status === 'answered').length,
      marked: questions.filter(q => q.section === section && q.status === 'marked').length,
      notAnswered: questions.filter(q => q.section === section && q.status === 'notAnswered').length,
    }));
  };

  // Handlers
  const handleOptionSelect = (option) => {
    const newQuestions = [...questions];
    newQuestions[activeQuestionIndex].userAnswer = option;
    if (newQuestions[activeQuestionIndex].status === 'notVisited') {
      newQuestions[activeQuestionIndex].status = 'notAnswered';
    }
    setQuestions(newQuestions);
  };

  const goToNextQuestion = () => {
    const currentSectionQuestions = getCurrentSectionQuestions();
    const currentIndexInSection = currentSectionQuestions.findIndex(q => q.id === questions[activeQuestionIndex].id);
    
    if (currentIndexInSection < currentSectionQuestions.length - 1) {
      // Go to next question in current section
      const nextQuestionInSection = currentSectionQuestions[currentIndexInSection + 1];
      const nextGlobalIndex = questions.findIndex(q => q.id === nextQuestionInSection.id);
      setActiveQuestionIndex(nextGlobalIndex);
    }
  };

  const handleSaveAndNext = () => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[activeQuestionIndex];
    if (currentQuestion.userAnswer !== null) {
      currentQuestion.status = 'answered';
    } else {
      currentQuestion.status = 'notAnswered';
    }
    setQuestions(newQuestions);
    goToNextQuestion();
  };

  const handleMarkForReview = () => {
    const newQuestions = [...questions];
    newQuestions[activeQuestionIndex].status = 'marked';
    setQuestions(newQuestions);
    goToNextQuestion();
  };

  const handleClearResponse = () => {
    const newQuestions = [...questions];
    newQuestions[activeQuestionIndex].userAnswer = null;
    newQuestions[activeQuestionIndex].status = 'notAnswered';
    setQuestions(newQuestions);
  };

  const handlePaletteClick = (questionId) => {
    const questionIndex = questions.findIndex(q => q.id === questionId);
    setActiveQuestionIndex(questionIndex);
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].status === 'notVisited') {
      newQuestions[questionIndex].status = 'notAnswered';
    }
    setQuestions(newQuestions);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Find first question of the selected section
    const firstQuestionOfSection = questions.find(q => q.section === section);
    if (firstQuestionOfSection) {
      const index = questions.findIndex(q => q.id === firstQuestionOfSection.id);
      setActiveQuestionIndex(index);
    }
  };

  // Get color for palette buttons based on question status
  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white';
      case 'notAnswered': return 'bg-red-500 text-white';
      case 'marked': return 'bg-purple-500 text-white';
      case 'notVisited': return 'bg-white text-gray-700';
      default: return 'bg-white text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions[activeQuestionIndex];
  const currentSectionQuestions = getCurrentSectionQuestions();
  const sectionCounts = getSectionCounts();

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-2 bg-white border-b">
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
          <div className="ml-6 flex items-center border rounded">
            {sections.map(section => (
              <button
                key={section}
                onClick={() => handleSectionChange(section)}
                className={`px-4 py-1.5 text-sm border-r last:border-r-0 ${
                  activeSection === section ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
                }`}
              >
                {section.length > 20 ? `${section.substring(0, 20)}...` : section}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">Time Left: <span className="font-semibold text-gray-800">{formatTime(timeLeft)}</span></span>
          <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600">✕</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-white">
          {currentQuestion && (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-800">Question No. {currentQuestion.id}</p>
                <p className="text-sm text-gray-600">Section: {currentQuestion.section}</p>
              </div>
              <p className="text-gray-700 mb-6">{currentQuestion.text}</p>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={currentQuestion.userAnswer === option}
                      onChange={() => handleOptionSelect(option)}
                      className="mr-3"
                    />
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </label>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-blue-100 border-l p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <button className="text-xs border border-gray-400 px-2 py-1 rounded">Switch to Full Screen</button>
            <button className="text-xs border border-gray-400 px-2 py-1 rounded">Pause</button>
          </div>
          
          <div className="flex items-center mb-4">
            <img src="https://i.pravatar.cc/40" alt="User" className="w-10 h-10 rounded-full mr-3"/>
            <span className="font-semibold">Rajat</span>
          </div>

          {/* Test Info */}
          <div className="bg-white p-3 rounded mb-4 text-sm">
            <h4 className="font-semibold mb-2">Test: {testInfo.title}</h4>
            <div className="space-y-1">
              <div>Duration: {testInfo.time} minutes</div>
              <div>Negative Marking: {testInfo.negative_mark}</div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-1 text-xs mb-4">
            <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div>Answered</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 mr-1"></div>Marked</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1"></div>Not Answered</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-white border mr-1"></div>Not Visited</div>
          </div>

          <div className="flex-1 overflow-y-auto border-t border-blue-200 pt-4">
            <div className="mb-4">
              <p className="font-semibold text-sm mb-2">SECTION: {activeSection}</p>
              <p className="text-xs text-gray-600 mb-3">
                {currentSectionQuestions.length} Questions
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {currentSectionQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handlePaletteClick(q.id)}
                  className={`w-10 h-10 flex items-center justify-center border rounded text-sm ${getStatusColor(q.status)} ${
                    q.id === currentQuestion?.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {q.questionNumber || q.id}
                </button>
              ))}
            </div>

            {/* Section Summary */}
            <div className="bg-white p-3 rounded text-xs">
              <h5 className="font-semibold mb-2">Section Summary</h5>
              {sectionCounts.map(section => (
                <div key={section.section} className="mb-2">
                  <div className="font-medium">{section.section}</div>
                  <div className="text-gray-600">
                    Answered: {section.answered}/{section.total}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-center text-sm">
            <button className="bg-gray-200 py-2 rounded">Question Paper</button>
            <button className="bg-gray-200 py-2 rounded">Instructions</button>
            <button className="col-span-2 bg-blue-500 text-white py-2 rounded mt-2">Submit Test</button>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between p-3 bg-white border-t">
        <div>
          <button onClick={handleMarkForReview} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2">
            Mark for Review & Next
          </button>
          <button onClick={handleClearResponse} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded">
            Clear Response
          </button>
        </div>
        <button onClick={handleSaveAndNext} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded">
          Save & Next
        </button>
      </footer>
    </div>
  );
};

export default RRBTestPage;
