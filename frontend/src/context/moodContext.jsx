import React, { createContext, useContext, useEffect, useState } from 'react';

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [moodData, setMoodData] = useState(() => {
    // Load initial user data from localStorage
    const storedMoodData = localStorage.getItem('moodData');
    return storedMoodData ? JSON.parse(storedMoodData) : null; // Parse JSON or set to null if not available
  });

  useEffect(() => {
    // Update localStorage whenever userData changes
    if (moodData) {
      localStorage.setItem('moodData', JSON.stringify(moodData));
    } else {
      localStorage.removeItem('moodData'); // Remove if no userData
    }
  }, [moodData]);

  return (
    <MoodContext.Provider value={{ moodData, setMoodData }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMoodContext = () => useContext(MoodContext);
