import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUserTestSeriesRankSlice } from '../../redux/HomeSlice';

const Screen6 = () => {
    const nav = useNavigate()
    const dispatch = useDispatch();
    const { state } = useLocation();

    console.log("state==>", state)

    const [performance, setPerformance] = useState(null);
    const [sections, setSections] = useState([]);
    const [testData, setTestData] = useState({})

    const fetchUserResult = useCallback(async () => {
        if (!state) return;

       let testId = state?.testInfo?.test_id || state?.testInfo?.id
        try {
            const res = await dispatch(fetchUserTestSeriesRankSlice(testId)).unwrap();
            console.log("response===>", res)

            if (res.status_code == 200) {
                const test = res.data.test_detail;
                const my = res.data.my_detail;
                setTestData(res.data)

                const totalAttempted = my?.total_attend_question || 0;
                const totalQuestions = test?.total_no_of_question || 1;
                const totalMarks = parseFloat(test?.total_marks || 0);
                const negativeMark = parseFloat(test?.negative_mark || 0);
                const correct = parseInt(my?.correct || 0);
                const inCorrect = parseInt(my?.in_correct || 0);

                const markPer_ques = totalMarks / totalQuestions;
                const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);

                const accuracy = correct && totalAttempted
                    ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
                    : "0%";

                setPerformance({
                    rank: {
                        value: my.my_rank,
                        total: my.total_join_user
                    },
                    score: {
                        value: calculatedScore.toFixed(2),
                        max: totalMarks
                    },
                    attempted: {
                        value: totalAttempted,
                        max: totalQuestions
                    },
                    accuracy,
                    percentile: my.percentile + "%"
                });

                const parsedSpent = JSON.parse(my.spent_time || '[]');
                const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

                setSections([
                    {
                        name: "Full Test",
                        score: calculatedScore.toFixed(2),
                        maxScore: totalMarks,
                        attempted: totalAttempted,
                        accuracy,
                        time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
                    }
                ]);

                console.log("Score:", calculatedScore.toFixed(2));
            }
        } catch (error) {
            console.error("ERROR IN RESULT SCREEN", error);
        }
    }, [dispatch, state]);

    useEffect(() => {
        fetchUserResult();
    }, [fetchUserResult]);

    if (!performance) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-center">{state && state?.testInfo?.title}</h2>
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
                            const scoreColor = s.score < 130 ? 'bg-red-600' : 'bg-green-600';
                            const attemptedColor = s.attempted < 70 ? 'bg-red-500' : 'bg-blue-500';
                            const accuracyNum = parseFloat(s.accuracy);
                            const accuracyColor = accuracyNum < 70 ? 'bg-red-500' : 'bg-violet-500';

                            return (
                                <tr key={idx} className="border-t">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{s.name}</td>

                                    {/* Score */}
                                    <td className="px-6 py-4">
                                        <div className={`${s.score < 130 ? " bg-red-50 " :'bg-green-100 '} rounded px-2 py-1 relative`}>
                                            <div className="text-purple-800 font-semibold">
                                                {s.score} <span className="text-gray-400 font-normal">/ {s.maxScore}</span>
                                            </div>
                                            <div className={`h-1 ${s.score < 130 ? " bg-red-300 " :'bg-green-300 '}rounded mt-1`}>
                                                <div
                                                    className={`h-1 ${scoreColor} rounded`}
                                                    style={{ width: `${(s.score / s.maxScore) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Attempted */}
                                    <td className="px-6 py-4">
                                        <div className={`${s.attempted < 70 ? 'bg-red-50' : 'bg-blue-50'}  rounded px-2 py-1 relative`}>
                                            <div className="text-blue-800 font-semibold">
                                                {s.attempted} <span className="text-gray-400 font-normal">/ {s.maxAttempted || s.maxScore}</span>
                                            </div>
                                                   <div className={`h-1 ${s.score < 130 ? " bg-red-300 " :'bg-blue-300 '}rounded mt-1`}>
                                                <div
                                                    className={`h-1 ${attemptedColor} rounded`}
                                                    style={{ width: `${(s.attempted / (s.maxAttempted || s.maxScore)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Accuracy */}
                                    <td className="px-6 py-4">
                                        <div className={`${accuracyNum < 70 ? 'bg-red-50' : 'bg-green-100'} rounded px-2 py-1 relative`}>
                                            <div className="text-green-800 font-semibold">{s.accuracy}%</div>
                                                   <div className={`h-1 ${s.score < 130 ? " bg-red-300 " :'bg-violet-300 '}rounded mt-1`}>
                                                <div
                                                    className={`h-1 ${accuracyColor} rounded`}
                                                    style={{ width: `${accuracyNum}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Time */}
                                    <td className="px-6 py-4">
                                        <div className="bg-yellow-50 rounded px-2 py-1 relative">
                                            <div className="text-yellow-800 font-semibold">
                                                {s.time} <span className="text-gray-400">/ 60 min</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Overall row remains unchanged */}
                        <tr className="border-t bg-gray-50 font-bold text-gray-900">
                            <td className="px-6 py-4">Overall</td>
                            <td className="px-6 py-4">
                                <div className="text-purple-800">
                                    {performance.score.value} <span className="text-gray-500 font-normal">/ {performance.score.max}</span>
                                    <div className="text-xs text-gray-500">{performance.score.cutoff && `${performance.score.cutoff} cut-off`}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {performance.attempted.value} <span className="text-gray-500 font-normal">/ {performance.attempted.max}</span>
                            </td>
                            <td className="px-6 py-4">
                                {performance.accuracy}%
                            </td>
                            <td className="px-6 py-4">
                                {performance.time || sections[0]?.time} <span className="text-gray-500">/ 60 min</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            {/* <div className="bg-white shadow rounded overflow-x-auto">
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
                        {sections.map((s, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="px-6 py-3 whitespace-nowrap">{s.name}</td>
                                <td className="px-6 py-3">{s.score} / {s.maxScore}</td>
                                <td className="px-6 py-3">{s.attempted}</td>
                                <td className="px-6 py-3">{s.accuracy}</td>
                                <td className="px-6 py-3">{s.time} / 60 min</td>
                            </tr>
                        ))}
                        <tr className="bg-yellow-50 border-t font-semibold">
                            <td className="px-6 py-3">Overall</td>
                            <td className="px-6 py-3">{performance.score.value} / {performance.score.max}</td>
                            <td className="px-6 py-3">{performance.attempted.value} / {performance.attempted.max}</td>
                            <td className="px-6 py-3">{performance.accuracy}</td>
                            <td className="px-6 py-3">{sections[0]?.time} / 60 min</td>
                        </tr>
                    </tbody>
                </table>
            </div> */}

            <div className='my-3 w-full flex items-center justify-center'>
                <button onClick={() => nav('/test-solutions', { state: {testData, state} })} className='px-4 py-2 bg-blue-400 cursor-pointer text-white rounded-sm'>View Solutions</button>
            </div>
        </div>
    );
};

export default Screen6;
