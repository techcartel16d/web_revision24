import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveTestLoginInfo } from '../../helpers/userStorage';
import AlertModal from '../../components/AlertModal';
import SuccessModal from '../../components/SuccessModal';

const Screen2 = () => {
    const nav = useNavigate();
    const { state } = useLocation();
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState('')

    const [showSuccess, setShowSuccess] = useState(false);
    // console.log("state", state);

    const [userInfo, setUserInfo] = useState(state?.userInfo || {});
    const [systemNumber, setSystemNumber] = useState(`R24${state?.userInfo?.mobile?.slice(0, 5)}`);
    const [dob, setDob] = useState('');

    // Convert YYYY-MM-DD to DDMMYYYY
    function formatDateToDDMMYYYY(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}${month}${year}`;
    }

    const formattedDOB = formatDateToDDMMYYYY(userInfo?.dob); // Expected password
    // console.log("Expected DOB (Password):", formattedDOB);

    const handleLogin = async (e) => {
        e.preventDefault()
        const enteredDob = dob.trim();
        if (enteredDob === '') {
            // return alert("Please enter your Date of Birth in DDMMYYYY format.");
            setMessage("Please enter your Date of Birth in DDMMYYYY format.")
            setShowAlert(true)
        }

        if (enteredDob !== formattedDOB) {

            setMessage("Please enter the correct Date of Birth to login.")
            setShowAlert(true)

            return

            // alert("");
        }

        // Save login info and redirect to Screen3
        // const user = { systemNumber, dob: enteredDob };
        const userData = {
            candidateName: userInfo.name,
            systemNumber,
        };

        // localStorage.setItem('userLogin', JSON.stringify(user));
        await saveTestLoginInfo(userData)
        setShowSuccess(true)

    };

    return (
        <div className="h-screen flex flex-col items-center justify-start bg-white px-4">
            <h1 className="text-xl font-semibold mb-4">{state && state?.testInfo?.title}</h1>

            <div className="text-sm w-full bg-blue-400 text-left text-white px-3 py-2 mb-6 font-bold rounded">
                Candidate Name : {userInfo?.name || 'N/A'}
            </div>

            <p className="text-lg font-semibold">SYSTEM NO</p>
            <p className="text-5xl font-bold text-blue-800 mt-2">{systemNumber}</p>

            <div className="w-full">
                <p className="text-sm text-red-600 mb-4 font-semibold">
                    Your password is your Date of Birth (e.g. DDMMYYYY. 01062001)
                </p>

                <form onSubmit={handleLogin} className="border border-gray-300 rounded-md">
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
                                readOnly
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
                                type='submit'
                                className="bg-gray-200 text-gray-800 px-4 py-1 border border-gray-400 hover:bg-gray-300 text-sm"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <AlertModal
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                title="DOB ERROR"
                message={message}

            />
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false)
                    nav('/instructions', {
                        state: {
                            userData: {
                                candidateName: userInfo?.name,
                                systemNumber,
                            },
                            testInfo: state?.testInfo,
                            testId: state?.testId,
                            testDetail:state?.testDetail
                        }
                    });
                }}
                message={message}
            />
        </div>
    );
};

export default Screen2;
