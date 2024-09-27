import React, { useRef, useState } from 'react';
import Navbar from '../components/navbar';
import { useUserContext } from '../../src/context/userContext';
import ReactToPrint from 'react-to-print';

const ProfilePage = () => {
  const { userData } = useUserContext();
  const componentRef = useRef();

  // State for the background color
  const [bgColor, setBgColor] = useState('#16423C');

  // Random daily quote
  const quotes = [
    "Keep pushing forward.",
    "Believe in yourself.",
    "Every day is a new beginning."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Handler for changing background color
  const handleColorChange = (e) => {
    setBgColor(e.target.value);
  };

  return (
    <div
      className="h-screen overflow-y-auto relative"
      style={{
        backgroundColor: '#c1e4e7',
        backgroundImage: 'url("sky.jpg")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar />

      {/* Main Profile Box */}
      <div
        ref={componentRef}
        className="flex items-center justify-center p-8"
        style={{
          backgroundColor: bgColor,
          opacity: 0.85,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '80%',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
        }}
      >
        {/* Left Profile Info */}
        <div className="w-1/3 bg-[#16423C] flex flex-col items-center justify-center p-8 border-r-4 border-[#01201c]">
          {/* Avatar */}
          <div
            className="w-32 h-32 rounded-full bg-cover bg-center mb-6"
            style={{ backgroundImage: `url("../src/assets/avatar.png")` }}
          ></div>

          {/* User Info */}
          <p className="text-2xl text-teal-200 mb-2 font-Poppins">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-lg text-teal-200 font-Poppins">Age: {userData.age}</p>

          {/* Color Picker */}
          <div className="mt-6">
            <label className="text-teal-200 mb-2">Change Background Color:</label>
            <input
              type="color"
              value={bgColor}
              onChange={handleColorChange}
              className="w-10 h-10 cursor-pointer mt-2"
            />
          </div>

          {/* Buttons for Changing Password and Deleting Account */}
          <div className="mt-8 flex flex-col gap-4">
            <button className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600">
              Change Password
            </button>
            <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">
              Delete Account
            </button>
          </div>
        </div>

        {/* Right Content Section */}
        <div className="w-2/3 flex flex-col justify-start items-start p-8 text-teal-200 overflow-y-auto">
          <h2 className="text-4xl font-CoolVetica mb-4">Your Profile</h2>

          {/* Activity Trends */}
          <h3 className="text-xl font-semibold mb-4">Activity Trends</h3>
          <div className="w-full h-48 bg-gray-100 rounded-md mb-6 flex items-center justify-center">
            <p className="text-gray-500">Activity chart coming soon...</p>
          </div>

          {/* Spotify Widgets */}
          <h3 className="text-xl font-semibold mb-4">Personalized Song</h3>
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

          <h3 className="text-xl font-semibold mb-4">Your Spotify Playlist</h3>
          <div className="mb-6 w-full transition-transform transform hover:scale-105">
            <iframe
              src={`https://open.spotify.com/embed/playlist/${userData.spotifyPlaylistId}`}
              width="100%"
              height="380"
              allow="encrypted-media"
              title="Spotify Playlist"
              className="rounded-lg shadow-md"
            ></iframe>
          </div>

          {/* Daily Motivation */}
          <h3 className="text-xl font-semibold mb-4">Daily Motivation</h3>
          <p className="text-lg italic bg-gray-100/50 p-4 rounded-lg shadow-md">
            {randomQuote}
          </p>
        </div>
      </div>

      {/* PDF Print Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ReactToPrint
          trigger={() => (
            <button className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105">
              Print Profile
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
