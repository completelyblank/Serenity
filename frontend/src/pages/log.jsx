import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/spinner.jsx';
import { useUserContext } from '../../src/context/userContext';
import Monitor from '../components/monitor.jsx';

const MoodLoggingForm = () => {
  const navigate = useNavigate();
  const { userData } = useUserContext();
  const [moodTokens, setMoodTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [todayLogged, setTodayLogged] = useState(false);
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    if (!userData || Object.keys(userData).length === 0) {
      navigate('/');
    }
  }, [userData, navigate]);

  if (!userData || Object.keys(userData).length === 0) {
    return null;
  }

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
        setTodayLogged(data.todayLogging);
        setNewUser(data.response.newUser);
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
        {!todayLogged && (
          <Monitor moodTokens={moodTokens} isLogged={false} newUser={newUser}/>
        )}
        {todayLogged && (
          <Monitor moodTokens={moodTokens} isLogged={true} newUser={newUser}/>
        )}
      </div>
    </>
  );
};

export default MoodLoggingForm;