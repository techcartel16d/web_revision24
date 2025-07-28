import React, { useEffect, useState } from 'react';

const QuestionGridModal = ({
    question = [],
    groupedQuestions = [],
    currentQuestion = 0,
    optionSelected = [],
    markedForReview = [],
    skippedQuestions = [],
    markedForReviewAns = [],
    setCurrentQuestion = () => { },
    onClose = () => { },
    onProceed = () => { }
}) => {
    const [selectedPartIndex, setSelectedPartIndex] = useState(0);
    const [userChangedPart, setUserChangedPart] = useState(false); // 👈 track manual tab change
    // console.log("markedForReviewAns", markedForReviewAns)
    // 🔁 Auto update selectedPartIndex when currentQuestion changes
    useEffect(() => {
        if (!userChangedPart) {
            let accumulated = 0;
            for (let i = 0; i < groupedQuestions.length; i++) {
                const groupLength = groupedQuestions[i].questions.length;
                if (currentQuestion < accumulated + groupLength) {
                    setSelectedPartIndex(i);
                    break;
                }
                accumulated += groupLength;
            }
        }
    }, [currentQuestion, groupedQuestions, userChangedPart]);

    const selectedGroup = groupedQuestions[selectedPartIndex] || { questions: [], subject_name: '' };

    return (
        // <div className="flex w-1/5 justify-center overflow-hidden">
        //     <div className="bg-gray-50 rounded shadow-lg flex flex-col w-full">
        //         {/* Header */}
        //         <div className="flex justify-between items-center p-4">
        //             <h2 className="text-black font-bold text-lg">
        //                 {selectedGroup.subject_name || 'Subject'}
        //             </h2>
        //         </div>

        //         {/* Top PART Tabs */}
        //         <div className="flex flex-wrap gap-2 px-4 pb-2">
        //             {groupedQuestions.map((group, index) => (
        //                 <button
        //                     key={index}
        //                     className={`px-3 py-1 text-xs font-semibold rounded ${selectedPartIndex === index
        //                         ? 'bg-blue-600 text-white'
        //                         : 'bg-gray-700 text-white'
        //                         }`}
        //                     onClick={() => {
        //                         setSelectedPartIndex(index);
        //                         setUserChangedPart(true); // 👈 user manually changed part
        //                     }}
        //                 >
        //                     PART-{String.fromCharCode(65 + index)}
        //                 </button>
        //             ))}
        //         </div>

        //         {/* Question Grid */}
        //         <div className="flex-1 p-4 overflow-y-auto">
        //             <div className="text-black font-semibold mb-2">
        //                 PART-{String.fromCharCode(65 + selectedPartIndex)} - {selectedGroup.subject_name}
        //             </div>

        //             <div className="flex flex-wrap gap-2">
        //                 {selectedGroup.questions.map((q, qIndex) => {
        //                     const globalIndex = groupedQuestions
        //                         .slice(0, selectedPartIndex)
        //                         .reduce((acc, g) => acc + g.questions.length, 0) + qIndex;

        //                     const isMarked = markedForReview.includes(q.id);
        //                     const isMarkedAns = markedForReviewAns.includes(q.id)
        //                     const isSelected = optionSelected.includes(q.id);
        //                     const isSkipped = skippedQuestions.includes(q.id);

        //                     let bg = 'bg-blue-500'; // default = not attempted
        //                     if (isSelected) bg = 'bg-green-600';
        //                     if (isMarkedAns) bg = 'bg-yellow-500 border-2 border-green-500';
        //                     else if (isMarked) bg = 'bg-red-400';
        //                     else if (isSkipped) bg = 'bg-red-600';

        //                     return (
        //                         <button
        //                             key={q.id}
        //                             className={`w-10 h-10 text-xs rounded text-white font-bold ${bg} border-2 ${currentQuestion === globalIndex ? "border-slate-700" : "border-none"}`}
        //                             onClick={() => {
        //                                 setCurrentQuestion(globalIndex);
        //                                 setUserChangedPart(false); // 👈 allow auto part switch
        //                             }}
        //                         >
        //                             {globalIndex + 1}
        //                         </button>
        //                     );
        //                 })}
        //             </div>

        //             {/* Legend */}
        //             <div className="mt-6 text-black w-full max-w-md">
        //                 <div className="grid grid-cols-2 gap-y-3 text-sm">
        //                     <div className="flex items-center gap-2">
        //                         <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
        //                         <span>Attempted</span>
        //                     </div>
        //                     <div className="text-right">({optionSelected.length})</div>

        //                     <div className="flex items-center gap-2">
        //                         <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
        //                         <span>Marked with Answer</span>
        //                     </div>
        //                     <div className="text-right">({markedForReviewAns.length})</div>

        //                     <div className="flex items-center gap-2">
        //                         <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
        //                         <span>Marked without Answer</span>
        //                     </div>
        //                     <div className="text-right">({markedForReview.length})</div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className="flex w-full md:w-full lg:w-1/5 justify-center overflow-hidden px-2 md:px-4">
            <div className="bg-gray-50 rounded shadow-lg flex flex-col w-full max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <h2 className="text-black font-bold text-lg truncate">
                        {selectedGroup.subject_name || 'Subject'}
                    </h2>
                    {/* <button
                        className="text-sm text-gray-500 hover:text-black"
                        onClick={onClose}
                    >
                        ✕
                    </button> */}
                </div>

                {/* Top PART Tabs */}
                <div className="flex flex-wrap gap-2 px-4 pb-2 pt-2 overflow-x-auto">
                    {groupedQuestions.map((group, index) => (
                        <button
                            key={index}
                            className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${selectedPartIndex === index
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-white'
                                }`}
                            onClick={() => {
                                setSelectedPartIndex(index);
                                setUserChangedPart(true);
                            }}
                        >
                            PART-{String.fromCharCode(65 + index)}
                        </button>
                    ))}
                </div>

                {/* Question Grid */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="text-black font-semibold mb-2 text-sm">
                        PART-{String.fromCharCode(65 + selectedPartIndex)} - {selectedGroup.subject_name}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {selectedGroup.questions.map((q, qIndex) => {
                            const globalIndex = groupedQuestions
                                .slice(0, selectedPartIndex)
                                .reduce((acc, g) => acc + g.questions.length, 0) + qIndex;

                            const isMarked = markedForReview.includes(q.id);
                            const isMarkedAns = markedForReviewAns.includes(q.id);
                            const isSelected = optionSelected.includes(q.id);
                            const isSkipped = skippedQuestions.includes(q.id);

                            let bg = 'bg-blue-500';
                            if (isSelected) bg = 'bg-green-600';
                            if (isMarkedAns) bg = 'bg-yellow-500 border-2 border-green-500';
                            else if (isMarked) bg = 'bg-red-400';
                            // else if (isSkipped) bg = 'bg-red-600';

                            return (
                                <button
                                    key={q.id}
                                    className={`w-10 h-10 text-xs rounded text-white font-bold ${bg} border-2 ${currentQuestion === globalIndex ? 'border-slate-700' : 'border-transparent'
                                        }`}
                                    onClick={() => {
                                        setCurrentQuestion(globalIndex);
                                        setUserChangedPart(false);
                                    }}
                                >
                                    {globalIndex + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 text-black w-full max-w-md text-sm">
                        <div className="grid grid-cols-2 gap-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                                <span>Attempted</span>
                            </div>
                            <div className="text-right">({optionSelected.length})</div>

                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                                <span>Marked with Answer</span>
                            </div>
                            <div className="text-right">({markedForReviewAns.length})</div>

                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
                                <span>Marked without Answer</span>
                            </div>
                            <div className="text-right">({markedForReview.length})</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Buttons (optional) */}
                {/* <div className="p-4 border-t border-gray-300 flex justify-end">
                    <button
                        onClick={onProceed}
                        className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                    >
                        Proceed
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default QuestionGridModal;
