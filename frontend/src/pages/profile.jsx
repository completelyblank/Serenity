import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Envelope from '../components/envelope';
import { useUserContext } from '../../src/context/userContext';
import ReactToPrint from 'react-to-print';
import html2canvas from 'html2canvas';
import axios from 'axios';
import GenerateMP3 from '../components/mp3Generator';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/spinner';
import ReactiveButton from 'reactive-button';
import { useSnackbar } from "notistack";
import showPasswordImg from '../assets/eye.png';
import hidePasswordImg from '../assets/eye-slash.png';
import UserPieChart from '../components/userPieChart';

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
  },
  theme9: {
    name: "Dreamy Horizon",
    backgroundColor: '#E5E2F4',
    textColor: '#8B80F9',
    borderColor: '#ADA8F9',
  },
  theme10: {
    name: "LED Glow",
    backgroundColor: '#0D0D0D',
    textColor: '#00FF41',
    borderColor: '#005C1F',
  },
  theme11: {
    name: "Neon Pulse",
    backgroundColor: '#1B1B2F',
    textColor: '#FF2975',
    borderColor: '#A41E5E',
  },
  theme12: {
    name: "Sunny Delight",
    backgroundColor: '#FFD700',
    textColor: '#FFFFFF',
    borderColor: '#FFA500',
  },
  theme13: {
    name: "Midnight Velvet",
    backgroundColor: '#0F0E17',
    textColor: '#A7A9BE',
    borderColor: '#1C1B29',
  }
};


