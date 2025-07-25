import React, { useState } from 'react';
import InputField from '../../components/InputField';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { saveUserDataEncrypted } from '../../helpers/userStorage';

const LoginPage = () => {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const [formData, setFormData] = useState({ mobile: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.mobile) errs.mobile = 'Mobile number is required';
        if (!formData.password) errs.password = 'Password is required';
        return errs;
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const errs = validate();
    //     setErrors(errs);

    //     try {
    //         if (Object.keys(errs).length === 0) {
    //             setLoading(true)
    //             const res = await dispatch(login(formData)).unwrap();
    //             // console.log("responsive==>", res);
    //             setLoading(false)
    //             nav('/')

    //         }

    //     } catch (error) {
    //         // console.log("ERROR IN LOGIN PAGE====>", error)
    //         setLoading(false)

    //     } finally {
    //         setLoading(false)
    //     }

    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);

        try {
            if (Object.keys(errs).length === 0) {
                setLoading(true);
                const res = await dispatch(login(formData)).unwrap();
                // console.log("Login Response ==>", res);

                // ✅ Save user data securely in IndexedDB
                const userInfo = {
                    ...res.data, // user info
                    token: res.token, // add token manually if needed
                    subscription_status: res.subscription_status,
                    subscription_details: res.subscription_details
                };

                await saveUserDataEncrypted(userInfo);

                setLoading(false);
                nav('/');
            }
        } catch (error) {
            // console.log("ERROR IN LOGIN PAGE====>", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">

                {/* Left Illustration */}
                <div className="hidden md:flex w-1/2 bg-gray-200 items-center justify-center p-0">
                    <img
                        src="/loginbg.jpg" // Use your own image path
                        alt="login art"
                        className="w-full h-full"
                    />
                </div>

                {/* Right Form */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-bold text-center mb-6">Sign in</h2>
                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Mobile Number"
                            name="mobile"
                            type="tel"
                            placeholder="Enter your mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            error={errors.mobile}
                        />
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />
                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="text-sm">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            {
                                loading ? 'please wait..' : 'Log in'
                            }

                        </button>
                    </form>

                    <p className="text-sm text-center mt-4">
                        Don’t have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>

                    <div className="mt-6 text-center">
                        {/* <p className="text-sm mb-2">Or login with</p> */}
                        {/* <div className="flex justify-center space-x-3">
              <button className="bg-blue-600 text-white px-3 py-1 rounded">F</button>
              <button className="bg-sky-400 text-white px-3 py-1 rounded">T</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">G</button>
            </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
