// src/Routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login.jsx';
import DreamAnalysisForm from './pages/log.jsx';
import Home from './pages/home.jsx';
//import ProfilePage from './pages/profile.jsx';
// <Route path='/profile' element={<ProfilePage />} /> add this
import Analysis from './pages/analysis.jsx';
import Jumper_Game from './pages/jumper_game.jsx';
import Memory_Game from './pages/memory_game.jsx';
import Quiz_Game from './pages/quiz_game.jsx'
import MoodLoggingForm from './pages/log.jsx';
//import ProfilePage from './pages/profile.jsx';
import './index.css'
import BubblesGame from './pages/bubbles.jsx';
import GameHandler from './pages/Game_Handler.jsx';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Home />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/form" element={<MoodLoggingForm />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/jumper" element={<Jumper_Game />} />
      <Route path="/quiz" element={<Quiz_Game />} />
      <Route path="/memory" element={<Memory_Game />} />
      <Route path="/bubbles" element={<BubblesGame />} />
      <Route path="/games" element={<GameHandler />} />
    </Routes>
  );
};

export default AppRoutes;
