import React from "react";

const ExamInstructionsModal = ({ isOpen, onClose, onAgree, testData = [], testInfo }) => {
  if (!isOpen) return null;

  const subjects = testData || [];
  const totalQuestions = subjects.reduce((sum, s) => sum + parseInt(s.no_of_question || 0), 0);
  const totalMarks = subjects.reduce((sum, s) => sum + parseInt(s.marks || 0), 0);
  const negativeMark = subjects[0]?.negative_mark || testInfo?.negative_mark || '0';
  const duration = testInfo?.time || 60;
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-50 px-4">
      <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold mb-3 text-gray-800">Instructions, Terms & Conditions</h2>

        {/* Section Table */}
        <table className="w-full border border-gray-300 text-sm text-left mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-3 py-2">Section</th>
              <th className="border border-gray-300 px-3 py-2">Subject</th>
              <th className="border border-gray-300 px-3 py-2">Number of Questions</th>
              <th className="border border-gray-300 px-3 py-2">Maximum Marks</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? (

              subjects.map((subject, index) => (
                <tr key={index} className={index % 2 !== 0 ? 'bg-gray-50' : ''}>
                  <td className="border px-3 py-2">PART-{index + 1}</td>
                  <td className="border px-3 py-2">{subject.subject_name}</td>
                  <td className="border px-3 py-2">{subject.no_of_question}</td>
                  <td className="border px-3 py-2">{subject.marks}</td>
                </tr>
              ))

            ) : (
              <tr>
                <td className="border px-3 py-2 text-center" colSpan="4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>



        {/* Exam Overview */}
        <div className="text-sm space-y-4 text-gray-800">
          <p className="font-bold">Exam Overview / परीक्षा का संक्षिप्त विवरण</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Duration: <span className="font-bold text-blue-700">{duration} minutes</span> / समयावधि:{" "}
              <span className="font-bold text-blue-700">{duration} मिनट</span>
            </li>
            <li>
              Total Questions: <span className="font-bold text-blue-700">{totalQuestions}</span> / कुल प्रश्न:{" "}
              <span className="font-bold text-blue-700">{totalQuestions}</span>
            </li>
            <li>
              Negative Marking: {negativeMark} marks deducted / प्रत्येक गलत उत्तर पर{" "}
              <span className="font-bold">{negativeMark}</span> अंक कटेंगे।
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructionsModal;
