import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import Sparkle from 'react-sparkle';
import Spinner from './components/spinner'; 

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url("serenity_login.png")` }}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner /> {/* Spinner component displayed while loading */}
        </div>
      ) : (
        <div className="flex w-3/4 p-4">
          {/* Left Side with Typewriter Effect */}
          <div className="w-3/4 p-6 mr-4">
            <div className="flex items-center mb-4 mr-6">
              <h1 className="text-white" style={{ fontSize: '3em', fontFamily: 'Poppins', textShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)' }}>
                Serenity
              </h1>
            </div>
            <Sparkle
              color="pink"
              count={20}
              fadeOutSpeed={10}
              flicker={true}
              flickerSpeed="slowest"
              flickerAmount={0.025}
              minSize={10}
              maxSize={10}
              newSparkleOnFadeOut={true}
            />
            <div className="text-white text-lg">
              <Typewriter
                options={{
                  strings: ['Log and track your emotions securely',
                    'Earn Mood Tokens for premium features',
                    'Explore personalized mindfulness exercises',
                    'Engage with our real-time community forum',
                    'Unlock badges and rewards through gamification',
                    'Customize your profile and mood graphs'],
                    autoStart: true,
                  loop: true,
                  cursor: '•',
                }}
              />
            </div>
          </div>
          {/* Right Side with Login/Signup Form */}
          <div className="w-1/2 p-4 bg-yellow-900 text-gray-800 rounded-lg shadow-lg bg-opacity-50">
            <h2 className="text-2xl font-bold mb-4 text-pink-300">{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 text-pink-300">Email</label>
                <input
                  type="email"
                  className="w-full p-2 rounded-lg bg-gray-100 text-gray-800 border border-pink-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-300 text-sm">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-pink-300">Password</label>
                <input
                  type="password"
                  className="w-full p-2 rounded-lg bg-gray-100 text-gray-800 border border-pink-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-700 text-sm">{errors.password}</p>}
              </div>
              {isSignup && (
                <div className="mb-4">
                  <label className="block mb-1 text-pink-300">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full p-2 rounded-lg bg-gray-100 text-gray-800 border border-pink-300"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-700 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-pink-900 text-white font-bold rounded-lg hover:bg-pink-700 transition duration-300"
              >
                {isSignup ? 'Sign Up' : 'Login'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                className="text-pink-300 hover:text-white transition duration-300"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
            <div className="mt-4 text-center">
              <Link to="/" className="text-pink-300 hover:text-white transition duration-300">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
