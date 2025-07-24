import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendOtp } from '../../redux/authSlice';

const RegisterOtpVerifyPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation()
  const nav = useNavigate()
  console.log("state", state)

  const dispatch = useDispatch()

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');


    const userData = {
      mobile: state?.mobile,
      otp
    }

    try {

      const res = await dispatch(sendOtp(userData)).unwrap();
      console.log("response==>", res)
      if (res.status_code == 200) {
        setSuccess(res.message);
        nav('/user-set-password', {state:userData})
      } else {
        setError(res.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR IN OTP SEND PAGE", error)
    }

    // Replace this logic with actual API call

  };

  const handleResend = () => {
    setOtp('');
    setSuccess('');
    setError('');
    // Add resend OTP logic here
    alert('OTP resent successfully.');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">OTP Verification</h2>
      <p className='text-center text-md text-blue-400 my-2'>OTP SENT ON : {state && state.mobile}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter 6-digit OTP"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={isLoading || otp.length !== 4}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white ${isLoading || otp.length !== 4 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          className="w-full py-2 px-4 rounded-lg font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50"
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default RegisterOtpVerifyPage;
