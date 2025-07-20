import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Screen1 = () => {
  const { state } = useLocation()
  console.log("state====>", state)
  const [userInfo, setUserInfo] = useState({});
  const nav = useNavigate()

  const getUserInfo = () => {
    const strUser = localStorage.getItem("user") || "{}";
    const parsedUser = JSON.parse(strUser);
    setUserInfo(parsedUser);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const systemNumber = `R24${userInfo?.mobile?.slice(0, 5) || '00000'}`;
  const examName = userInfo?.exam || 'Mock Test';

  return (
    <div className="min-h-screen bg-white px-6 py-8 text-center">
      <h1 className="text-xl font-semibold mb-4">SSC ONLINE MOCK TEST</h1>

      <div className="text-sm bg-blue-400 text-left text-white px-3 py-2 mb-6 font-bold rounded">
        Candidate Name : {userInfo?.name || 'N/A'}
      </div>



      {/* Center Bottom Section */}
      <div className="mt-8">
        <p className="text-lg font-semibold">SYSTEM NO</p>
        <p className="text-5xl font-bold text-blue-800 mt-2">{systemNumber}</p>

        {/* Main Info & Photo Container */}
        <div className=" mt-6 py-6 rounded bg-gray-50 shadow-md px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-6">
            {/* Left Table */}
            <div className="w-full lg:w-1/2">
              <table className="w-full text-left text-gray-700">
                <tbody>
                  <tr className="">
                    <td className="p-3 font-semibold">System Number</td>
                    <td className="p-3 text-blue-800 font-bold">{systemNumber}</td>
                  </tr>
                  <tr className="">
                    <td className="p-3 font-semibold">Candidate Name</td>
                    <td className="p-3 text-blue-800 font-bold">{userInfo?.name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Exam</td>
                    <td className="p-3 text-blue-800 font-bold">{examName}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right Photo Box */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center border rounded shadow p-4 bg-white">
              <div className="flex gap-4">
                <div className="w-52 h-44 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-sm">
                  Registratoion Photo
                </div>
                <div className="w-52 h-44 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-sm">
                  Captured Photo
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              className="bg-blue-700 text-white px-6 py-2 cursor-pointer rounded hover:bg-blue-800"
              onClick={() => {
                // Replace this with your exam start logic
                console.log('Start Exam');
                nav("/screen2", { state: {userInfo, testInof:state} })
              }}
            >
              Click Here to Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen1;
