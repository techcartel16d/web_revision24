import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Screen4 = () => {
    const nav = useNavigate()
    const { state } = useLocation();
    // console.log(state)
    return (
        <div className="px-6 py-3">
            <div className='flex justify-between items-center gap-5 mb-3'>
                <h1 className="text-xl font-semibold">{state && state?.testInfo?.title}</h1>
                <div className='flex items-center justify-center gap-3'>
                    <p className="text-2xl font-bold text-blue-800">
                        {state?.userData?.systemNumber || 'R2400000'}
                    </p>
                </div>
            </div>

            <div className="text-sm w-full bg-blue-400 text-left text-white px-3 py-2 mb-6 font-bold rounded">
                Candidate Name : {state?.userData?.candidateName || 'N/A'}
            </div>
            <h2 className="text-lg font-bold text-blue-700 mb-6">
                The different symbols used in the next pages are shown below. Please go through them and understand their meaning before you start the test.
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-400 text-sm text-left">
                    <thead className="bg-gray-200 text-gray-800">
                        <tr>
                            <th className="border border-gray-400 px-4 py-2 w-1/4">Symbol</th>
                            <th className="border border-gray-400 px-4 py-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">⚪</td>
                            <td className="border px-4 py-2">Option Not chosen</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border px-4 py-2">
                                <div className='w-5 h-5 bg-blue-600 rounded-full'></div>
                            </td>
                            <td className="border px-4 py-2">
                                Option chosen as correct (Clicking again removes the selection).
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 text-blue-700 font-bold">
                                <div className='w-6 h-6 bg-blue-600 text-white flex items-center justify-center rounded-sm'>
                                    12
                                </div>
                            </td>
                            <td className="border px-4 py-2">
                                Question number shown in blue color indicates you have not yet attempted the question.
                            </td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border px-4 py-2 text-green-700 font-bold">
                                <div className='w-6 h-6 bg-green-600 text-white flex items-center justify-center rounded-sm'>
                                    12
                                </div>
                            </td>
                            <td className="border px-4 py-2">
                                Question number shown in green color indicates you have answered the question.
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 text-red-600  font-bold">
                                <div className='flex flex-col items-center justify-center w-6'>

                                    <div className='w-6 h-6 bg-red-600 text-white flex items-center justify-center rounded-sm'>
                                        <p>14</p>
                                    </div>
                                    <p>▲</p>
                                </div>
                            </td>
                            <td className="border px-4 py-2">
                                You have not yet answered the question but marked it for review later.
                            </td>
                        </tr>
                        <tr className="bg-gray-50">
                            
                            <td className="border px-4 py-2 text-yellow-600 font-bold">
                                <div className='flex flex-col items-center justify-center w-6'>

                                    <div className='w-6 h-6 bg-yellow-600 text-white flex items-center justify-center rounded-sm'>
                                        <p>15</p>
                                    </div>
                                    <p>▲</p>
                                </div>
                            </td>
                            <td className="border px-4 py-2">
                                You have answered the question but marked it for review later.
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">
                                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">Save & Next</button>
                            </td>
                            <td className="border px-4 py-2">
                                Clicking on this will take you to the next question.
                            </td>
                        </tr>
                     
                        <tr>
                            <td className="border px-4 py-2">
                                <button className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs">Mark for Review</button>
                            </td>
                            <td className="border px-4 py-2">
                                Mark the question for review later. If you answer and mark for review, it will still be treated as answered.
                            </td>
                        </tr>
                           <tr className="bg-gray-50">
                            <td className="border px-4 py-2">
                                <button className="bg-gray-300  text-black px-3 py-1 rounded text-xs">Clear Options</button>
                            </td>
                            <td className="border px-4 py-2">
                                Clicking on this will take you to the previous question.
                            </td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border px-4 py-2">
                                <button className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded text-xs">Unmark Review</button>
                            </td>
                            <td className="border px-4 py-2">
                                Unmark the question that was previously marked for review.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Navigation buttons at the bottom */}
            <div className="mt-10 flex justify-between">
                <button onClick={() => nav(-1)} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded">&lt;&lt; Back</button>
                <button onClick={()=> nav('/scc-mock-test',{state})} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded">Start Test &gt;&gt;</button>
            </div>
        </div>
    );
};

export default Screen4;
