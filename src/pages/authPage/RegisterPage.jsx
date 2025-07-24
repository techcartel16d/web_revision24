import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this
import InputField from '../../components/InputField';
import { useDispatch } from 'react-redux';
import { register, sendOtp } from '../../redux/authSlice';

const RegisterPage = () => {
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch()

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      const res = await dispatch(register({mobile})).unwrap()
      if (res.status_code == 200) {
        navigate("/verify-otp", { state: { mobile } })
      } else {
        alert(res.message)
      }
    } catch (error) {

    }



    // Optionally navigate to OTP verification page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg flex max-w-4xl w-full overflow-hidden">
        {/* Left illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 bg-gray-100">
          <img src={"/loginbg.jpg"} alt="Register" className="max-w-full h-auto" />
        </div>

        {/* Right form section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

          <form onSubmit={handleSendOtp}>
            <InputField
              label="Mobile Number"
              name="mobile"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </form>

          {/* Login redirect */}
          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <button

              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
