import React, { useState } from 'react';  // Import useState
import JumperGame from './JumperGame';
import Memory_Game from './pages/memory_game';
import Quiz_Game from './pages/quiz_game';

const App = () => {
  const [dreamTokens, setDreamTokens] = useState(0);

  const handleMilestone = (tokens) => {
    setDreamTokens(dreamTokens + tokens);
  };

  return (
    <div className="app">
      <div className="navbar">
        <h1>Dream Token Games</h1>
        <div>Dream Tokens: {dreamTokens}</div>
      </div>
      <JumperGame onMilestone={handleMilestone} />
      <Quiz_Game onMilestone={handleMilestone} />
      <Memory_Game onMilestone={handleMilestone} />
    </div>
  );
};

export default App;
