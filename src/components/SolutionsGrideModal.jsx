import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const SolutionsGrideModal = ({
    wrongQuestion = [],
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
        //     <div className="bg-gray-900 rounded shadow-lg flex flex-col w-full">
        //         {/* Header */}
        //         <div className="flex justify-between items-center p-4">
        //             <h2 className="text-white font-bold text-lg">
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
        //             <div className="text-white font-semibold mb-2">
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

        //                     let bg = 'bg-blue-400'; // default = not attempted
        //                     if (isSelected) bg = 'bg-green-600';
        //                     if (isMarkedAns) bg = 'bg-yellow-300 border-2 border-green-500';
        //                     else if (isMarked) bg = 'bg-red-400';
        //                     else if (isSkipped) bg = 'bg-red-600';

        //                     return (
        //                         <button
        //                             key={q.id}
        //                             className={`w-10 h-10 text-xs rounded text-white font-bold ${bg} border ${currentQuestion === globalIndex ? "border-white" : "border-none"}`}
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
        //             <div className="mt-6 text-white w-full max-w-md">
        //                 <div className="grid grid-cols-2 gap-y-3 text-sm">
        //                     <div className="flex items-center gap-2">
        //                         <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
        //                         <span>Attempted</span>
        //                     </div>
        //                     <div className="text-right">({optionSelected.length})</div>

        //                     <div className="flex items-center gap-2">
        //                         <div className="w-4 h-4 bg-yellow-300 rounded-sm"></div>
        //                         <span>Wrong Answer</span>
        //                     </div>
        //                     <div className="text-right">({wrongQuestion.length})</div>

        //                     <div className="flex items-center gap-2">
        //                         <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
        //                         <span>Right Question</span>
        //                     </div>
        //                     <div className="text-right">({optionSelected.length - wrongQuestion.length})</div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="w-full md:w-1/1 lg:w-1/5 px-2 md:px-0 mb-4 md:mb-0">
            <div className="bg-slate-100 rounded shadow-lg flex flex-col w-full h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-slate-600 font-bold text-lg">
                        {selectedGroup.subject_name || 'Subject'}
                    </h2>
                </div>

                {/* Top PART Tabs */}
                <div className="flex flex-wrap gap-2 px-4 pb-2">
                    {groupedQuestions.map((group, index) => (
                        <button
                            key={index}
                            className={`px-3 py-1 text-xs font-semibold rounded ${selectedPartIndex === index
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-white'
                                }`}
                            onClick={() => {
                                setSelectedPartIndex(index);
                                setUserChangedPart(true); // 👈 user manually changed part
                            }}
                        >
                            PART-{String.fromCharCode(65 + index)}
                        </button>
                    ))}
                </div>

                {/* Question Grid */}
                <div className="flex-1 p-4 overflow-y-auto max-h-[60vh]">
                    <div className="text-slate-800 font-semibold mb-2">
                        PART-{String.fromCharCode(65 + selectedPartIndex)} - {selectedGroup.subject_name}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {selectedGroup.questions.map((q, qIndex) => {
                            const globalIndex = groupedQuestions
                                .slice(0, selectedPartIndex)
                                .reduce((acc, g) => acc + g.questions.length, 0) + qIndex;
                            const wrong = wrongQuestion.includes(q.id)
                            const isMarked = markedForReview.includes(q.id);
                            const isMarkedAns = markedForReviewAns.includes(q.id);
                            const isSelected = optionSelected.includes(q.id);
                            const isSkipped = skippedQuestions.includes(q.id);

                            let bg = 'bg-blue-400'; // default = not attempted
                            if (isSelected) bg = 'bg-green-600';
                            if (isMarkedAns) bg = 'bg-yellow-300 border-2 border-black';
                            else if (isMarked) bg = 'bg-red-400';
                            else if (isSkipped) bg = 'bg-red-600';
                            else if (wrong) bg = "bg-gray-600"

                            return (
                                <button
                                    key={q.id}
                                    className={`w-10 h-10 text-xs rounded text-white font-bold relative ${bg} ${wrong && 'opacity-20'} border-2 ${currentQuestion === globalIndex ? 'border-slate-700' : 'border-none'
                                        }`}
                                    onClick={() => {
                                        setCurrentQuestion(globalIndex);
                                        setUserChangedPart(false); // 👈 allow auto part switch
                                    }}
                                >
                                    {globalIndex + 1}
                                    {
                                        wrong && (
                                            <div className='w-full h-full bg-gray-500' style={{
                                                position: 'absolute',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                top:0,
                                                left:0,
                                            

                                            }}>
                                                <IoMdClose className='text-5xl text-gray-100' />
                                            </div>
                                        )
                                    }

                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 text-slate-800 w-full max-w-md">
                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                                <span>Attempted</span>
                            </div>
                            <div className="text-right">({optionSelected.length})</div>

                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
                                <span>Wrong Answer</span>
                            </div>
                            <div className="text-right">({wrongQuestion.length})</div>

                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                                <span>Right Answer</span>
                            </div>
                            <div className="text-right">({optionSelected.length - wrongQuestion.length})</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default SolutionsGrideModal;
