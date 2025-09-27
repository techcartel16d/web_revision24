import React, { useState, useEffect } from 'react';

// Mock data for questions
const initialQuestions = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  section: 'General Awareness',
  text: `भारत में किस पंचवर्षीय योजना के तहत, परिवार नियोजन कार्यक्रम का कार्यान्वयन योजना के प्रमुख लक्ष्यों में से एक था? (Question ${i + 1})`,
  options: ['तीसरी', 'पाँचवीं', 'दूसरी', 'चौथी'],
  status: 'notVisited', // can be 'notVisited', 'notAnswered', 'answered', 'marked'
  userAnswer: null,
}));

const RRBTestPage = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('General Awareness');
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds

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
  
  // Handlers
  const handleOptionSelect = (option) => {
    const newQuestions = [...questions];
    newQuestions[activeQuestionIndex].userAnswer = option;
    // If not answered yet, change status to 'notAnswered' until saved
    if (newQuestions[activeQuestionIndex].status === 'notVisited') {
        newQuestions[activeQuestionIndex].status = 'notAnswered';
    }
    setQuestions(newQuestions);
  };
  
  const goToNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
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
  
  const handlePaletteClick = (index) => {
    setActiveQuestionIndex(index);
    const newQuestions = [...questions];
    if (newQuestions[index].status === 'notVisited') {
        newQuestions[index].status = 'notAnswered';
    }
    setQuestions(newQuestions);
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
  
  const currentQuestion = questions[activeQuestionIndex];

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-2 bg-white border-b">
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-500 ml-2">testbook</span>
          <div className="ml-6 flex items-center border rounded">
             {['General Awareness', 'Mathematics', 'General Intelligence'].map(section => (
                <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`px-4 py-1.5 text-sm ${activeSection === section ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                >
                    {section}
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
          <p className="font-semibold text-gray-800 mb-4">Question No. {currentQuestion.id}</p>
          <p className="text-gray-700 mb-6">{currentQuestion.text}</p>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={currentQuestion.userAnswer === option}
                  onChange={() => handleOptionSelect(option)}
                  className="mr-3"
                />
                {option}
              </label>
            ))}
          </div>
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
           
           <div className="grid grid-cols-4 gap-1 text-xs mb-4">
              <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div>Answered</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 mr-1"></div>Marked</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1"></div>Not Answered</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-white border mr-1"></div>Not Visited</div>
           </div>

           <div className="flex-1 overflow-y-auto border-t border-blue-200 pt-4">
             <p className="font-semibold text-sm mb-2">SECTION: {activeSection}</p>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => handlePaletteClick(index)}
                    className={`w-10 h-10 flex items-center justify-center border rounded ${getStatusColor(q.status)} ${index === activeQuestionIndex ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {q.id}
                  </button>
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
          <button onClick={handleMarkForReview} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2">Mark for Review & Next</button>
          <button onClick={handleClearResponse} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded">Clear Response</button>
        </div>
        <button onClick={handleSaveAndNext} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded">Save & Next</button>
      </footer>
    </div>
  );
};

export default RRBTestPage;
