import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateForgotPasswordSlice } from '../../../redux/authSlice';
import AlertModal from '../../../components/AlertModal';
import SuccessModal from '../../../components/SuccessModal';

const SetNewPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const mobile = location.state?.mobile || '';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setError('');
        const updatePassword = {
            mobile,
            password: confirmPassword
        }

        try {
            const res = await dispatch(updateForgotPasswordSlice(updatePassword)).unwrap()
            if (res.status_code == 200) {
                setShowSuccess(true)
                setMessage(res.message);
            } else {
                setMessage(res.message)
                setShowAlert(true)
            }


        } catch (err) {
            setMessage(res.message)
            setShowAlert(true)
            setMessage('some thin went wrong try again !!')
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6">Set New Password</h2>
                <p className="text-center text-gray-600 mb-4">
                    Set a new password for mobile: <span className="font-medium">{mobile}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                className="absolute top-2 right-3 text-sm text-blue-500"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm new password"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Set Password
                    </button>
                </form>
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
                    navigate('/login')
                    setMessage('')
                }}
                message={message}
            />
        </div>
    );
};

export default SetNewPasswordPage;
