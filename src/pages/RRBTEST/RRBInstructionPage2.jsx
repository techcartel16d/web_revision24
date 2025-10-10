import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RRBInstructionPage2 = () => {
  const [isDeclared, setIsDeclared] = useState(false);
  const { state } = useLocation();
  // console.log("STATE ===>", state);
  const nav = useNavigate();

  // Extract test information from state
  const testInfo = state?.testInfo || {};
  const testDetail = state?.testDetail || [];
  
  // Calculate total questions and marks
  const totalQuestions = testDetail.reduce((total, subject) => total + parseInt(subject.no_of_question || 0), 0);
  const totalMarks = testDetail.reduce((total, subject) => total + parseInt(subject.marks || 0), 0);
  
  // Convert negative marking fraction to decimal
  const negativeMarkDecimal = testInfo.negative_mark === "1/3" ? "0.33" : "0.25";

  return (
    <div className="bg-white min-h-screen font-sans text-gray-700">
      {/* Header */}
      <header className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-500">Revision24</span>
          <span className="ml-4 text-gray-600">{testInfo.title || 'Test Information'}</span>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-grow p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              {testInfo.title || 'Test Information'}
            </h1>
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-semibold">Duration: {testInfo.time || 90} Mins</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Maximum Marks: {totalMarks || 120}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-bold mb-3 text-gray-800">Read the following instructions carefully.</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>The test contains {totalQuestions || 120} total questions.</li>
              <li>Each question has 4 options out of which only one is correct.</li>
              <li>You have to finish the test in {testInfo.time || 90} minutes.</li>
              <li>Try not to guess the answer as there is negative marking.</li>
              <li>You will be awarded 1 mark for each correct answer and {negativeMarkDecimal} will be deducted for each wrong answer.</li>
              <li>There is no negative marking for the questions that you have not attempted.</li>
              <li>You can write this test only once. Make sure that you complete the test before you submit the test and/or close the browser.</li>
            </ol>
          </div>

          {/* Subject-wise breakdown */}
          {testDetail.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3 text-gray-800">Subject-wise Distribution:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {testDetail.map((subject, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                      <span className="font-medium text-gray-700">{subject.subject_name}</span>
                      <span className="text-blue-600 font-semibold">
                        {subject.no_of_question} Questions ({subject.marks} Marks)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <hr className="my-8" />

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <label htmlFor="language" className="font-semibold">Choose your default language:</label>
              <select id="language" name="language" className="border border-gray-300 rounded-md p-1">
                <option>-- Select --</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <p className="text-red-500 text-xs">Please note all questions will appear in your default language. This language can be changed for a particular question later on.</p>

            <div>
              <p className="font-semibold">Declaration:</p>
              <div className="flex items-start mt-2">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={isDeclared}
                  onChange={() => setIsDeclared(!isDeclared)}
                  className="mt-1 mr-2 h-4 w-4"
                />
                <label htmlFor="declaration" className="text-sm text-gray-600">
                  I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone else's advantage will lead to my immediate disqualification. The decision of Revision24.com will be final in these matters and cannot be appealed.
                </label>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 bg-gray-50 border-l border-gray-200 p-8 flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/100" // Placeholder image
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <p className="mt-4 font-semibold text-lg">Rajat</p>
          
          {/* Test Summary Card */}
          <div className="mt-6 w-full bg-white rounded-lg shadow-sm border p-4">
            <h4 className="font-semibold text-gray-800 mb-3 text-center">Test Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Questions:</span>
                <span className="font-medium">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{testInfo.time} mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Marks:</span>
                <span className="font-medium">{totalMarks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Negative Marking:</span>
                <span className="font-medium text-red-600">-{negativeMarkDecimal}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-200 flex justify-between items-center fixed bottom-0 w-full bg-white">
        <button
          disabled
          className="px-4 py-2 bg-gray-200 text-gray-400 rounded-md cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => nav('/online-exam', { state })}
          disabled={!isDeclared}
          className={`px-4 py-2 rounded-md font-semibold ${
            isDeclared
              ? 'bg-cyan-400 text-white hover:bg-cyan-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          I am ready to begin
        </button>
      </footer>
    </div>
  );
};

export default RRBInstructionPage2;
