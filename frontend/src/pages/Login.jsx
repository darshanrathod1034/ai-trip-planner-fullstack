import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { outline, skyline } from '../assets/assets';
import Background from '../components/Background';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5555/users/login', { 
        email, 
        password 
      }, { 
        withCredentials: true 
      });

      if (response.data.token) {
        login(response.data.token);
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center py-12 h-screen">
        <Background/>
        <div className="bg-white absolute p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              className="w-full mb-4 p-2 border rounded"
              placeholder="Email"
              type="email"
              name="email"  // Important for autocomplete
              id="email"    // Important for autocomplete
              autoComplete="username"  // Standard autocomplete value for emails/usernames
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full mb-4 p-2 border rounded"
              placeholder="Password"
              type="password"
              name="password"  // Important for autocomplete
              id="password"    // Important for autocomplete
              autoComplete="current-password"  // Standard autocomplete value for passwords
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="w-full bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-gray-700">
            Don't have an account? 
            <Link to="/signup" className="text-blue-600 ml-1 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;