const ProfilePage = () => {
  const { userData } = useUserContext();
  const { setUserData } = useUserContext();
  const [state, setState] = useState('idle');
  const componentRef = useRef();
  const navigate = useNavigate();

  const onClickHandler = () => {
    setState('loading');

    // send an HTTP request
    setTimeout(() => {
      setState('success');
    }, 2000);
  };

  useEffect(() => {
    if (!userData || Object.keys(userData).length === 0) {
      navigate('/');
    }
  }, [userData, navigate]);

  if (!userData || Object.keys(userData).length === 0) {
    return null;
  }

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
  const [author, setAuthor] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [isTokenPopupOpen, setIsTokenPopupOpen] = useState(false);
  const [passwordPopup, setPasswordPopup] = useState(false);
  const [deletionPopup, setDeletionPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notMatch, setNotMatch] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [sentiments, setSentiments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/profile', { params: { userID: userData.userID } });
        const data = response.data;
        setQuote(data.QUOTE);
        setAuthor(data.AUTHOR);
        setSentiments(data.sentiments);
        console.log(data.sentiments);
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
    setSelectedTheme(theme);
    try {
      const themeNumber = parseInt(theme.replace(/\D/g, ''), 10);
      const response = await axios.post('http://localhost:3000/profile/theme', { username: userData.username, theme: themeNumber });
      setUserData({ userID: userData.userID, username: userData.username, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, gender: userData.gender, age: userData.age, theme: themeNumber, token: userData.token, logged: userData.logged, card: userData.card });
    } catch (error) {
      console.log("error changing themes");
    }
  };

  const togglePasswordPopup = () => {
    setPasswordPopup(!passwordPopup);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setNotMatch(false);
    setPasswordChangeSuccess(false);
    setErrorMessage("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleDelete = () => {
    setDeletionPopup(!deletionPopup);
    setConfirmPassword("");
    setErrorMessage("");
    setShowConfirmPassword(false);
  };

  const handleDelete = async () => {
    if (confirmPassword !== userData.password) {
      setNotMatch(true);
      setErrorMessage("Incorrect Password");
      return;
    } else {
      setNotMatch(false);
      setErrorMessage("");
    }
    try {
      const response = await axios.post('http://localhost:3000/profile/delete', {
        username: userData.username
      });
      if (response.data.status === 1) {
        setDeleteSuccess(true);
        enqueueSnackbar('Account Deleted Successfully', { variant: 'success', autoHideDuration: 1000 });

        setTimeout(() => {
          navigate('/');
        }, 2000);

        toggleDelete();
      } else {
        setErrorMessage('Failed To Delete Account');
      }
    } catch (error) {
      setErrorMessage('Error deleting account.');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setNotMatch(true);
      setErrorMessage("Passwords do not match.");
      return;
    } else {
      setNotMatch(false);
      setErrorMessage("");
    }

    if (currentPassword !== userData.password) {
      setErrorMessage("Incorrect password.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/profile/password', {
        username: userData.username,
        password: newPassword,
      });

      if (response.data.status === 1) {
        setPasswordChangeSuccess(true);
        enqueueSnackbar('Password Changed Successfully', { variant: 'success', autoHideDuration: 1000 });

        // Update the password in userData and log the new password
        setUserData({
          ...userData,
          password: newPassword
        });

        console.log("Updated password:", newPassword); // Log new password

        togglePasswordPopup();
      } else {
        setErrorMessage('Failed To Change Password');
      }
    } catch (error) {
      setErrorMessage('Error changing password.');
    }
  };

  // Toggle popup visibility for the envelope
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Toggle token usage confirmation popup visibility
  const toggleTokenPopup = () => {
    setIsTokenPopupOpen(!isTokenPopupOpen);
    setErrorMessage("");
  };

  // Handle using the token
  const handleUseToken = async () => {
    if (userData.token < 1) {
      setErrorMessage("Insufficient Tokens");
    } else {
      try {
        const response = await axios.post('http://localhost:3000/profile/tokens', {
          userID: userData.userID,
        });
        const newCount = userData.token - 1;
        setUserData({ ...userData, token: newCount });
      } catch (error) {
        console.error('Error posting data:', error);
      }

      toggleTokenPopup();
      togglePopup();
    }

  };

  useEffect(() => {
    const spinnerTimeout = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    setLoading(false);
    return () => clearTimeout(spinnerTimeout);
  }, []);

  if (loading || showSpinner) {
    return (
      <div
        className="h-screen overflow-hidden"
        style={{
          backgroundColor: '#b2dfdb'
        }}
      >
        <Navbar />
        <Spinner />
      </div>
    );
  }

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
          marginTop: '5%',
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

          {/* Quotes Jar */}
          <div
            className="w-24 h-24 lg:w-56 lg:h-56 bg-center bg-contain bg-no-repeat mb-6 transition-transform duration-300 transform hover:scale-105 cursor-pointer hover:brightness-75"
            style={{
              backgroundImage: "url('jar.png')",
            }}
            onClick={toggleTokenPopup} // Toggle token popup on click
          />

          {/* Token Usage Confirmation Popup */}
          {isTokenPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 font-PoppinsBold">
              <div
                className="relative p-4 rounded-lg shadow-lg flex flex-col items-center justify-center"
                style={{
                  width: '60%',
                  height: '60%',
                  backgroundColor: currentTheme.borderColor,
                  borderWidth: '10px',  // Border thickness
                  borderStyle: 'solid',
                  borderImage: "url('border.png') 100 round",
                }}
              >
                {/* Token Count Display */}
                <div className="absolute top-4 right-4 text-lg font-PoppinsBold" style={{ color: currentTheme.textColor }}>
                  Token Count: {userData.token}
                </div>
                <p className="text-lg font-PoppinsBold" style={{ color: currentTheme.textColor }}>
                  Do you want to use a token to open the envelope?
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    className="text-xl py-2"
                    style={{ backgroundColor: currentTheme.backgroundColor, color: currentTheme.textColor, borderRadius: '20px', width: '150px' }}
                    onClick={handleUseToken}
                  >
                    Yes
                  </button>
                  <button
                    className="text-xl px-9 py-2"
                    style={{ backgroundColor: currentTheme.backgroundColor, color: currentTheme.textColor, borderRadius: '20px', width: '150px' }}
                    onClick={toggleTokenPopup} // Close token popup
                  >
                    No
                  </button>
                </div>
                {errorMessage && (
                  <p className="absolute text-red-500" style={{ marginTop: '20%' }}>{errorMessage}</p>
                )}
              </div>
            </div>
          )}

          {/* Existing Popup for Envelope */}
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="relative p-4 rounded-lg shadow-lg flex flex-col items-center justify-center"
                style={{
                  width: '60%',
                  height: '60%',
                  backgroundColor: currentTheme.borderColor,
                  borderWidth: '10px',
                  borderStyle: 'solid',
                  borderImage: "url('border.png') 100 round",
                }}
              >
                <Envelope togglePopup={togglePopup} />
                <button
                  className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-red-600"
                  style={{
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                    background: 'linear-gradient(90deg, #e45a5a, #ff1a1a)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #e26464, #e50000)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #e45a5a, #ff1a1a)';
                  }}
                  onClick={togglePopup}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 w-full flex flex-col gap-4" style={{ marginTop: 'auto' }}>
            <button
              className="px-6 py-3 bg-gradient-to-r from-yellow-700 to-yellow-900 text-white font-PoppinsBold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={setPasswordPopup}
            >
              Change Password
            </button>

            <button
              className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white font-PoppinsBold rounded-lg shadow-lg hover:from-red-500 hover:to-red-700 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={setDeletionPopup}
            >
              Delete Account
            </button>
            <button
              onClick={downloadProfileJPG}
              className="px-6 py-3 bg-gradient-to-r from-green-700 to-green-900 text-white font-PoppinsBold rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Download Profile JPG
            </button>
          </div>
          {passwordPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50 font-PoppinsBold">
              <div className="relative p-4 rounded-lg shadow-lg flex flex-col items-center justify-center"
                style={{
                  width: '60%',
                  height: '60%',
                  backgroundColor: currentTheme.borderColor,
                  borderWidth: '10px', // Border thickness
                  borderStyle: 'solid',
                  borderImage: "url('border.png') 100 round",
                }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.textColor }}>
                  Change Password
                </h2>
                <div className="relative w-3/4">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="my-2 p-2 rounded border w-full"
                  />
                  <img
                    src={showCurrentPassword ? hidePasswordImg : showPasswordImg}
                    alt={showCurrentPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-4 cursor-pointer"
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                <div className="relative w-3/4">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="my-2 p-2 rounded border w-full"
                  />
                  <img
                    src={showNewPassword ? hidePasswordImg : showPasswordImg}
                    alt={showNewPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-4 cursor-pointer"
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                <div className="relative w-3/4">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="my-2 p-2 rounded border w-full"
                  />
                  <img
                    src={showConfirmPassword ? hidePasswordImg : showPasswordImg}
                    alt={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-4 cursor-pointer"
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-500">{errorMessage}</p> // Display error message
                )}

                {passwordChangeSuccess && (
                  <p className="text-green-500">Password changed successfully!</p>
                )}
                <div className="flex space-x-4 mt-4">
                  <button
                    className="text-xl py-2 px-4"
                    style={{
                      backgroundColor: currentTheme.backgroundColor,
                      color: currentTheme.textColor,
                      borderRadius: '20px',
                    }}
                    onClick={handlePasswordChange}
                  >
                    Change Password
                  </button>
                  <button
                    className="text-xl py-2 px-4"
                    style={{
                      backgroundColor: currentTheme.backgroundColor,
                      color: currentTheme.textColor,
                      borderRadius: '20px',
                    }}
                    onClick={togglePasswordPopup}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {deletionPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50 font-PoppinsBold">
              <div className="relative p-4 rounded-lg shadow-lg flex flex-col items-center justify-center"
                style={{
                  width: '60%',
                  height: '60%',
                  backgroundColor: currentTheme.borderColor,
                  borderWidth: '10px', // Border thickness
                  borderStyle: 'solid',
                  borderImage: "url('border.png') 100 round",
                }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.textColor }}>
                  Confirm Deletion
                </h2>
                <div className="relative w-3/4">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Current Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="my-2 p-2 rounded border w-full"
                  />
                  <img
                    src={showConfirmPassword ? hidePasswordImg : showPasswordImg}
                    alt={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-4 cursor-pointer"
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-500">{errorMessage}</p>
                )}

                {deleteSuccess && (
                  <p className="text-green-500">Account deleted successfully!</p>
                )}
                <div className="flex space-x-4 mt-4">
                  <button
                    className="text-xl py-2 px-4"
                    style={{
                      backgroundColor: currentTheme.backgroundColor,
                      color: currentTheme.textColor,
                      borderRadius: '20px',
                    }}
                    onClick={handleDelete}
                  >
                    Delete Account
                  </button>
                  <button
                    className="text-xl py-2 px-4"
                    style={{
                      backgroundColor: currentTheme.backgroundColor,
                      color: currentTheme.textColor,
                      borderRadius: '20px',
                    }}
                    onClick={toggleDelete}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
            <div
              className="w-full h-48 lg:h-64 bg-gray-100 rounded-lg mb-6 flex items-center"
              style={{ backgroundColor: currentTheme.borderColor }}
            >
              {/* Left Column: Heading */}
              <div className="w-1/2 pl-4 ml-6 pr-3">
                <h1
                  style={{
                    fontSize: '1.1em',
                    fontFamily: 'PoppinsBold',
                    color: currentTheme.textColor,
                  }}
                >
                  NLP Sentiment Analysis - Overview of Sentiments in Your Mood Logs
                </h1>
              </div>

              {/* Right Column: Chart */}
              <div className="w-2/3 flex justify-center">
                <UserPieChart sentiments={sentiments} currentTheme={currentTheme} />
              </div>
            </div>
          </div>


          {/* Mp3 Generate */}
          <GenerateMP3 />

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
