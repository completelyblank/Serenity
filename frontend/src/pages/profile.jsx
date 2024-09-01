/*import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Typewriter from 'typewriter-effect';
import Sparkle from 'react-sparkle';
import D3Chart from 'frontend/src/components/D3Chart.jsx'; // Assume D3Chart is a custom component you created
//import { getSpotifySong, getDreamAnalysis, getDreams, getDreamPatterns } from '../api'; // Placeholder for API calls

const ProfilePage = () => {
  const user = useSelector((state) => state.user); // Assuming user state is stored in Redux
  const [dreams, setDreams] = useState([]);
  const [song, setSong] = useState(null);
  const [analysis, setAnalysis] = useState({});
  const [patterns, setPatterns] = useState([]);

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
    };

    fetchData();
  }, [user.id]);

  return (
    <Sparkle>
      <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url("profile_background.jpg")` }}>
        <div className="w-3/4 bg-black bg-opacity-60 text-white rounded-lg p-6 shadow-lg backdrop-filter backdrop-blur-lg">
          <h1 className="text-6xl font-bold mb-4 text-gold animate-pulse">{user.name}'s Profile</h1>
          <h2 className="text-4xl font-semibold mb-4 text-gold">Dreams</h2>
          <ul className="mb-8 text-lg">
            {dreams.map((dream, index) => (
              <li key={index} className="mb-4">
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                  {dream.text}
                </div>
              </li>
            ))}
          </ul>

          {song && (
            <div className="mb-8">
              <h2 className="text-4xl font-semibold mb-4 text-gold">Spotify Song Recommendation</h2>
              <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                <p className="text-lg">{song.name} by {song.artist}</p>
                <iframe
                  src={`https://open.spotify.com/embed/track/${song.id}`}
                  width="300"
                  height="80"
                  frameBorder="0"
                  allow="encrypted-media"
                  className="rounded-lg mt-4"
                ></iframe>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-4xl font-semibold mb-4 text-gold">Dream Analysis</h2>
            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
              <p className="text-lg">{analysis.summary}</p>
              <p className="text-lg mt-4">Sentiment: {analysis.sentiment}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-semibold mb-4 text-gold">Dream Patterns</h2>
            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
              <D3Chart data={patterns} />
            </div>
          </div>
          
          {/* Add more sections as needed }
        </div>
      </div>
    </Sparkle>
  );
};

export default ProfilePage;*/
