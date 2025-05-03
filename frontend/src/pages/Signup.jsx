import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { outline, skyline } from '../assets/assets';
import Background from '../components/Background';

const Signup = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5555/auth/sendotp', { email });
      setMessage(response.data.message || 'OTP sent to your email.');
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    }
  };

  // Handle Signup with OTP Verification
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5555/auth/register', {
        fullname,
        email,
        password,
        otp,
      });

      setMessage(response.data.message || 'Signup successful! Redirecting...');
      
      // Redirect to Dashboard after 1.5 seconds
      setTimeout(() => navigate('/dashboard'), 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center py-12 h-screen">
       <Background/>
        <div className="bg-white absolute p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Join Trip Planner!</h2>

          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={otpSent ? handleSignup : handleSendOtp}>
            <input
              className="w-full mb-4 p-2 border rounded"
              placeholder="Enter Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {otpSent && (
              <>
                <input
                  className="w-full mb-4 p-2 border rounded"
                  placeholder="Enter OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <input
                  className="w-full mb-4 p-2 border rounded"
                  placeholder="Full Name"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
                <input
                  className="w-full mb-4 p-2 border rounded"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}

            <button className="w-full bg-blue-900 text-white px-4 py-2 rounded" type="submit">
              {otpSent ? 'Sign Up' : 'Send OTP'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-700">
            Already have an account?
            <Link to="/login" className="text-blue-600 ml-1">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
