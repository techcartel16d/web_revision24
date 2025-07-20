import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Screen2 = () => {
    const nav = useNavigate()
    const { state } = useLocation()
    console.log("state", state)
    const [userInfo, setUserInfo] = useState(state?.userInfo || {})
    const [systemNumber, setSystemNumber] = useState(`R24${state?.userInfo?.mobile.slice(0, 5)}`);
    const [dob, setDob] = useState('');
    const handleLogin = () => {
        if(dob.trim() == '') return alert("Please enter your date of birth DDMMYYYY to login the test")
        const user = {
            systemNumber,
            dob
        };

        const userData = {
            candidateName: userInfo.name,
            systemNumber,
        }

        localStorage.setItem('userLogin', JSON.stringify(user));
        nav('/screen3', { state: { userData, testInfo: state?.testInof } })
        alert('Login Successfully');
    };

    return (
        <div className="h-screen flex flex-col items-center justify-start  bg-white px-4">
            <h1 className="text-xl font-semibold mb-4">SSC ONLINE MOCK TEST</h1>

            <div className="text-sm w-full bg-blue-400 text-left text-white px-3 py-2 mb-6 font-bold rounded">
                Candidate Name : {userInfo?.name || 'N/A'}
            </div>
            <p className="text-lg font-semibold">SYSTEM NO</p>
            <p className="text-5xl font-bold text-blue-800 mt-2">{systemNumber}</p>
            <div className="w-full">
                <p className="text-sm text-red-600 mb-4 font-semibold">
                    Your password is your Date of Birth (e.g. DDMMYYYY)
                </p>

                <div className="border border-gray-300 rounded-md">
                    <div className="bg-gray-200 px-4 py-2 border-b border-gray-300 text-sm font-semibold text-gray-700">
                        Candidate Login
                    </div>

                    <div className="p-4">
                        <div className="flex items-center mb-4">
                            <label className="w-32 text-gray-700 font-medium">System Number</label>
                            <input
                                type="text"
                                value={systemNumber}
                                onChange={(e) => setSystemNumber(e.target.value)}
                                className="flex-1 border border-gray-400 px-2 py-1 text-sm"
                            />
                        </div>

                        <div className="flex items-center mb-6">
                            <label className="w-32 text-gray-700 font-medium">Password</label>
                            <input
                                type="text"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="flex-1 border border-gray-400 px-2 py-1 text-sm"
                                placeholder="DDMMYYYY"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleLogin}
                                className="bg-gray-200 text-gray-800 px-4 py-1 border border-gray-400 hover:bg-gray-300 text-sm"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Screen2;
