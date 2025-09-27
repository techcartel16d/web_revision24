import React from 'react';
import { useNavigate } from 'react-router-dom';

// A helper component for the legend icons, styled with Tailwind CSS
const InstructionIcon = ({ bgColor, children }) => (
    <div className={`w-7 h-5 rounded border border-gray-300 flex justify-center items-center ${bgColor}`}>
        {children}
    </div>
);

const RRBInstructionPage = () => {
    const nav = useNavigate();
    return (
        <div className="flex flex-col h-screen bg-white font-sans">
            {/* Header */}
            <header className="px-4 py-2 flex items-center justify-between border-b border-gray-200 bg-gray-50">
                <h1 className="text-xl font-bold text-blue-500">Revision24</h1>
                <p className="text-sm text-gray-600">RRB NTPC CBT 2 (12th Level) Full Test 2</p>
            </header>

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-4">General Instructions:</h2>

                <p className="text-gray-700 leading-relaxed mb-3">1. The clock will be set at the server. The countdown timer at the top right corner of the screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You need not terminate the examination or submit your paper.</p>

                <p className="text-gray-700 leading-relaxed mb-4">2. The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</p>

                {/* Legend for Question Status */}
                <div className="space-y-3 mb-4 ml-2">
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-gray-200" />
                        <span className="ml-4 text-sm text-gray-700">You have not visited the question yet.</span>
                    </div>
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-[#E74C3C]" />
                        <span className="ml-4 text-sm text-gray-700">You have not answered the question.</span>
                    </div>
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-[#2ECC71]" />
                        <span className="ml-4 text-sm text-gray-700">You have answered the question.</span>
                    </div>
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-[#9B59B6]" />
                        <span className="ml-4 text-sm text-gray-700">You have NOT answered the question, but have marked the question for review.</span>
                    </div>
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-[#9B59B6]">
                            <div className="w-2 h-2 rounded-full bg-[#2ECC71]"></div>
                        </InstructionIcon>
                        <span className="ml-4 text-sm text-gray-700">You have answered the question, but marked it for review.</span>
                    </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">The Mark For Review status for a question simply indicates that you would like to look at that question again. If a question is answered, but marked for review, then the answer will be considered for evaluation unless the status is modified by the candidate.</p>

                {/* Navigating to a Question */}
                <h3 className="text-base font-bold text-gray-800 mt-6 mb-2">Navigating to a Question:</h3>
                <p className="text-gray-700 leading-relaxed mb-3">3. To answer a question, do the following:</p>
                <div className="ml-5 space-y-3">
                    <p className="text-gray-700 leading-relaxed">1. Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</p>
                    <p className="text-gray-700 leading-relaxed">2. Click on <span className="font-bold">Save & Next</span> to save your answer for the current question and then go to the next question.</p>
                    <p className="text-gray-700 leading-relaxed">3. Click on <span className="font-bold">Mark for Review & Next</span> to save your answer for the current question and also mark it for review, and then go to the next question.</p>
                </div>

                {/* Answering a Question */}
                <h3 className="text-base font-bold text-gray-800 mt-6 mb-2">Answering a Question:</h3>
                <p className="text-gray-700 leading-relaxed mb-3">4. Procedure for answering a multiple choice (MCQ) type question:</p>
                <div className="ml-5 space-y-3">
                    <p className="text-gray-700 leading-relaxed">1. Choose one answer from the 4 options (A,B,C,D) given below the question.</p>
                    <p className="text-gray-700 leading-relaxed">2. To deselect your chosen answer, click on the bubble of the chosen option again or click on the <span className="font-bold">Clear Response</span> button.</p>
                    <p className="text-gray-700 leading-relaxed">3. To change your chosen answer, click on the bubble of another option.</p>
                    <p className="text-gray-700 leading-relaxed">4. To save your answer, you MUST click on the <span className="font-bold">Save & Next</span>.</p>
                </div>

                <p className="text-gray-700 leading-relaxed mt-4 mb-3">5. Procedure for answering a numerical answer type question:</p>
                <div className="ml-5 space-y-3">
                    <p className="text-gray-700 leading-relaxed">1. To enter a number as your answer, use the virtual numerical keypad.</p>
                    <p className="text-gray-700 leading-relaxed">2. A fraction (e.g. 0.3 or .3) can be entered as an answer with or without '0' before the decimal point.</p>
                    <p className="text-gray-700 leading-relaxed">3. To clear your answer, click on the <span className="font-bold">Clear Response</span> button.</p>
                    <p className="text-gray-700 leading-relaxed">4. To save your answer, you MUST click on the <span className="font-bold">Save & Next</span>.</p>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 flex items-center justify-between border-t border-gray-200">
                <button className="flex items-center text-blue-500 font-semibold hover:text-blue-600">
                    <span className="mr-2 text-xl">←</span>
                    Go to Tests
                </button>
                <button onClick={() => nav('/rrb-instruction-final')} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 flex items-center">
                    Next
                    <span className="ml-2 text-xl">→</span>
                </button>
            </footer>
        </div>
    );
};

export default RRBInstructionPage;
