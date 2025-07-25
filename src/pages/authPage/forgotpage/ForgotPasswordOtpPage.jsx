import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPasswordSlice, verifyOtpSlice } from '../../../redux/authSlice';
import AlertModal from '../../../components/AlertModal';
import SuccessModal from '../../../components/SuccessModal';

const ForgotPasswordOtpPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(300); // 5 minutes
    const [loading, setLoading] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('')
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const mobile = location.state?.mobile || '';

    // Timer logic (fixed)
    useEffect(() => {
        if (timer === 0) return;
        const countdown = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(countdown);
    }, [timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (!/^\d{4}$/.test(otp)) {
            setError('Please enter a valid 4-digit OTP');
            return;
        }

        const verifyOtpData = {
            mobile,
            otp
        }

        try {
            const res = await dispatch(verifyOtpSlice(verifyOtpData)).unwrap();
            if (res.status_code == 200) {

                setLoading(false)
                setShowSuccess(true)
                setMessage(res.message)
                setError('');
            } else {
                // console.log("error in verify otp", res)
                setShowAlert(true)
                setMessage(res.message)

            }

        } catch (error) {
            // console.log("ERROR IN VERIFY OTP SLICE", error)
            setLoading(false)

        } finally {
            setLoading(false)
        }

    };

    const resendOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await dispatch(forgotPasswordSlice(mobile)).unwrap();
            if (res.status_code === 200) {
                alert(`OTP resent to ${mobile}`);
                setTimer(300);
            }
        } catch (err) {
            alert('Failed to resend OTP. Try again later.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Verify OTP</h2>
                <p className="text-center text-gray-600 mb-3">
                    Enter the 4-digit OTP sent to <span className="font-medium">{mobile}</span>
                </p>

                {/* Timer Display */}
                {timer > 0 && (
                    <p className="text-center text-sm text-red-500 font-semibold mb-4">
                        Resend available in {formatTime(timer)}
                    </p>
                )}

                <form onSubmit={handleVerify} className="space-y-5">
                    <div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))
                            }
                            className="w-full text-center text-lg px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter 4-digit OTP"
                            maxLength={4}
                        />
                        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {
                            loading ? "please wait...." : "Verify OTP"
                        }

                    </button>


                </form>
                <button
                    type="button"
                    onClick={resendOtp}
                    disabled={timer > 0}
                    className={`text-sm w-full text-center mt-2 py-2 rounded-md border transition ${timer > 0
                        ? 'text-gray-400 cursor-not-allowed border-gray-300'
                        : 'text-blue-600 hover:underline border-blue-300'
                        }`}
                >
                    Resend OTP
                </button>
            </div>
            <AlertModal
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                // title="Commin"
                message={message}
            />

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false)
                    navigate('/reset-password', { state: { mobile } })
                    setMessage('')
                }}
                message={message}
            />
        </div>
    );
};

export default ForgotPasswordOtpPage;
