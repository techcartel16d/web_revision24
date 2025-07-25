import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPin } from '../../redux/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserDataDecrypted, saveUserDataEncrypted } from '../../helpers/userStorage';

const RegisterSetPasswordPage = () => {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const [userInfo, setUserInfo] = useState(null);
    const { state } = useLocation()
    // console.log("state", state)
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };







    // return
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { password, confirmPassword } = formData;

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const pinData = {
            mobile: state?.mobile,
            password: confirmPassword,
            referral_code: '',
            fcm_token: '',
        };

        try {
            const res = await dispatch(setPin(pinData)).unwrap()
            // console.log("register response", res)


            if (res.status_code == 200) {
                const userInfo = {
                    ...res.data, // user info
                    token: res.token, // add token manually if needed
                    subscription_status: res.subscription_status || '',
                    subscription_details: res.subscription_details || ''
                };

                await saveUserDataEncrypted(userInfo);

                // console.log(res.message)
                nav("/user-details")
            }
        } catch (error) {

            // console.log("error in set pasword", error)

        }




        setError('');
        // console.log('Password Set Successfully:', password);
        // Submit password to API here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Set Your Password</h2>
                {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block mb-1 font-medium">New Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Set Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterSetPasswordPage;
