import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar.jsx';
import axios from 'axios';
import Spinner from '../components/spinner.jsx';
import bookImg from '/book2.png';
import { useUserContext } from '../../src/context/userContext';
import Monitor from '../components/monitor.jsx';

const MoodLoggingForm = () => {
  const [moodStatus, setMoodStatus] = useState(false);
  const { userData } = useUserContext();
  const [emotion, setEmotion] = useState('');
  const [moodTokens, setMoodTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    let spinnerTimeout;
    const fetchData = async () => {
      try {
        const spinnerTimeout = setTimeout(() => {
          setShowSpinner(false);
        }, 1000);

        const response = await axios.get('http://localhost:3000/form', { params: { userID: userData.userID } });
        const data = response.data;
        setMoodTokens(data.tokens || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        clearTimeout(spinnerTimeout);
      }
    };

    fetchData();
  }, []);

  // Show spinner while loading
  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#b2dfdb' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  // Function to navigate between steps
  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <Navbar />
      <div className="fixed top-0 left-0 right-0 bottom-0 p-20"
        style={{
          backgroundImage: 'url("city.jpg")',
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          overflow: 'hidden'
        }}>
        <Monitor moodTokens={moodTokens} />
      </div>
    </>
  );
};

export default MoodLoggingForm;