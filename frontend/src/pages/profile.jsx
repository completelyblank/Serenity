import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { useUserContext } from '../../src/context/userContext';
import ReactToPrint from 'react-to-print';
import html2canvas from 'html2canvas';

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
  const [currentTheme, setCurrentTheme] = useState(themes.theme1);
  const [randomQuote, setRandomQuote] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('theme1'); // Track selected theme

  // Random daily quote
  const quotes = [
    "A quotation is the repetition of a sentence, phrase, or passage from speech or text that someone has said or written",
    "Believe in yourself.",
    "Every day is a new beginning."
  ];

  // Handler for changing theme
  const handleThemeChange = (event) => {
    const theme = event.target.value;
    setCurrentTheme(themes[theme]);
    setSelectedTheme(theme); // Update selected theme
  };

  useEffect(() => {
    // Select a random quote when the component mounts
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div
      className="h-screen overflow-y-auto overflow-x-hidden relative"
      style={{
        backgroundColor: '#c1e4e7',
        backgroundImage: 'url("sky.jpg")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '220vh',
      }}
    >
      <Navbar />

      {/* Main Profile Box */}
      <div
        ref={componentRef}
        className="flex items-center justify-center"
        style={{
          width: '90%',
          height: '80%',
          backgroundColor: currentTheme.backgroundColor,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          opacity: 0.95
        }}
      >
        {/* Left Profile Info */}
        <div
          style={{
            width: '30%',
            height: '100%',
            backgroundColor: currentTheme.backgroundColor,
            borderRight: `4px solid ${currentTheme.borderColor}`, // Change border color to custom border color
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: '8px',
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '66%',
              height: '20%',
              border: `6px solid ${currentTheme.borderColor}`,
              backgroundImage: userData.gender == 'F' ? 'url("../src/assets/girlAvatar.jpg")' : 'url("../src/assets/boyAvatar.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '50%',
              marginTop: '20%',
            }}
          />

          {/* User Info */}
          <p className="text-lg mb-4 mt-8 font-PoppinsBold"
            style={{
              fontSize: '1.5em',
              paddingTop: '1%',
              paddingBottom: '1%',
              color: currentTheme.textColor,
            }}
          >
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-lg mb-4 font-PoppinsBold"
            style={{
              fontSize: '1.5em',
              paddingBottom: '1%',
              color: currentTheme.textColor,
            }}
          >
            Age: {userData.age}
          </p>

          {/* Theme Selector Dropdown */}
          <div className="mb-4 flex flex-col items-center"> {/* Added flex and center alignment */}
            <label className="text-lg font-PoppinsBold" style={{ color: currentTheme.textColor }}>Select Theme</label>
            <select
              value={selectedTheme}
              onChange={handleThemeChange}
              className="mt-2 p-2 pr-3 pl-3 rounded border"
              style={{
                backgroundColor: currentTheme.textColor,
                color: currentTheme.backgroundColor,
                borderColor: currentTheme.textColor,
                textAlign: 'center',
                fontFamily: 'PoppinsBold',
                fontSize: '1.1em',
                borderRadius: '20px'
              }}
            >
              {Object.keys(themes).map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {themes[themeKey].name}  {/* Display theme name */}
                </option>
              ))}
            </select>
          </div>

          {/* Daily Motivation */}
          <div style={{ textAlign: 'center', marginBottom: '-100%', marginTop: '15%' }}>
            <h3 className="text-xl mb-2" style={{ fontFamily: 'PoppinsBold', color: currentTheme.textColor }}>
              Daily Motivation
            </h3>
            <div
              style={{ 
                borderRadius: '8px',
                padding: '20px', 
                display: 'inline-block',
                maxWidth: '80%', 
                margin: '0 auto', 
                marginTop: '5%',
                backgroundColor: currentTheme.borderColor 
              }}
            >
              <p
                className='italic'
                style={{
                  fontFamily: 'PoppinsBold',
                  color: currentTheme.textColor,
                  fontSize: '1.3em',
                  textAlign: 'center',
                }}
              >
                "{randomQuote}"
              </p>
            </div>
          </div>


          {/* Buttons for Changing Password, Deleting Account, and Downloading Profile */}
          <div className="absolute mt-8 flex flex-col gap-4" style={{ marginTop: '77%' }}>
            <button className="px-4 py-2 bg-yellow-500 text-white font-PoppinsBold rounded-lg shadow-md hover:bg-yellow-600">
              Change Password
            </button>
            <button className="px-4 py-2 bg-red-500 text-white font-PoppinsBold rounded-lg shadow-md hover:bg-red-600">
              Delete Account
            </button>
            <button
              onClick={downloadProfileJPG}
              className="px-4 py-2 bg-green-500 text-white font-PoppinsBold rounded-lg shadow-md hover:bg-red-600"
            >
              Download Profile JPG
            </button>
          </div>
        </div>

        {/* Right Content Section */}
        <div
          style={{
            width: '70%',
            height: '100%',
            backgroundColor: currentTheme.backgroundColor, // Use theme's background color
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: '8px',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
          }}
        >
          <h2 className="font-CoolVetica" style={{ color: currentTheme.textColor, fontSize: '4em', textAlign: 'center', marginTop: '-15%' }}>Your Profile</h2>

          {/* Activity Trends */}
          <div className="p-8">
            <h3 className="text-xl mb-4" style={{ fontFamily: 'PoppinsBold', color: currentTheme.textColor }}>Activity Trends</h3>
            <div className="w-full h-48 rounded-md mb-6 flex items-center justify-center" style={{backgroundColor: currentTheme.borderColor}}>
              <p className="text-gray-500">Activity chart coming soon...</p>
            </div>

            {/* Spotify Widgets */}
            <br></br><br></br><h3 className="text-xl mb-4" style={{ fontFamily: 'PoppinsBold', color: currentTheme.textColor }}>Personalized Song</h3>
            <div className="mb-6 w-full transition-transform transform hover:scale-105">
              {/* Spotify Song */}
              {/* Uncomment and replace userData.spotifyTrackId when ready */}
              {/* 
              <iframe
                src={`https://open.spotify.com/embed/track/${userData.spotifyTrackId}`}
                width="100%"
                height="80"
                allow="encrypted-media"
                title="Spotify Song"
                className="rounded-lg shadow-md"
              ></iframe>
              */}
            </div>

            <h3 className="text-xl mb-4" style={{ fontFamily: 'PoppinsBold', textAlign: 'center', color: currentTheme.textColor }}>Your Spotify Playlist</h3>
            <div className="mb-6 w-full transition-transform transform hover:scale-105">
              <iframe
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
                width="100%"
                height="380"
                allow="encrypted-media"
                title="Spotify Playlist"
                className="rounded-lg shadow-md"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
