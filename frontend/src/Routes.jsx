// src/Routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './App.jsx';
import Home from './pages/home.jsx';
//import ProfilePage from './pages/profile.jsx';
// <Route path='/profile' element={<ProfilePage />} /> add this
import Analysis from './pages/analysis.jsx';
import Cloud_Journey from './pages/cloud_journey.jsx';
import Memory_Game from './pages/memory_game.jsx';
import BreathingExercise from './pages/breather.jsx'
import MoodLoggingForm from './pages/log.jsx';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<HomePage />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/form" element={<MoodLoggingForm />} />
      <Route path="/" element={<Home />} />
      <Route path="/journey" element={<Cloud_Journey />} />
      <Route path="/breathe" element={<BreathingExercise />} />
      <Route path="/memory" element={<Memory_Game />} />
      
    </Routes>
  );
};

export default AppRoutes;
