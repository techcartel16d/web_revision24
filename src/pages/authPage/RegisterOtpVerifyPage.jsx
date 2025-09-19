import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { register, sendOtp } from '../../redux/authSlice';
import AlertModal from '../../components/AlertModal';
import SuccessModal from '../../components/SuccessModal';

const RegisterOtpVerifyPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation()
  const nav = useNavigate()
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // console.log("state", state)

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
      // console.log("response==>", res)
      if (res.status_code == 200) {
        setSuccess(res.message);
        setShowSuccess(true)
        setIsLoading(false);

      } else {
        setError(res.message);
        setIsLoading(false);
      }
    } catch (error) {
      // console.log("ERROR IN OTP SEND PAGE", error)
    } finally {
      setIsLoading(false)
    }

    // Replace this logic with actual API call

  };

  // const handleResend = () => {
  //   setOtp('');
  //   setSuccess('');
  //   setError('');
  //   // Add resend OTP logic here
  //   alert('OTP resent successfully.');
  // };

  const resendOtp = async (e) => {
    e.preventDefault();
    const mobile = state?.mobile
    try {
      const res = await dispatch(register({ mobile })).unwrap();
      if (res.status_code == 200) {
        setShowSuccess(true);
        setMessage(res.message)
        setOtp('');
        setSuccess('');
        setError('');
      }
    } catch (err) {
      setShowAlert(true);
      setMessage(`Failed to resend OTP. Try again later. ${err}`)
    }
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
          placeholder="Enter 4-digit OTP"
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
          onClick={resendOtp}
          className="w-full py-2 px-4 rounded-lg font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50"
        >
          Resend OTP
        </button>
      </form>
      <AlertModal
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false)
          setMessage('')
        }}
        // title="Commin"
        message={message}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false)
          nav('/user-set-password', { state: { mobile: state?.mobile } })
          setMessage('')
        }}
        message={message}
      />
    </div>
  );
};

export default RegisterOtpVerifyPage;
