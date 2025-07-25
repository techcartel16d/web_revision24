import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordSlice } from '../../../redux/authSlice';
import SuccessModal from '../../../components/SuccessModal';
import ResumeTestModal from '../../../components/ResumeTestModal';
import ConfirmModal from '../../../components/ConfirmModal';
import AlertModal from '../../../components/AlertModal';

const ForgotPasswordPage = () => {
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(mobile)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            setLoading(true)
            const res = await dispatch(forgotPasswordSlice(mobile)).unwrap()
            if (res.status_code == 200) {
                setError('');
                setMessage(res.message)
                setShowSuccess(true)

            } else {
                setShowAlert(true)
                setMessage(res.message)
            }

        } catch (error) {
            // console.log("ERROR IN FORGOT PASSWORD PAGE", error)
            setShowAlert(true)
            setLoading(false)
            setMessage('some thin went wrong try again !!')


        } finally {
            setLoading(false)
        }


    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your mobile number"
                            maxLength={10}
                        />
                        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {
                            loading ? "Please wait....." : "Send OTP"
                        }

                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Remember your password?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>


                {/* <ResumeTestModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleResume}
                /> */}

                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false)
                        navigate('/forgot-password-verify-otp', { state: { mobile } });
                        setMessage('')
                    }}
                    message={message}
                />

                {/* <ConfirmModal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={() => {
                        setShowConfirm(false);
                        setShowSuccess(true);
                    }}
                    title="Confirm Deletion"
                    message="Do you really want to delete this item?"
                /> */}

                <AlertModal
                    isOpen={showAlert}
                    onClose={() => setShowAlert(false)}
                    // title="Commin"
                    message={message}
                />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
