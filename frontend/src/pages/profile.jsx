import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sparkle from 'react-sparkle';
import D3Chart from '../components/D3Chart.jsx'; // Assuming you have a D3Chart component
import { useParams } from 'react-router-dom';
import axios from 'axios';

// API calls for dreams, song, analysis, patterns, and user preferences
const getDreams = async (userId, token) => {
  const response = await axios.get(`/user/${userId}/dreams`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getSpotifySong = async (userId, token) => {
  const response = await axios.get(`/user/${userId}/song`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getDreamAnalysis = async (userId, token) => {
  const response = await axios.get(`/user/${userId}/analysis`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getDreamPatterns = async (userId, token) => {
  const response = await axios.get(`/user/${userId}/patterns`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getUserPreferences = async (userId, token) => {
  const response = await axios.get(`/user/${userId}/preferences`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const saveUserPreferences = async (userId, preferences, token) => {
  await axios.post(`/user/${userId}/preferences`, preferences, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const ProfilePage = () => {
  const { userId } = useParams(); // Get userId from the URL
  const token = useSelector((state) => state.auth.token); // Assuming token is stored in Redux
  const user = useSelector((state) => state.auth.user); // Assuming user data is stored in Redux

  const [dreams, setDreams] = useState([]);
  const [song, setSong] = useState(null);
  const [analysis, setAnalysis] = useState({});
  const [patterns, setPatterns] = useState([]);

  const [backgroundImage, setBackgroundImage] = useState('profile_background.jpg');
  const [backgroundColor, setBackgroundColor] = useState('rgba(0, 0, 0, 0.7)');
  const [headerColor, setHeaderColor] = useState('#FFD700');
  const [graphColor, setGraphColor] = useState('#00FF00');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId && token) {
          const userDreams = await getDreams(userId, token);
          setDreams(userDreams);

          const songData = await getSpotifySong(userId, token);
          setSong(songData);

          const analysisData = await getDreamAnalysis(userId, token);
          setAnalysis(analysisData);

          const patternsData = await getDreamPatterns(userId, token);
          setPatterns(patternsData);

          const preferences = await getUserPreferences(userId, token);
          setBackgroundImage(preferences.backgroundImage || 'profile_background.jpg');
          setBackgroundColor(preferences.backgroundColor || 'rgba(0, 0, 0, 0.7)');
          setHeaderColor(preferences.headerColor || '#FFD700');
          setGraphColor(preferences.graphColor || '#00FF00');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId, token]);

  // Handlers for changing user preferences
  const handleBackgroundImageChange = (e) => {
    const image = e.target.value;
    setBackgroundImage(image);
    saveUserPreferences(userId, { backgroundImage: image }, token);
  };

  const handleBackgroundColorChange = (e) => {
    const color = e.target.value;
    setBackgroundColor(color);
    saveUserPreferences(userId, { backgroundColor: color }, token);
  };

  const handleHeaderColorChange = (e) => {
    const color = e.target.value;
    setHeaderColor(color);
    saveUserPreferences(userId, { headerColor: color }, token);
  };

  const handleGraphColorChange = (e) => {
    const color = e.target.value;
    setGraphColor(color);
    saveUserPreferences(userId, { graphColor: color }, token);
  };

  return (
    <Sparkle>
      <div 
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: backgroundColor,
        }}
      >
        <div 
          className="w-full max-w-4xl p-8 bg-opacity-50 text-white rounded-lg shadow-2xl backdrop-filter backdrop-blur-md"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)' }}
        >
          <h1 
            className="text-6xl font-bold mb-8 text-center animate-pulse"
            style={{ color: headerColor, textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}
          >
            {user?.name || 'User'}'s Profile
          </h1>

          {/* Customization Form */}
          <div className="space-y-4">
            <div>
              <label>Background Image URL: </label>
              <input type="text" value={backgroundImage} onChange={handleBackgroundImageChange} className="input" />
            </div>
            <div>
              <label>Background Color: </label>
              <input type="color" value={backgroundColor} onChange={handleBackgroundColorChange} className="input" />
            </div>
            <div>
              <label>Header Color: </label>
              <input type="color" value={headerColor} onChange={handleHeaderColorChange} className="input" />
            </div>
            <div>
              <label>Graph Color: </label>
              <input type="color" value={graphColor} onChange={handleGraphColorChange} className="input" />
            </div>
          </div>

          {/* Displaying Dreams, Song, Analysis, and Patterns */}
          <div className="mt-8">
            <h2 className="text-3xl mb-4" style={{ color: headerColor }}>Dreams</h2>
            <ul>
              {dreams.map((dream, index) => (
                <li key={index} className="mb-2">
                  {dream.description}
                </li>
              ))}
            </ul>

            <h2 className="text-3xl mt-8" style={{ color: headerColor }}>Spotify Song</h2>
            {song ? (
              <p>Song most alike you: {song.name} by {song.artist}</p>
            ) : (
              <p>No song found</p>
            )}

            <h2 className="text-3xl mt-8" style={{ color: headerColor }}>Dream Analysis</h2>
            <p>{analysis.summary || 'No analysis available'}</p>

            <h2 className="text-3xl mt-8" style={{ color: headerColor }}>Dream Patterns</h2>
            <D3Chart data={patterns} color={graphColor} />
          </div>
        </div>
      </div>
    </Sparkle>
  );
};

export default ProfilePage;
