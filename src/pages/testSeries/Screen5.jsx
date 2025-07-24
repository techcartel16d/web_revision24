import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { attendQuestionSubmitSlice, getSingleCategoryPackageTestseriesQuestionSlice } from '../../redux/HomeSlice';
import QuestionGridModal from '../../components/QuestionGridModal';
import TestTimer from '../../components/TestTimer';
import CountdownTimer from '../../components/QuestionTimer';
import Timer from '../../components/QuestionTimer';
import PauseTestModal from '../../components/PauseTestModal';
import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';



const Screen5 = () => {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const { state } = useLocation()
    console.log("state==>", state)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questionsState, setQuestionsState] = useState([]);
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [optionSelected, setOptionSelected] = useState(() => JSON.parse(localStorage.getItem("optionSelected")) || []);
    const [markedForReview, setMarkedForReview] = useState(() => JSON.parse(localStorage.getItem("markedForReview")) || []);
    const [skippedQuestions, setSkippedQuestions] = useState(() => JSON.parse(localStorage.getItem("skippedQuestions")) || []);
    const [markedWithAns, setMarkedWithAns] = useState(() => {
        return JSON.parse(localStorage.getItem("marked_with_ans")) || [];
    });
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [spentTime, setSpentTime] = useState([]);
    const [currentQuestionId, setCurrentQuestionId] = useState(''); // Example
    const [language, setLanguage] = useState('en')
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false)

    const getKey = (key) => {
        const testId = state?.testInfo?.test_id;
        return `test_${testId}_${key}`;
    };


    const storedOptions = JSON.parse(localStorage.getItem(getKey("selectedOptions"))) || {};
    const storedAttempted = JSON.parse(localStorage.getItem(getKey("optionSelected"))) || [];
    const storedMarked = JSON.parse(localStorage.getItem(getKey("markedForReview"))) || [];
    const storedSkipped = JSON.parse(localStorage.getItem(getKey("skippedQuestions"))) || [];
    const storedMarkedWithAns = JSON.parse(localStorage.getItem(getKey("marked_with_ans"))) || [];

    useEffect(() => {
        setSelectedOptions(storedOptions);
        setOptionSelected(storedAttempted);
        setMarkedForReview(storedMarked);
        setSkippedQuestions(storedSkipped);
        setMarkedWithAns(storedMarkedWithAns);
    }, []);



    const enterFullScreen = () => {
        const elem = document.documentElement; // or use any specific element
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
            setIsFullScreen(true)
        } else if (elem.webkitRequestFullscreen) {
            setIsFullScreen(true)
            /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            setIsFullScreen(true)
            /* IE11 */
            elem.msRequestFullscreen();
        }
    };


    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            // IE11
            document.msExitFullscreen();
        }
    };

    useEffect(() => {
        enterFullScreen()
    }, [])



    const getTestSeriesQuestion = async () => {
        try {
            setLoading(true)
            const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap()
            if (res.status_code == 200) {
                console.log("question data fetching", res)
                setQuestionsState(res.data)
                setLoading(false)
                // setRefreshing(false)
            } else {
                console.log("response", res)
            }

        } catch (error) {
            setLoading(false)

        } finally {
            setLoading(false)
        }



    }


    useEffect(() => {
        getTestSeriesQuestion()
    }, [])

    // useEffect(() => {
    //     const storedOptions = JSON.parse(localStorage.getItem("selectedOptions")) || {};
    //     const storedAttempted = JSON.parse(localStorage.getItem("optionSelected")) || [];
    //     const storedMarked = JSON.parse(localStorage.getItem("markedForReview")) || [];
    //     const storedSkipped = JSON.parse(localStorage.getItem("skippedQuestions")) || [];

    //     setSelectedOptions(storedOptions);
    //     setOptionSelected(storedAttempted);
    //     setMarkedForReview(storedMarked);
    //     setSkippedQuestions(storedSkipped);
    // }, []);

    useEffect(() => {
        localStorage.setItem(getKey("selectedOptions"), JSON.stringify(selectedOptions));
        localStorage.setItem(getKey("optionSelected"), JSON.stringify(optionSelected));
    }, [selectedOptions, optionSelected]);

    useEffect(() => {
        localStorage.setItem(getKey("markedForReview"), JSON.stringify(markedForReview));
    }, [markedForReview]);

    useEffect(() => {
        localStorage.setItem(getKey("skippedQuestions"), JSON.stringify(skippedQuestions));
    }, [skippedQuestions]);

    useEffect(() => {
        localStorage.setItem(getKey("marked_with_ans"), JSON.stringify(markedWithAns));
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



    // HANDLE OPTION CHANGE
    const handleOptionChange = (questionId, optionKey) => {
        // 👉 helper to generate test-specific localStorage key
        const getKey = (key) => `test_${state?.testInfo?.test_id}_${key}`;

        // ✅ Save selected option for this question
        const updated = { ...selectedOptions, [questionId]: optionKey };
        setSelectedOptions(updated);
        localStorage.setItem(getKey("selectedOptions"), JSON.stringify(updated));

        // ✅ If marked for review AND not already in marked_with_ans
        if (markedForReview.includes(questionId)) {
            if (!markedWithAns.includes(questionId)) {
                const updatedMarkedWithAns = [...markedWithAns, questionId];
                setMarkedWithAns(updatedMarkedWithAns);
                localStorage.setItem(getKey("marked_with_ans"), JSON.stringify(updatedMarkedWithAns));
            }
        }

        // ✅ Remove from skipped if it was there
        if (skippedQuestions.includes(questionId)) {
            const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
            setSkippedQuestions(updatedSkipped);
            localStorage.setItem(getKey("skippedQuestions"), JSON.stringify(updatedSkipped));
        }
    };





    // HANDLE NEXT AND SAVE FUNCTION
    const handleSaveAndNext = () => {
        // 👉 helper to generate test-specific localStorage key
        const getKey = (key) => `test_${state?.testInfo?.test_id}_${key}`;

        const currentId = questionsState[currentQuestion]?.id;

        // ⏱ Save spent time for current question
        updateSpentTime(currentId);

        // ✅ Add to attempted list if selected
        if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
            const updatedSelected = [...optionSelected, currentId];
            setOptionSelected(updatedSelected);
            localStorage.setItem(getKey("optionSelected"), JSON.stringify(updatedSelected));
        }

        // ✅ Remove from skipped if it was skipped earlier
        if (selectedOptions[currentId] && skippedQuestions.includes(currentId)) {
            const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
            setSkippedQuestions(updatedSkipped);
            localStorage.setItem(getKey("skippedQuestions"), JSON.stringify(updatedSkipped));
        }

        // 👉 Move to next question
        setCurrentQuestion(prev => prev + 1);
    };



    // HANDLE MARK FOR REVIEW FUNCTION
    const handleMarkForReview = () => {
        // 🔑 Generate test-specific key
        const getKey = (key) => `test_${state?.testInfo?.test_id}_${key}`;

        const currentId = questionsState[currentQuestion]?.id;

        const isOptionSelected = !!selectedOptions[currentId];
        const isAlreadyMarked = markedForReview.includes(currentId);
        const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

        // ✅ If option is selected, store only in marked_with_ans
        if (isOptionSelected && !isAlreadyMarkedWithAns) {
            const updatedMarkedWithAns = [...markedWithAns, currentId];
            setMarkedWithAns(updatedMarkedWithAns);
            localStorage.setItem(getKey("marked_with_ans"), JSON.stringify(updatedMarkedWithAns));
        }

        // ✅ If option is not selected, store only in markedForReview
        if (!isOptionSelected && !isAlreadyMarked) {
            const updatedMarked = [...markedForReview, currentId];
            setMarkedForReview(updatedMarked);
            localStorage.setItem(getKey("markedForReview"), JSON.stringify(updatedMarked));
        }

        // 👉 Move to next question
        setCurrentQuestion(prev => prev + 1);
    };


    // HANDLE NEXT QUESTION 
    const handleNextQuestion = () => {
        // 🔑 Create dynamic key using test_id
        // const getKey = (key) => `test_${state?.testInfo?.test_id}_${key}`;

        const currentId = questionsState[currentQuestion]?.id;

        // ⏱ Save spent time for current question
        updateSpentTime(currentId);

        // 🚫 If no option selected & not already skipped, then skip
        if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
            const updatedSkipped = [...skippedQuestions, currentId];
            setSkippedQuestions(updatedSkipped);

            // 💾 Save to localStorage using test-specific key
            localStorage.setItem(getKey("skippedQuestions"), JSON.stringify(updatedSkipped));
        }

        // 👉 Move to next question
        setCurrentQuestion(prev => prev + 1);
    };


    useEffect(() => {
        setQuestionStartTime(Date.now());
    }, [currentQuestion]);


    // UPDATE SPANT TIME
    const updateSpentTime = (questionId) => {
        const now = Date.now();
        const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000); // in seconds

        const existing = JSON.parse(localStorage.getItem(getKey('spentTime'))) || [];

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

        localStorage.setItem(getKey('spentTime'), JSON.stringify(updated));
        console.log('✅ Updated Spent Time:', updated);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentQuestion]);  // हर बार question बदलने पर नया timer start हो

    // Reset भी कर दो जब question change हो
    useEffect(() => {
        setElapsedSeconds(0);
    }, [currentQuestion]);


    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };




    const current = questionsState[currentQuestion];
    // console.log("cureree====>", current)
    if (!current) return <div className="p-4-400 text-red-500 w-full h-full flex items-center justify-center">
        <div className="fading-spinner">
            {[...Array(12)].map((_, i) => (
                <div key={i} className={`bar bar${i + 1}`}></div>
            ))}
        </div>
    </div>;

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



    const handlePauseClick = () => {
        setShowPauseModal(true);
    };

    const handleConfirmPause = () => {
        setShowPauseModal(false);
        console.log("Test paused and state saved.");

        const currentTestId = state?.testInfo?.test_id;

        // 🔁 Get existing paused status array from localStorage
        const existingStatus = JSON.parse(localStorage.getItem('pause_status_array')) || [];

        // 🔄 Check if test already exists
        const updatedStatus = [...existingStatus.filter(item => item.test_id !== currentTestId)];

        // ✅ Push new or updated test status
        updatedStatus.push({
            test_id: currentTestId,
            isPaused: true,
        });

        // 💾 Save updated array in localStorage
        localStorage.setItem('pause_status_array', JSON.stringify(updatedStatus));
        exitFullScreen()
        // 🔁 Redirect
        nav('/testpakages', { replace: true, state: { testId: state?.testId } });
    };


    const handleCancelPause = () => {
        setShowPauseModal(false);
    };






    const questionText = language === 'en' ? current.question_english : current.question_hindi;

    const totalTimeSpent = Object.values(spentTime).reduce((sum, val) => sum + val, 0);



    const handleSubmit = async () => {
        const testId = state?.testInfo?.test_id;

        // ✅ Use getKey for all localStorage reads
        const spentTime = JSON.parse(localStorage.getItem(getKey('spentTime'))) || [];
        const optionSelected = JSON.parse(localStorage.getItem(getKey('optionSelected'))) || [];
        const selectedOptions = JSON.parse(localStorage.getItem(getKey('selectedOptions'))) || {};
        const skippedQuestions = JSON.parse(localStorage.getItem(getKey('skippedQuestions'))) || [];
        const markedForReview = JSON.parse(localStorage.getItem(getKey('markedForReview'))) || [];

        const totalAttendedQuestions = optionSelected.length;
        const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

        let correct = 0;
        let in_correct = 0;

        const allAttendedQuestions = optionSelected.map((questionId) => {
            const question = questionsState.find(q => q.id === questionId);
            const selectedAns = selectedOptions[questionId];
            const rightAns = question?.hindi_ans;

            if (selectedAns === rightAns) {
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

        const negativeMark = state?.testInfo?.negative_mark;
        const marksScored = correct - (in_correct * parseFloat(negativeMark));

        const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

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
            skip_question: skippedQuestions,
            attend_question: optionSelected,
            mark_for_review: markedForReview
        };

        console.log("submission data", submissionData);

        try {
            const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
            console.log("submitted test response", res);

            // ✅ Clear all test-specific data
            localStorage.removeItem(getKey("spentTime"));
            localStorage.removeItem(getKey("optionSelected"));
            localStorage.removeItem(getKey("markedForReview"));
            localStorage.removeItem(getKey("skippedQuestions"));
            localStorage.removeItem(getKey("selectedOptions"));
            localStorage.removeItem(getKey("marked_with_ans"));

            nav('/analysis', { replace: true, state });

        } catch (error) {
            console.log("ERROR IN SUBMIT TEST", error);
        }
    };


    // const handleSubmit = async () => {
    //     const testId = state?.testInfo?.test_id;
    //     const spentTime = JSON.parse(localStorage.getItem('spentTime')) || [];

    //     const totalAttendedQuestions = optionSelected.length;
    //     const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

    //     let correct = 0;
    //     let in_correct = 0;

    //     const allAttendedQuestions = optionSelected.map((questionId) => {
    //         const question = questionsState.find(q => q.id === questionId);
    //         const selectedAns = selectedOptions[questionId];
    //         const rightAns = question?.hindi_ans;

    //         if (selectedAns === rightAns) {
    //             correct++;
    //         } else {
    //             in_correct++;
    //         }

    //         return {
    //             question_id: questionId,
    //             user_selected_ans: selectedAns,
    //             right_ans: rightAns
    //         };
    //     });

    //     const negativeMark = state?.testInfo?.negative_mark;
    //     const marksScored = correct - (in_correct * parseFloat(negativeMark));

    //     const timeSpent = Object.entries(spentTime).map(([qid, seconds]) => ({
    //         questionId: Number(qid),
    //         time: seconds
    //     }));

    //     const totalTimeSpent = Object.values(spentTime).reduce((acc, val) => acc + val, 0);

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
    //         attend_question: optionSelected,
    //         mark_for_review: markedForReview
    //     };

    //     console.log("submission data", submissionData);

    //     try {
    //         const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
    //         console.log("submitted test response", res);

    //         // ✅ Clear localStorage after successful submission
    //         localStorage.removeItem("spentTime");
    //         localStorage.removeItem("optionSelected");
    //         localStorage.removeItem("markedForReview");
    //         localStorage.removeItem("skippedQuestions");
    //         localStorage.removeItem("selectedOptions");
    //         localStorage.removeItem("marked_with_ans");
    //         nav('/screen6', { replace: true, state })

    //     } catch (error) {
    //         console.log("ERROR IN SUBMIT TEST", error);
    //     }
    // };




    return (
        <div className="flex flex-col p-4 text-sm font-sans overflow-hidden">
            

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>
                <div className="flex items-center gap-5">
                    {
                isFullScreen ? (
                    <div className=''>
                        <button onClick={() => {
                            setIsFullScreen(false)
                            exitFullScreen()
                        }} className='px-6 py-2 bg-gray-600 rounded-md text-white'>Exit Full Screen</button>
                    </div>
                ) : (
                    <div className=''>
                        <button onClick={() => {
                            setIsFullScreen(true)
                            enterFullScreen()
                        }} className='px-6 py-2 bg-gray-600 rounded-md text-white'>Full Screen</button>
                    </div>
                )
            }
                    <div className="text-sm">Name : <span className="font-semibold"></span>{state?.userData?.candidateName || 'guest'}</div>
                </div>
            </div>

            {/* Top Controls */}
            <div className="flex justify-between items-center border-y py-2 mb-3">

                <div className="text-red-600 font-semibold text-center flex text-sm gap-3">
                    <button
                        onClick={handlePauseClick}
                        className="bg-yellow-400 text-gray-800 px-3 py-1 rounded text-xs"
                    >
                        Puase
                    </button>
                    <button
                        onClick={()=> setConfirmSubmit(true)}
                        className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </div>

                <div className="flex gap-4 justify-between items-center w-1/2">

                    <div className="flex gap-1">
                        <div className="flex gap-2">
                            <button
                                onClick={handleMarkForReview}
                                className="bg-blue-500 text-white px-6 py-2 rounded text-sm"
                            >
                                Mark for Review
                            </button>

                            {selectedOptions[current.id] ? (
                                <button
                                    onClick={handleSaveAndNext}
                                    className="bg-green-600 text-white px-6 py-2 rounded text-sm"
                                >
                                    Save & Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextQuestion}
                                    className="bg-blue-500 text-white px-6 py-2 rounded text-sm"
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
            <div className="flex gap-4 w-full">
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
                <div className="flex-1 relative border px-4 py-3" id="testBg">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-bold">Question : {currentQuestion + 1}</div>
                        {/* Language Switch */}
                        <div className="flex justify-end flex-col gap-2">
                            {/* ⏱️ Time for current question */}
                            <div className="text-xs text-gray-600 font-semibold">
                                Time: {formatTime(elapsedSeconds)}
                            </div>
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
        </div>
    );
};

export default Screen5;
