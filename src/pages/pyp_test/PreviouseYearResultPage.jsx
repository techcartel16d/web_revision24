

import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUserTestSeriesRankSlice } from '../../redux/HomeSlice';
import Header from '../../components/Header';
import LeaderBoardTable from '../../components/LeaderBoardTable';
import { getPreviouseYearPaperRankSlice } from '../../redux/freeTestSlice';

const PreviouseYearResultPage = () => {
    const nav = useNavigate()
    const dispatch = useDispatch();
    const { state } = useLocation();

    // console.log("state==>", state)
    // return

    const [performance, setPerformance] = useState(null);
    const [sections, setSections] = useState([]);
    const [testData, setTestData] = useState({})
    // Add below useState
    const [subjectWiseAnalysis, setSubjectWiseAnalysis] = useState([]);
    const [rankScore, setRankScore] = useState(null)



    const fetchUserResult = useCallback(async () => {
        if (!state) return;

        let testId = state?.testInfo?.test_id || state?.testInfo?.id;
        try {
            const res = await dispatch(getPreviouseYearPaperRankSlice(testId)).unwrap();
            // console.log("response===>", res);

            if (res.status_code === 200) {
                const test = res.data.previous_year_exam_detail; // ✅ change
                const my = res.data.my_detail; // ✅ same
                setTestData(res.data);

                // Inside `fetchUserResult` (after setting testData)
                setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

                const totalAttempted = parseInt(my?.total_attend_question || 0);
                const totalQuestions = parseInt(test?.total_question || 1);
                const markPerQues = parseFloat(test?.marks_per_question || 0);
                const negativeMark = parseFloat(test?.negative_marks || 0);
                const correct = parseInt(my?.correct || 0);
                const inCorrect = parseInt(my?.in_correct || 0);

                // ✅ Score Calculation
                const calculatedScore = (correct * markPerQues) - (inCorrect * negativeMark);
                setRankScore(calculatedScore);

                // ✅ Accuracy
                const accuracy = correct && totalAttempted
                    ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
                    : "0%";

                // ✅ Performance Summary
                setPerformance({
                    rank: {
                        value: my.my_rank,
                        total: my.total_join_user
                    },
                    score: {
                        value: calculatedScore.toFixed(2),
                        max: (totalQuestions * markPerQues).toFixed(2)
                    },
                    attempted: {
                        value: totalAttempted,
                        max: totalQuestions
                    },
                    accuracy,
                    percentile: my.percentile + "%"
                });

                // ✅ Spent Time
                const parsedSpent = JSON.parse(my.spent_time || '[]');
                const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

                setSections([
                    {
                        name: "Full Test",
                        score: calculatedScore.toFixed(2),
                        maxScore: (totalQuestions * markPerQues).toFixed(2),
                        attempted: totalAttempted,
                        accuracy,
                        time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
                    }
                ]);
            }
        } catch (error) {
            console.error("ERROR IN RESULT SCREEN", error);
        }
    }, [dispatch, state]);


    useEffect(() => {
        fetchUserResult();
    }, [fetchUserResult]);

    if (!performance) {
        return <div className="p-4-400 text-red-500 w-full h-screen flex items-center justify-center">
            <div className="fading-spinner">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`bar bar${i + 1}`}></div>
                ))}
            </div>
        </div>;
    }

    return (
        <>
            <Header />
            <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
                <h2 className="text-xl font-semibold mb-4 text-center">{testData && testData?.test_detail?.title}</h2>
                <h2 className="text-xl mb-4">Overall Performance Summary</h2>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
                    <div className="bg-white shadow rounded p-4 text-center">
                        <div className="text-pink-600 font-bold text-lg">{performance.rank.value}</div>
                        <div className="text-xs">/ {performance.rank.total}</div>
                        <div className="text-sm mt-1 text-gray-600">Rank</div>
                    </div>
                    <div className="bg-white shadow rounded p-4 text-center">
                        <div className="text-purple-600 font-bold text-lg">{performance.score.value}</div>
                        <div className="text-xs">/ {performance.score.max}</div>
                        <div className="text-sm mt-1 text-gray-600">Score</div>
                    </div>
                    <div className="bg-white shadow rounded p-4 text-center">
                        <div className="text-cyan-600 font-bold text-lg">{performance.attempted.value}</div>
                        <div className="text-xs">/ {performance.attempted.max}</div>
                        <div className="text-sm mt-1 text-gray-600">Attempted</div>
                    </div>
                    <div className="bg-white shadow rounded p-4 text-center">
                        <div className="text-green-600 font-bold text-lg">{performance.accuracy}</div>
                        <div className="text-sm mt-1 text-gray-600">Accuracy</div>
                    </div>
                    <div className="bg-white shadow rounded p-4 text-center">
                        <div className="text-indigo-600 font-bold text-lg">{performance.percentile}</div>
                        <div className="text-sm mt-1 text-gray-600">Percentile</div>
                    </div>
                </div>


                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-6 py-3">Section Name</th>
                                <th className="px-6 py-3">Score</th>
                                <th className="px-6 py-3">Attempted</th>
                                <th className="px-6 py-3">Accuracy</th>
                                <th className="px-6 py-3">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map((s, idx) => {
                                const accuracyNum = parseFloat(s.accuracy);

                                // ✅ Calculate % for score and attempted
                                const scorePercent = (s.score / s.maxScore) * 100;
                                const attemptedPercent = (s.attempted / performance.attempted.max) * 100;
                                // console.log(attemptedPercent)

                                // ✅ Dynamic color based on 25% threshold
                                const scoreColor = scorePercent > 70 ? 'bg-green-600' : 'bg-red-600';
                                const scoreColorText = scorePercent > 70 ? 'text-green-600' : 'text-red-600';
                                const scoreBg = scorePercent > 70 ? 'bg-green-100' : 'bg-red-50';
                                const scoreTrack = scorePercent > 70 ? 'bg-green-300' : 'bg-red-300';

                                const attemptedColor = attemptedPercent > 70 ? 'bg-green-600' : 'bg-red-600';
                                const attemptedColorText = attemptedPercent > 70 ? 'text-green-600' : 'text-red-600';
                                const attemptedBg = attemptedPercent > 70 ? 'bg-green-100' : 'bg-red-50';
                                const attemptedTrack = attemptedPercent > 70 ? 'bg-green-300' : 'bg-red-300';

                                const accuracyColor = accuracyNum < 70 ? 'bg-red-500' : 'bg-violet-500';
                                const accuracyBg = accuracyNum < 70 ? 'bg-red-50' : 'bg-green-100';
                                const accuracyTrack = accuracyNum < 70 ? 'bg-red-300' : 'bg-violet-300';

                                return (
                                    <tr key={idx} className="border-t">
                                        {/* Name */}
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{s.name}</td>

                                        {/* Score */}
                                        <td className="px-6 py-4">
                                            <div className={`${scoreBg} rounded px-2 py-1 relative`}>
                                                <div className="text-purple-800 font-semibold flex justify-between">
                                                    <span className={`text-gray-400 font-bold ${scoreColorText}`}> {s.score}/ {s.maxScore}</span>
                                                    <span>{scorePercent.toFixed(2)} %</span>
                                                </div>
                                                <div className={`h-1 ${scoreTrack} rounded mt-1`}>
                                                    <div className={`h-1 ${scoreColor} rounded`} style={{ width: `${scorePercent}%` }} />

                                                </div>
                                            </div>
                                        </td>

                                        {/* Attempted */}
                                        <td className="px-6 py-4">
                                            <div className={`${attemptedBg} rounded px-2 py-1 relative`}>
                                                <div className="text-blue-800 font-semibold flex justify-between">
                                                    <span className={`text-gray-400 font-bold ${attemptedColorText}`}>{s.attempted} / {performance.attempted.max}</span>
                                                    <span>{attemptedPercent.toFixed(2)}%</span>
                                                </div>
                                                <div className={`h-1 ${attemptedTrack} rounded mt-1`}>
                                                    <div className={`h-1 ${attemptedColor} rounded`} style={{ width: `${attemptedPercent}%` }} />
                                                </div>
                                            </div>
                                        </td>

                                        {/* Accuracy */}
                                        <td className="px-6 py-4">
                                            <div className={`${accuracyBg} rounded px-2 py-1 relative`}>
                                                <div className="text-green-800 font-semibold">{s.accuracy}</div>
                                                <div className={`h-1 ${accuracyTrack} rounded mt-1`}>
                                                    <div className={`h-1 ${accuracyColor} rounded`} style={{ width: `${accuracyNum}%` }} />
                                                </div>
                                            </div>
                                        </td>

                                        {/* Time */}
                                        <td className="px-6 py-4">
                                            <div className="bg-yellow-50 rounded px-2 py-1 relative">
                                                <div className="text-yellow-800 font-semibold">
                                                    {s.time} <span className="text-gray-400">/ {testData?.test_detail?.time} min</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
                <div className="bg-white shadow rounded overflow-x-auto mt-8">
                    <h3 className="text-lg font-semibold px-6 py-4 border-b">Subject Wise Analysis</h3>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3">Total Questions</th>
                                <th className="px-6 py-3">Attempted</th>
                                <th className="px-6 py-3">Correct</th>
                                <th className="px-6 py-3">Incorrect</th>
                                <th className="px-6 py-3">Accuracy</th>
                                <th className="px-6 py-3">Spent Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjectWiseAnalysis.map((item, index) => {
                                const accuracy = item.total_question_attempted > 0
                                    ? ((item.correct_count / item.total_question_attempted) * 100).toFixed(2) + '%'
                                    : '0%';

                                return (
                                    <tr key={index} className="border-t">
                                        <td className="px-6 py-4 whitespace-nowrap">{item.subject_name}</td>
                                        <td className="px-6 py-4">{item.total_assign_question}</td>
                                        <td className="px-6 py-4">{item.total_question_attempted}</td>
                                        <td className="px-6 py-4">{item.correct_count}</td>
                                        <td className="px-6 py-4">{item.incorrect_count}</td>
                                        <td className="px-6 py-4">{accuracy}</td>
                                        <td className="px-6 py-4">{item.spent_time} min</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <LeaderBoardTable data={testData && testData?.leaderboard || []} rankScore={rankScore} />


                <div className='my-3 w-full flex items-center justify-center'>
                    <button onClick={() => nav('/previouse-year-exam-solutions', { state: { testData, state } })} className='px-4 py-2 bg-blue-400 cursor-pointer text-white rounded-sm'>View Solutions</button>
                </div>
            </div>
        </>

    );
};

export default PreviouseYearResultPage;
