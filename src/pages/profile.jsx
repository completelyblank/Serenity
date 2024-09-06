/*import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sparkle from 'react-sparkle';
import D3Chart from 'frontend/src/components/D3Chart.jsx';

const ProfilePage = () => {
  const user = useSelector((state) => state.user); // Assuming user state is stored in Redux
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
      const userDreams = await getDreams(user.id);
      setDreams(userDreams);

      const songData = await getSpotifySong(user.id);
      setSong(songData);

      const analysisData = await getDreamAnalysis(user.id);
      setAnalysis(analysisData);

      const patternsData = await getDreamPatterns(user.id);
      setPatterns(patternsData);

      // Fetch user customization preferences
      const preferences = await getUserPreferences(user.id);
      setBackgroundImage(preferences.backgroundImage || 'profile_background.jpg');
      setBackgroundColor(preferences.backgroundColor || 'rgba(0, 0, 0, 0.7)');
      setHeaderColor(preferences.headerColor || '#FFD700');
      setGraphColor(preferences.graphColor || '#00FF00');
    };

    fetchData();
  }, [user.id]);

  const handleBackgroundImageChange = (e) => {
    const image = e.target.value;
    setBackgroundImage(image);
    saveUserPreferences(user.id, { backgroundImage: image });
  };

  const handleBackgroundColorChange = (e) => {
    const color = e.target.value;
    setBackgroundColor(color);
    saveUserPreferences(user.id, { backgroundColor: color });
  };

  const handleHeaderColorChange = (e) => {
    const color = e.target.value;
    setHeaderColor(color);
    saveUserPreferences(user.id, { headerColor: color });
  };

  const handleGraphColorChange = (e) => {
    const color = e.target.value;
    setGraphColor(color);
    saveUserPreferences(user.id, { graphColor: color });
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
        <div className="w-full max-w-4xl p-8 bg-opacity-50 text-white rounded-lg shadow-2xl backdrop-filter backdrop-blur-md"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)' }}
        >
          <h1 
            className="text-6xl font-bold mb-8 text-center animate-pulse"
            style={{ color: headerColor, textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}
          >
            {user.name}'s Profile
          </h1>

          <div className="mb-10">
            <h2 className="text-4xl font-semibold mb-4" style={{ color: headerColor }}>Customize Profile</h2>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
              <label className="block mb-4 text-lg">
                Background Image URL:
                <input
                  type="text"
                  className="w-full mt-2 p-3 rounded-lg bg-gray-700 bg-opacity-60 text-white"
                  placeholder="Enter image URL..."
                  value={backgroundImage}
                  onChange={handleBackgroundImageChange}
                />
              </label>

              <label className="block mb-4 text-lg">
                Background Color:
                <input
                  type="color"
                  className="w-full mt-2 p-3 rounded-lg"
                  value={backgroundColor}
                  onChange={handleBackgroundColorChange}
                />
              </label>

              <label className="block mb-4 text-lg">
                Header Color:
                <input
                  type="color"
                  className="w-full mt-2 p-3 rounded-lg"
                  value={headerColor}
                  onChange={handleHeaderColorChange}
                />
              </label>

              <label className="block text-lg">
                Graph Color:
                <input
                  type="color"
                  className="w-full mt-2 p-3 rounded-lg"
                  value={graphColor}
                  onChange={handleGraphColorChange}
                />
              </label>
            </div>
          </div>

          <h2 className="text-4xl font-semibold mb-8 text-center" style={{ color: headerColor }}>Dreams</h2>
          <ul className="mb-12 text-lg">
            {dreams.map((dream, index) => (
              <li key={index} className="mb-6">
                <div className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
                  {dream.text}
                </div>
              </li>
            ))}
          </ul>

          {song && (
            <div className="mb-12">
              <h2 className="text-4xl font-semibold mb-8 text-center" style={{ color: headerColor }}>Spotify Song Recommendation</h2>
              <div className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
                <p className="text-lg">{song.name} by {song.artist}</p>
                <iframe
                  src={`https://open.spotify.com/embed/track/${song.id}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="encrypted-media"
                  className="rounded-lg mt-4"
                ></iframe>
              </div>
            </div>
          )}

          <div className="mb-12">
            <h2 className="text-4xl font-semibold mb-8 text-center" style={{ color: headerColor }}>Dream Analysis</h2>
            <div className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
              <p className="text-lg">{analysis.summary}</p>
              <p className="text-lg mt-4">Sentiment: {analysis.sentiment}</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-semibold mb-8 text-center" style={{ color: headerColor }}>Dream Patterns</h2>
            <div className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
              <D3Chart data={patterns} color={graphColor} />
            </div>
          </div>

          {/* Add more sections as needed */
          /*
        </div>
      </div>
    </Sparkle>
  );
};

export default ProfilePage;
*/