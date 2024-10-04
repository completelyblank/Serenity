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
import Blog from './pages/blog.jsx';
import ChatRoom from './pages/chatRoom.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Home />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/form" element={<MoodLoggingForm />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/jumper" element={<Jumper_Game />} />
      <Route path="/quiz" element={<Quiz_Game />} />
      <Route path="/memory" element={<Memory_Game />} />
      <Route path="/bubbles" element={<BubblesGame />} />
      <Route path="/breathe" element={<BreathingExercise />} />
      <Route path="/games" element={<GameHandler />} />
      <Route path="/profile" element={<ProfilePage />} /> 
      <Route path="/blog" element={<Blog />} /> 
      <Route path="/chatroom/:id" element={<ChatRoom />} />
    </Routes>
  );
};

export default AppRoutes;
