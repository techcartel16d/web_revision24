import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getSingleCategoryPackageTestseriesQuestionSlice } from '../../redux/HomeSlice';
import QuestionGridModal from '../../components/QuestionGridModal';
import TestTimer from '../../components/TestTimer';
import CountdownTimer from '../../components/QuestionTimer';
import Timer from '../../components/QuestionTimer';

// const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct: incorrect,
//             marks: marksScored,
//             time: timeLeft,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: timeSpent,
//             skip_question: skippedQuestions,
//             attend_question: optionSelected,
//             mark_for_review: markedForReview

//         };

const Screen5 = () => {

    const dispatch = useDispatch()
    const { state } = useLocation()
    console.log("state==>", state)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questionsState, setQuestionsState] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState({});
    const [optionSelected, setOptionSelected] = useState(() => JSON.parse(localStorage.getItem("optionSelected")) || []);
    const [markedForReview, setMarkedForReview] = useState(() => JSON.parse(localStorage.getItem("markedForReview")) || []);
    const [skippedQuestions, setSkippedQuestions] = useState(() => JSON.parse(localStorage.getItem("skippedQuestions")) || []);
    const [markedWithAns, setMarkedWithAns] = useState(() => {
        return JSON.parse(localStorage.getItem("marked_with_ans")) || [];
    });
    const [spentTime, setSpentTime] = useState([]);
    const [currentQuestionId, setCurrentQuestionId] = useState(''); // Example
    const [language, setLanguage] = useState('en')
    const getTestSeriesQuestion = async () => {
        // setLoading(true)
        const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.id)).unwrap()
        if (res.status_code == 200) {
            console.log("question data fetching", res)
            setQuestionsState(res.data)
            // setLoading(false)
            // setRefreshing(false)
        } else {
            console.log("response", res)
        }


    }


    // const handleUpdateSpentTime = (questionId, timeSpent) => {
    //     const existing = JSON.parse(localStorage.getItem('spentTime')) || [];

    //     const updated = (() => {
    //         const found = existing.find(item => item.questionId === questionId);
    //         if (found) {
    //             return existing.map(item =>
    //                 item.questionId === questionId ? { ...item, time: timeSpent } : item
    //             );
    //         } else {
    //             return [...existing, { questionId, time: timeSpent }];
    //         }
    //     })();

    //     localStorage.setItem('spentTime', JSON.stringify(updated));
    //     console.log('Saved to localStorage:', updated);
    // };

    // const showData = () => {
    //     const data = JSON.parse(localStorage.getItem('spentTime')) || [];
    //     console.log('Current Data:', data);
    // };

    useEffect(() => {
        getTestSeriesQuestion()
    }, [])

    useEffect(() => {
        const storedOptions = JSON.parse(localStorage.getItem("selectedOptions")) || {};
        const storedAttempted = JSON.parse(localStorage.getItem("optionSelected")) || [];
        const storedMarked = JSON.parse(localStorage.getItem("markedForReview")) || [];
        const storedSkipped = JSON.parse(localStorage.getItem("skippedQuestions")) || [];

        setSelectedOptions(storedOptions);
        setOptionSelected(storedAttempted);
        setMarkedForReview(storedMarked);
        setSkippedQuestions(storedSkipped);
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
        localStorage.setItem("optionSelected", JSON.stringify(optionSelected));
    }, [selectedOptions, optionSelected]);

    useEffect(() => {
        localStorage.setItem("markedForReview", JSON.stringify(markedForReview));
    }, [markedForReview]);

    useEffect(() => {
        localStorage.setItem("skippedQuestions", JSON.stringify(skippedQuestions));
    }, [skippedQuestions]);
    useEffect(() => {
        localStorage.setItem("marked_with_ans", JSON.stringify(markedWithAns));
    }, [markedWithAns]);

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




    const handleOptionChange = (questionId, optionKey) => {
        // Save to selectedOptions (object)
        const updated = { ...selectedOptions, [questionId]: optionKey };
        setSelectedOptions(updated);
        localStorage.setItem("selectedOptions", JSON.stringify(updated));

        // ❌ Don't store in optionSelected array anymore

        // If marked, store in marked_with_ans
        if (markedForReview.includes(questionId)) {
            if (!markedWithAns.includes(questionId)) {
                const updatedMarkedWithAns = [...markedWithAns, questionId];
                setMarkedWithAns(updatedMarkedWithAns);
                localStorage.setItem("marked_with_ans", JSON.stringify(updatedMarkedWithAns));
            }
        }

        // Remove from skipped (optional, logical cleanup)
        if (skippedQuestions.includes(questionId)) {
            const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
            setSkippedQuestions(updatedSkipped);
            localStorage.setItem("skippedQuestions", JSON.stringify(updatedSkipped));
        }
    };





    const handleSaveAndNext = () => {
        const currentId = questionsState[currentQuestion]?.id;
        // console.log("cureent id==>", currentId)
        // setCurrentQuestionId(currentId)
        // ✅ If option is selected, add to optionSelected if not already
        if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
            const updatedSelected = [...optionSelected, currentId];
            setOptionSelected(updatedSelected);
            localStorage.setItem("optionSelected", JSON.stringify(updatedSelected));
        }

        // ✅ Remove from skipped if it was skipped earlier
        if (selectedOptions[currentId] && skippedQuestions.includes(currentId)) {
            const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
            setSkippedQuestions(updatedSkipped);
            localStorage.setItem("skippedQuestions", JSON.stringify(updatedSkipped));
        }

        setCurrentQuestion(prev => prev + 1);
    };

    const handleMarkForReview = () => {
        const currentId = questionsState[currentQuestion]?.id;

        const isOptionSelected = !!selectedOptions[currentId];
        const isAlreadyMarked = markedForReview.includes(currentId);
        const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

        // If option is selected, store only in marked_with_ans
        if (isOptionSelected && !isAlreadyMarkedWithAns) {
            const updatedMarkedWithAns = [...markedWithAns, currentId];
            setMarkedWithAns(updatedMarkedWithAns);
            localStorage.setItem("marked_with_ans", JSON.stringify(updatedMarkedWithAns));
        }

        // If option is not selected, store only in markedForReview
        if (!isOptionSelected && !isAlreadyMarked) {
            const updatedMarked = [...markedForReview, currentId];
            setMarkedForReview(updatedMarked);
            localStorage.setItem("markedForReview", JSON.stringify(updatedMarked));
        }

        setCurrentQuestion(prev => prev + 1);
    };

    const handleNextQuestion = () => {
        const currentId = questionsState[currentQuestion]?.id;

        if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
            const updatedSkipped = [...skippedQuestions, currentId];
            setSkippedQuestions(updatedSkipped);
        }

        setCurrentQuestion(prev => prev + 1);
    };


    const current = questionsState[currentQuestion];
    console.log("cureree====>", current)
    if (!current) return <div className="p-4 text-red-500">No question loaded.</div>;

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

    const questionText = language === 'en' ? current.question_english : current.question_hindi;






    return (
        <div className="flex  flex-col p-4 text-sm font-sans">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>
                <div className="flex items-center gap-5">
                    <div className="text-sm">Name : <span className="font-semibold"></span>{state?.userData?.candidateName || 'guest'}</div>
                </div>
            </div>

            {/* Top Controls */}
            <div className="flex justify-between items-center border-y py-2 mb-3">
                <div className="flex gap-2">

                </div>
                <div className="text-red-600 font-semibold text-center text-sm">

                </div>
                <div className="flex gap-4 items-center">

                    <div className="flex gap-1">
                        <div className="flex gap-2">
                            <button
                                onClick={handleMarkForReview}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                            >
                                Mark for Review
                            </button>

                            {selectedOptions[current.id] ? (
                                <button
                                    onClick={handleSaveAndNext}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                                >
                                    Save & Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextQuestion}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <TestTimer timeInMinutes={60} onTimeUp={() => alert("Time is up!")} />
                    </div>
                </div>
            </div>


            {/* Main Body */}
            <div className="flex gap-4">

                {/* <div className="w-1/4">
                    <div className="font-semibold mb-2">General English</div>
                    <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: 30 }, (_, i) => (
                            <button
                                key={i}
                                className="bg-blue-600 text-white text-xs rounded px-1 py-1 text-center"
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>


                    <div className="mt-4 border-t pt-2 text-xs">
                        <div className="font-semibold">PART-A Analysis</div>
                        <p>Answered: <span className="text-orange-600 font-bold">0</span></p>
                        <p>Not Answered: <span className="text-orange-600 font-bold">30</span></p>
                        <div className="w-full h-24 bg-black mt-2"></div>
                    </div>
                </div> */}

                <QuestionGridModal
                    question={questionsState}
                    groupedQuestions={groupedQuestions}
                    currentQuestion={currentQuestion}
                    optionSelected={optionSelected}
                    markedForReview={markedForReview}
                    markedForReviewAns={markedWithAns}
                    skippedQuestions={[12, 25]}
                    setCurrentQuestion={(index) => setCurrentQuestion(index)}
                    onClose={() => setShowModal(false)}
                    onProceed={() => console.log('Proceed to summary')}
                />

                {/* Right Side - Question Panel */}
                <div className="flex-1 relative border px-4 py-3">
                    <div className='absolute top-50 left-[45%] w-full h-full items-center justify-center '>
                        <h1 className='text-gray-300 font-bold text-5xl'>REVISION24</h1>
                    </div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-bold">Question : {currentQuestion + 1}</div>
                        {/* Language Switch */}
                        <div className="flex justify-end">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="border text-xs px-2 py-1 rounded"
                            >
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                            </select>
                        </div>
                    </div>

                    {/* Question */}
                    <div
                        className="mb-2 text-sm"
                        dangerouslySetInnerHTML={{ __html: questionText }}
                    />

                    {/* Options */}
                    <div className="flex flex-col gap-2">
                        {Object.entries(options).map(([key, value]) => (
                            <label key={key} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={`question_${current.id}`}
                                    value={key}
                                    checked={selectedOptions[current.id] === key}
                                    onChange={() => handleOptionChange(current.id, key)}
                                />
                                <span
                                    className="option-content text-sm"
                                    dangerouslySetInnerHTML={{ __html: value }}
                                />
                            </label>
                        ))}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Screen5;
