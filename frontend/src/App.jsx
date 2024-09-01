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
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url("dream_home.jpg")` }}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner /> {/* Spinner component displayed while loading */}
        </div>
      ) : (
        <div className="flex w-3/4 p-1">
          {/* Left Side with Typewriter Effect */}
          <div className="w-3/4 p-6 mr-4">
            <div className="flex items-center mb-4 mr-6">
              <img
                src="src/assets/Dream_Catcher_Logo.png"
                alt="DreamCatcher Logo"
                className="mr-1"
                style={{ width: '250px', height: '200px' }}
              />
              <h1 className="text-white" style={{ fontSize: '3em', fontFamily: 'Poppins', textShadow: '10px 10px 10px #000000' }}>
                DreamCatcher
              </h1>
            </div>
            <Sparkle
              color="white"
              count={20}
              fadeOutSpeed={10}
              flicker={true}
              flickerSpeed="slowest"
              flickerAmount={0.025}
              minSize={10}
              maxSize={10}
              newSparkleOnFadeOut={true}
            />
            <div className="text-white">
              <Typewriter
                options={{
                  strings: ['Unlock the secrets of your dreams', 'Join our community', 'Explore the world of lucid dreaming'],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
          </div>
          {/* Right Side with Login/Signup Form */}
          <div className="w-1/2 p-4 bg-black bg-opacity-60 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 text-gold">Email</label>
                <input
                  type="email"
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-200">Password</label>
                <input
                  type="password"
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              {isSignup && (
                <div className="mb-4">
                  <label className="block mb-1 text-gray-200">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full p-2 rounded-lg bg-gray-700 text-white"
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
                className="w-full py-2 mt-4 bg-gray-200 text-black font-bold items-center flex-col rounded-lg hover:bg-yellow-500 transition duration-300"
              >
                {isSignup ? 'Sign Up' : 'Login'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                className="text-gray-200 hover:text-yellow-500 transition duration-300"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
            <div className="mt-4 text-center">
              <Link to="/home" className="text-gray-200 hover:text-yellow-500 transition duration-300">
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
