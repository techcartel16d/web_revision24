import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUserTestSeriesRankSlice } from '../../redux/HomeSlice';
import Header from '../../components/Header';
import LeaderBoardTable from '../../components/LeaderBoardTable';

const Screen6 = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    console.log("Analysis Screen State Response", state);

    const [performance, setPerformance] = useState(null);
    const [sections, setSections] = useState([]);
    const [testData, setTestData] = useState({});
    const [subjectWiseAnalysis, setSubjectWiseAnalysis] = useState([]);
    const [rankScore, setRankScore] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Single, consolidated fetchUserResult function
    const fetchUserResult = useCallback(async () => {
        if (!state) return;

        // ✅ Check if data is already preloaded from AttemptedTestPage
        if (state.isDataPreloaded && state.preloadedData) {
            // console.log('Using preloaded data:', state.preloadedData);
            
            try {
                setLoading(true);
                
                // Set the data directly without API call
                const res = { status_code: 200, data: state.preloadedData };
                
                // Continue with your existing data processing logic
                if (res.status_code == 200) {
                    const test = res.data.test_detail;
                    const my = res.data.my_detail;
                    setTestData(res.data);
                    // console.log("Using preloaded data on screen no 6", res.data);

                    setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);
                    
                    const totalAttempted = my?.total_attend_question || 0;
                    const totalQuestions = test?.total_no_of_question || 1;
                    const totalMarks = parseFloat(test?.total_marks || 0);
                    const negativeMark = parseFloat(test?.negative_mark || 0);
                    const correct = parseInt(my?.correct || 0);
                    const inCorrect = parseInt(my?.in_correct || 0);

                    const markPer_ques = totalMarks / totalQuestions;
                    const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);
                    setRankScore(calculatedScore);
                    // console.log('calculatedScore from preloaded data', calculatedScore);

                    const accuracy = correct && totalAttempted
                        ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
                        : "0%";

                    setPerformance({
                        rank: {
                            value: my?.my_rank || 0,
                            total: my?.total_join_user || 0
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
                        percentile: (my?.percentile || 0) + "%"
                    });

                    const parsedSpent = JSON.parse(my?.spent_time || '[]');
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
                }
            } catch (error) {
                console.error("ERROR processing preloaded data", error);
            } finally {
                setLoading(false);
            }
            return;
        }

        // ✅ Fallback to API call if no preloaded data (for other navigation sources)
        let testId = state?.testInfo?.test_id || 
                     state?.testInfo?.id ||
                     state?.testData?.my_detail?.test_id;

        // console.log('No preloaded data, making API call with testId:', testId);

        if (!testId) {
            console.error('No test ID found in state');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await dispatch(fetchUserTestSeriesRankSlice(testId)).unwrap();

            if (res.status_code == 200) {
                const test = res.data.test_detail;
                const my = res.data.my_detail;
                setTestData(res.data);
                // console.log("res on screen no 6 from API", res.data);

                setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);
                
                const totalAttempted = my?.total_attend_question || 0;
                const totalQuestions = test?.total_no_of_question || 1;
                const totalMarks = parseFloat(test?.total_marks || 0);
                const negativeMark = parseFloat(test?.negative_mark || 0);
                const correct = parseInt(my?.correct || 0);
                const inCorrect = parseInt(my?.in_correct || 0);

                const markPer_ques = totalMarks / totalQuestions;
                const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);
                setRankScore(calculatedScore);
                // console.log('calculatedScore from API', calculatedScore);

                const accuracy = correct && totalAttempted
                    ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
                    : "0%";

                setPerformance({
                    rank: {
                        value: my?.my_rank || 0,
                        total: my?.total_join_user || 0
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
                    percentile: (my?.percentile || 0) + "%"
                });

                const parsedSpent = JSON.parse(my?.spent_time || '[]');
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
            }
        } catch (error) {
            console.error("ERROR IN RESULT SCREEN", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, state]);

    useEffect(() => {
        fetchUserResult();
    }, [fetchUserResult]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your results...</p>
                </div>
            </div>
        );
    }

    if (!performance) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 text-xl">Unable to load test results</p>
                </div>
            </div>
        );
    }

    const getScoreStatus = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return { status: 'excellent', color: 'emerald', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' };
        if (percentage >= 60) return { status: 'good', color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
        if (percentage >= 40) return { status: 'average', color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
        return { status: 'needs-improvement', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700' };
    };

    const getAccuracyStatus = (accuracy) => {
        const acc = parseFloat(accuracy);
        if (acc >= 80) return { color: 'emerald', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' };
        if (acc >= 60) return { color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
        if (acc >= 40) return { color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
        return { color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700' };
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                                {testData?.test_detail?.title}
                            </h1>
                            <p className="text-indigo-200 text-sm sm:text-base">
                                Test completed • {testData?.test_detail?.time} minutes • {testData?.test_detail?.total_no_of_question} questions
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Performance Summary Cards */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                            {/* Rank Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-pink-100 rounded-lg">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-pink-600 mb-1">#{performance.rank.value}</div>
                                <div className="text-sm text-gray-500 mb-1">out of {performance.rank.total}</div>
                                <div className="text-xs font-medium text-gray-700">Your Rank</div>
                            </div>

                            {/* Score Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-purple-600 mb-1">{performance.score.value}</div>
                                <div className="text-sm text-gray-500 mb-1">out of {performance.score.max}</div>
                                <div className="text-xs font-medium text-gray-700">Total Score</div>
                            </div>

                            {/* Attempted Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-cyan-100 rounded-lg">
                                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-cyan-600 mb-1">{performance.attempted.value}</div>
                                <div className="text-sm text-gray-500 mb-1">out of {performance.attempted.max}</div>
                                <div className="text-xs font-medium text-gray-700">Questions Attempted</div>
                            </div>

                            {/* Accuracy Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-green-600 mb-1">{performance.accuracy}</div>
                                <div className="text-xs font-medium text-gray-700">Accuracy Rate</div>
                            </div>

                            {/* Percentile Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-indigo-600 mb-1">{performance.percentile}</div>
                                <div className="text-xs font-medium text-gray-700">Percentile</div>
                            </div>
                        </div>
                    </div>

                    {/* Section Performance Table */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Section Analysis</h2>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sections.map((section, idx) => {
                                            const scoreStatus = getScoreStatus(section.score, section.maxScore);
                                            const accuracyStatus = getAccuracyStatus(section.accuracy);
                                            const scorePercent = (section.score / section.maxScore) * 100;
                                            const attemptedPercent = (section.attempted / performance.attempted.max) * 100;

                                            return (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{section.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`${scoreStatus.bgColor} rounded-lg px-3 py-2`}>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className={`font-semibold ${scoreStatus.textColor}`}>
                                                                    {section.score} / {section.maxScore}
                                                                </span>
                                                                <span className="text-sm text-gray-600">{scorePercent.toFixed(1)}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className={`bg-${scoreStatus.color}-500 h-2 rounded-full transition-all duration-500`}
                                                                    style={{ width: `${scorePercent}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="bg-blue-50 rounded-lg px-3 py-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-semibold text-blue-700">
                                                                    {section.attempted} / {performance.attempted.max}
                                                                </span>
                                                                <span className="text-sm text-gray-600">{attemptedPercent.toFixed(1)}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                                    style={{ width: `${attemptedPercent}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}>
                                                            <div className={`font-semibold ${accuracyStatus.textColor} mb-1`}>
                                                                {section.accuracy}
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
                                                                    style={{ width: section.accuracy }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="bg-yellow-50 rounded-lg px-3 py-2">
                                                            <div className="font-semibold text-yellow-800">
                                                                {section.time}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                / {testData?.test_detail?.time} min
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Subject-wise Analysis */}
                    {subjectWiseAnalysis.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Subject-wise Performance</h2>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incorrect</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {subjectWiseAnalysis.map((subject, index) => {
                                                const accuracy = subject.total_question_attempted > 0
                                                    ? ((subject.correct_count / subject.total_question_attempted) * 100).toFixed(1)
                                                    : '0';
                                                const accuracyStatus = getAccuracyStatus(accuracy);
                                                const attemptPercent = (subject.total_question_attempted / subject.total_assign_question) * 100;

                                                return (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="font-medium text-gray-900">{subject.subject_name}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-semibold text-gray-700">{subject.total_assign_question}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <span className="font-semibold text-blue-600 mr-2">
                                                                    {subject.total_question_attempted}
                                                                </span>
                                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                                                                    <div 
                                                                        className="bg-blue-500 h-2 rounded-full"
                                                                        style={{ width: `${attemptPercent}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {subject.correct_count}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                {subject.incorrect_count}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <span className={`font-semibold ${accuracyStatus.textColor} mr-2`}>
                                                                    {accuracy}%
                                                                </span>
                                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-16">
                                                                    <div 
                                                                        className={`bg-${accuracyStatus.color}-500 h-2 rounded-full`}
                                                                        style={{ width: `${accuracy}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm text-gray-600">{subject.spent_time}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Leaderboard */}
                    <div className="mb-8">
                        <LeaderBoardTable data={testData?.leaderboard || []} rankScore={rankScore} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button 
                            onClick={() => nav('/test-solutions', { state: { testData, state } })}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            View Solutions & Analysis
                        </button>
                        
                        <button 
                            onClick={() => nav('/')}
                            className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Screen6;
