import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { useSignInMutation } from '../../store/api';
import { setUser } from '../../store/appSlice';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signIn, { isLoading }] = useSignInMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await signIn({ email, password }).unwrap();
      console.log(response)
      if (response.success) {
        dispatch(setUser({ email: response.data.email, token: response.data.accessToken }));
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Signin failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-start justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-400 disabled:bg-yellow-700"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-white text-center mt-4">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-yellow-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};