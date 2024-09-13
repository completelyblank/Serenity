import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Typewriter from 'typewriter-effect';
import Sparkle from 'react-sparkle';

import showPasswordImg from '../assets/eye.png';
import hidePasswordImg from '../assets/eye-slash.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [signUpError, setSignUpError] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    setIsError(false);
    const formErrors = {};
    if ((!username || !password) && !isSignup) {
      formErrors.required = 'All fields are required';
      setIsError(true);
    };
    if (isSignup && (!username || !password || !firstName || !lastName || !gender || !dateOfBirth)) {
      formErrors.required = 'All fields are required'
      setIsError(true);
    };
    if (isSignup && password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setPressed(true);
    setSignUpError(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/', { username, password, isSignup, firstName, lastName, gender, age});

      if (response.data.status === 1) {
        setIsSignup(false);
        setLoginError(false);
      } else {
        setSignUpError(true);
      }
    } catch (error) {
      navigate('/');
    }
  };

  const handleLogin = async (event) => {
    console.log('login');
    event.preventDefault();
    setPressed(true);
    setLoginError(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/', { username: username, password, isSignup });

      if (response.data.status === 1) {
        navigate('/login');
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen overflow-y-auto overflow-y-hidden relative" style={{ backgroundImage: `url("serene_login.png")` }}>
      <div className="flex w-full">
        {/* Left Side */}
        <div className="w-full flex flex-col text-center justify-center" style={{ alignItems: 'center' }}>
          <h1 className="fixed font-CoolVetica" style={{ fontSize: '6.3em', letterSpacing: '3px', color: '#70d4cc', marginTop: '-10%'}}>Serenity</h1>
          <div className="font-PoppinsBold" style={{ maxWidth: '700px', fontSize: '2em', color: '#70d4cc', overflowWrap: 'break-word', whiteSpace: 'normal', marginTop: '15%' }}>
            <Typewriter
              options={{
                strings: [
                  'Log and track your emotions securely',
                  'Earn Mood Tokens for premium features',
                  'Explore personalized mindfulness exercises',
                  'Engage with our real-time community forum',
                  'Unlock badges and rewards through gamification',
                  'Customize your profile and mood graphs',
                ],
                autoStart: true,
                loop: true,
                cursor: '|',
                delay: 80,
              }}
            />
          </div>
          <Sparkle color="blue" count={20} fadeOutSpeed={10} flicker={true} flickerSpeed="slowest" flickerAmount={0.025} minSize={10} maxSize={10} newSparkleOnFadeOut={true} />
        </div>
        {/* Right Side */}
        <div className="w-3/4 bg-gray-800 shadow-lg bg-opacity-90 font-PoppinsBold flex flex-col justify-center" style={{padding: '5%', height: '100vh', backgroundColor: '#0c1b19', opacity: '90%'}}>
          <h2 className="text-2xl font-bold mb-9 text-center" style={{ fontSize: '2.5em', color: '#70d4cc', letterSpacing: '3px'}}>
            {isSignup ? 'Sign Up' : 'Login'}
          </h2>
          <form onSubmit={isSignup ? handleSignUp : handleLogin}>
            <div className="mb-4">
              <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#70d4cc' }}>Username</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg bg-gray-700 border border-teal-500 text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={`flex mb-4 ${isSignup ? 'space-x-4' : 'flex-col'}`}>
              <div className={`w-${isSignup ? '1/2' : 'full'}`}>
                <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#70d4cc' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full p-2 rounded-lg bg-gray-700 text-white border border-teal-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <img
                    src={showPassword ? hidePasswordImg : showPasswordImg}
                    alt={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 cursor-pointer"
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
              </div>
              {isSignup && (
                <div className="w-1/2">
                  <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#70d4cc' }}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full p-2 rounded-lg bg-gray-700 text-white border border-teal-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <img
                      src={showConfirmPassword ? hidePasswordImg : showPasswordImg}
                      alt={showConfirmPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2 cursor-pointer"
                      style={{ width: '24px', height: '24px' }}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              )}
            </div>
            {isSignup && (
              <div className="flex mb-4 space-x-4">
                <div className="w-1/2 pr-2">
                  <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#70d4cc' }}>First Name</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg bg-gray-700 text-white border border-teal-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#70d4cc' }}>Last Name</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg bg-gray-700 text-white border border-teal-500"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}
            {isSignup && (
              <div className="flex mb-4 space-x-4">
                <div className="w-1/2 pr-2">
                  <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#70d4cc' }}>Age</label>
                  <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    min="0" 
                    max="120"
                    className="w-full p-2 rounded-lg bg-gray-700 text-white border border-teal-500 pr-2"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#70d4cc' }}>Gender</label>
                  <select
                    className="w-full p-2 rounded-lg bg-gray-700 text-white border border-teal-500"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full p-2 bg-teal-500 text-white rounded-lg font-PoppinsBold mt-4"
              disabled={loading}
              style={{fontSize: '1.2em'}}
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </button>
            {loginError && <p className="text-red-500 text-center mt-4">Username or Password is Incorrect</p>}
            {isError && <p className="text-red-500 text-center mt-2">All Fields Are Required!</p>}
            {signUpError && <p className="text-red-500 text-center mt-2">Username Already Taken</p>}
          </form>
          <p className="text-center mt-4">

            <button
              type="button"
              onClick={() => {setIsSignup(!isSignup), setLoginError(false), setSignUpError(false), setIsError(false), setUsername(''), setPassword(''), setConfirmPassword(''), setAge('')}}
              className="text-teal-500 font-PoppinsBold"
              style={{fontSize: '1.1em', marginTop: '-5%'}}
            >
              {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
