// src/Routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './App.jsx';
import DreamAnalysisForm from './pages/log.jsx';
import Home from './pages/home.jsx';
//import ProfilePage from './pages/profile.jsx';

import Analysis from './pages/analysis.jsx';
import Jumper_Game from './pages/jumper_game.jsx';
import Memory_Game from './pages/memory_game.jsx';
import Quiz_Game from './pages/quiz_game.jsx'
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<HomePage />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/form" element={<DreamAnalysisForm />} />
      <Route path="/" element={<Home />} />
      <Route path="/jumper" element={<Jumper_Game />} />
      <Route path="/quiz" element={<Quiz_Game />} />
      <Route path="/memory" element={<Memory_Game />} />
    </Routes>
  );
};

export default AppRoutes;
