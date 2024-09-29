import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { useUserContext } from '../../src/context/userContext';
import ReactToPrint from 'react-to-print';
import html2canvas from 'html2canvas';
import axios from 'axios';

// Define themes
const themes = {
  theme1: {
    name: "Serenity Original",
    backgroundColor: '#16423C',
    textColor: '#b2dfdb',
    borderColor: '#072420',
  },
  theme2: {
    name: "Ocean Breeze",
    backgroundColor: '#5385e4',
    textColor: '#FFFFFF',
    borderColor: '#145ee7',
  },
  theme3: {
    name: "Midnight Depths",
    backgroundColor: '#00246B',
    textColor: '#CADCFC',
    borderColor: '#02163d',
  },
  theme4: {
    name: "Forest Whisper",
    backgroundColor: '#2C5F2D',
    textColor: '#97BC62',
    borderColor: '#1d501e',
  },
  theme5: {
    name: "Crimson Blossom",
    backgroundColor: '#CC313D',
    textColor: '#F7C5CC',
    borderColor: '#a7101c',
  },
  theme6: {
    name: "Emerald Serenity",
    backgroundColor: '#31473A',
    textColor: '#EDF4F2',
    borderColor: '#173824',
  },
  theme7: {
    name: "Lavender Dreams",
    backgroundColor: '#735DA5',
    textColor: '#D3C5E5',
    borderColor: '#48386e',
  },
  theme8: {
    name: "Sunset Glow",
    backgroundColor: '#304c77',
    textColor: '#ecf02b',
    borderColor: '#082450',
  }
};

const ProfilePage = () => {
  const { userData } = useUserContext();
  const { setUserData } = useUserContext();
  const componentRef = useRef();

  const downloadProfileJPG = async () => {
    const element = componentRef.current;
    if (element) {
      const canvas = await html2canvas(element, { useCORS: true });
      const dataURL = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'profile.jpg';
      link.click();
    }
  };

  // State for the current theme
  let themeNum = `theme${userData.theme}`;
  let imageNum = userData.userID % 10;
  const [currentTheme, setCurrentTheme] = useState(themes[themeNum]);
  const [randomQuote, setRandomQuote] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(`theme${userData.theme}`); // Track selected theme
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/profile');
        const data = response.data;
        setQuote(data.QUOTE);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch quote. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // Handler for changing theme
  const handleThemeChange = async (event) => {
    const theme = event.target.value;
    setCurrentTheme(themes[theme]);
    setSelectedTheme(theme); // Update selected theme
    try {
      const themeNumber = parseInt(theme.replace(/\D/g, ''), 10);
      const response = await axios.post('http://localhost:3000/profile', { username: userData.username, theme: themeNumber });
      setUserData({ username: userData.username, firstName: userData.firstName, lastName: userData.lastName, gender: userData.gender, age: userData.age, theme: themeNumber });
    } catch (error) {
      console.log("error changing themes");
    }
  };

  return (
    <div
      className="h-screen overflow-y-auto relative bg-cover bg-center"
      style={{
        backgroundColor: '#c1e4e7',
        backgroundImage: 'url("sky.jpg")',
      }}
    >
      <Navbar />

      {/* Main Profile Box */}
      <div
        ref={componentRef}
        className="flex flex-col lg:flex-row items-stretch justify-center w-11/12 mx-auto lg:mt-20 bg-white shadow-lg rounded-lg"
        style={{
          backgroundColor: currentTheme.backgroundColor,
          opacity: 0.95,
          marginTop: '10%',
          minHeight: '100vh',
          marginBottom: '5%',
        }}
      >
        {/* Left Profile Info */}
        <div
          className="w-full lg:w-1/3 flex flex-col items-center p-6 lg:p-12 border-r-4"
          style={{
            backgroundColor: currentTheme.backgroundColor,
            borderColor: currentTheme.borderColor,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTopLeftRadius: '30px',
            borderBottomLeftRadius: '30px'
          }}
        >
          {/* Avatar */}
          <div
            className="w-32 h-32 lg:w-64 lg:h-64 rounded-full bg-center bg-cover mb-6"
            style={{
              border: `6px solid ${currentTheme.borderColor}`,
              backgroundImage: userData.gender === 'F' ? `url(girls/${imageNum}.jpg)` : `url(boys/${imageNum}.jpg)`,
            }}
          />
          {/* User Info */}
          <div style={{ textAlign: 'center' }}>
            <p className="text-lg lg:text-2xl mb-4 font-PoppinsBold" style={{ color: currentTheme.textColor }}>
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-lg lg:text-2xl font-PoppinsBold" style={{ color: currentTheme.textColor }}>
              Age: {userData.age}
            </p>
          </div>

          {/* Theme Selector */}
          <div className="mb-4 mt-8 w-full">
            <label className="text-lg font-PoppinsBold mb-2 block text-center" style={{ color: currentTheme.textColor }}>
              Select Theme
            </label>
            <select
              value={selectedTheme}
              onChange={handleThemeChange}
              className="w-full p-2 text-center rounded border font-PoppinsBold"
              style={{
                backgroundColor: currentTheme.textColor,
                color: currentTheme.backgroundColor,
                borderColor: currentTheme.textColor,
              }}
            >
              {Object.keys(themes).map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {themes[themeKey].name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="mt-8 w-full flex flex-col gap-4" style={{ marginTop: 'auto' }}>
            <button className="px-4 py-2 bg-yellow-500 text-white font-PoppinsBold rounded-lg shadow-md hover:bg-yellow-600">
              Change Password
            </button>
            <button className="px-4 py-2 bg-red-500 text-white font-PoppinsBold rounded-lg shadow-md hover:bg-red-600">
              Delete Account
            </button>
            <button
              onClick={downloadProfileJPG}
              className="px-4 py-2 bg-green-500 text-white font-PoppinsBold rounded-lg shadow-md hover:bg-green-600"
            >
              Download Profile JPG
            </button>
          </div>
        </div>

        {/* Right Content Section */}
        <div className="w-full lg:w-2/3 p-6 lg:p-12 flex flex-col justify-center text-center"
          style={{
            borderRadius: '30px'
          }}>
          <h2 className="text-4xl lg:text-6xl font-CoolVetica" style={{ color: currentTheme.textColor }}>
            Your Profile
          </h2>

          {/* Activity Trends */}
          <div className="mt-8">
            <h3 className="text-xl lg:text-2xl mb-4 font-PoppinsBold" style={{ color: currentTheme.textColor }}>
              Activity Trends
            </h3>
            <div className="w-full h-48 lg:h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: currentTheme.borderColor }}>
              <p className="text-gray-500">Activity chart coming soon...</p>
            </div>
          </div>

          {/* Spotify Widgets */}
          <div className="mt-12">
            <h3 className="text-xl lg:text-2xl mb-4 font-PoppinsBold" style={{ color: currentTheme.textColor }}>
              Your Spotify Playlist
            </h3>
            <div className="w-full h-96 rounded-lg shadow-lg">
              <iframe
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
                width="100%"
                height="380"
                allow="encrypted-media"
                title="Spotify Playlist"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
