import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login.jsx';
import DreamAnalysisForm from './pages/log.jsx';
import Home from './pages/home.jsx';
import Analysis from './pages/analysis.jsx';
import Jumper_Game from './pages/jumper_game.jsx';
import Memory_Game from './pages/memory_game.jsx';
import Quiz_Game from './pages/quiz_game.jsx';
import MoodLoggingForm from './pages/log.jsx';
import ProfilePage from './pages/profile.jsx';
import BubblesGame from './pages/bubbles.jsx';
import BreathingExercise from './pages/breather.jsx';
import GameHandler from './pages/Game_Handler.jsx';
import './index.css';

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
      <Route path="/breathe" element={<BreathingExercise />} />
      <Route path="/games" element={<GameHandler />} />
      {/* Dynamic route for user profile */}
      <Route path="/profile/:user_id" element={<ProfilePage />} />
      <Route path="/profile" element={<ProfilePage />} /> {/* Fallback for missing user_id */}
    </Routes>
  );
};

export default AppRoutes;
