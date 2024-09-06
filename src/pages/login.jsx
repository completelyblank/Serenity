import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/spinner'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    let formErrors = {};
    if (!email) formErrors.email = 'Email is required';
    if (!password) formErrors.password = 'Password is required';
    if (isSignup && password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission (e.g., call an API)
      console.log('Form submitted');
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(serenity_login.png)` }}
    >
      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg w-80 bg-opacity-90">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner /> {/* Spinner component displayed while loading */}
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-pink-600">
              {isSignup ? 'Sign Up' : 'Login'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 text-pink-600">Email</label>
                <input
                  type="email"
                  className="w-full p-2 rounded-lg bg-gray-100 text-gray-800 border border-pink-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-pink-600">Password</label>
                <input
                  type="password"
                  className="w-full p-2 rounded-lg bg-gray-100 text-gray-800 border border-pink-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              {isSignup && (
                <div className="mb-4">
                  <label className="block mb-1 text-pink-600">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full p-2 rounded-lg bg-gray-100 text-gray-800 border border-pink-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-pink-600 text-white font-bold rounded-lg border border-pink-500 hover:bg-pink-700 transition duration-300"
              >
                {isSignup ? 'Sign Up' : 'Login'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                className="text-pink-600 hover:text-pink-800 transition duration-300"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup
                  ? 'Already have an account? Login'
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
            <div className="mt-4 text-center">
              <Link to="/" className="text-pink-600 hover:text-pink-800 transition duration-300">
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
