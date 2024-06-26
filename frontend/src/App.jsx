import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [stats, setStats] = useState(0);
  const sentences = [
    "The Dreamcatcher DB project is an innovative data science initiative.",
    "It delves into the realm of sentiment analysis using MySQL, React, Express, Node.js, and Vite.",
    "By applying sentiment analysis to dream narratives, it aims to uncover hidden patterns and emotions.",
    "This project creates a robust platform for capturing and analyzing dreams.",
    "Dreamcatcher DB is poised to revolutionize our understanding of dreams."
  ];
  const [sentenceIndex, setSentenceIndex] = useState(0);

  // Increment stats every second
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setStats(prevStats => prevStats + 1);
    }, 1000);

    return () => clearInterval(statsInterval);
  }, []);

  // Cycle through sentences every 10 seconds
  useEffect(() => {
    const sentenceInterval = setInterval(() => {
      setSentenceIndex(prevIndex => (prevIndex + 1) % sentences.length);
    }, 10000);

    return () => clearInterval(sentenceInterval);
  }, []);

  return (
    <div className="font-montserrat text-black h-screen overflow-y-auto bg-gradient-to-b from-gray-800 to-black">
      {/* Title Section with Background Image */}
      <div className="flex flex-col items-center justify-center h-64 bg-cover bg-center relative" style={{ backgroundImage: `url("dream_catcher.png")` }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-75">
          <h1 className="text-6xl font-bold mb-4 text-gold animate-pulse">DREAMCATCHER</h1>
          <p className="text-lg font-bold mb-4 text-gold animate-pulse">{sentences[sentenceIndex]}</p>
        </div>
      </div>

      <hr className="border-t-2 border-gray-600 opacity-50 my-4" />

      {/* Main Content */}
      <div className="mx-auto w-3/4 bg-black text-white rounded-lg p-6 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-75">
        {/* About Section */}
        <section className="mb-8 text-center">
          <h2 className="text-4xl font-semibold mb-4 text-gold">About</h2>
          <p className="text-lg text-white">
            The Dreamcatcher DB project is an innovative data science initiative that delves into the realm of sentiment analysis, leveraging MySQL, React, Express, Node.js, and Vite. It aims to capture and analyze dreams, uncovering hidden patterns and emotions to revolutionize our understanding of dreams.
          </p>
        </section>

        <hr className="border-t-2 border-white opacity-50 my-4" />

        {/* Stats Section */}
        <section className="mb-8 text-center">
          <h2 className="text-4xl font-semibold mb-4 text-gold">Stats</h2>
          <p className="text-2xl text-white">{stats} Users have logged their dreams.</p>
        </section>

        <hr className="border-t-2 border-white opacity-50 my-4" />

        {/* View Analysis Section */}
        <section className="mb-8 text-center">
          <h2 className="text-4xl font-semibold mb-4 text-gold">View Analysis</h2>
          <p className="text-2xl text-white">Share your dreams and join thousands of others in unlocking the secrets of their subconscious.</p>
          <Link to="/analysis">
            <button className="px-8 py-4 text-xl rounded-lg bg-gold text-black hover:text-yellow-500 hover:bg-gold transition duration-300">
              View Analysis
            </button>
          </Link>
        </section>

        <hr className="border-t-2 border-white opacity-50 my-4" />

        {/* Login Section */}
        <section className="mb-8 text-center">
          <h2 className="text-4xl font-semibold mb-4 text-gold">Login</h2>
          <p className="text-lg text-white mb-4">Log in to access your dream analysis and more.</p>
          <Link to="/login">
            <button className="px-8 py-4 text-xl rounded-lg bg-gold text-black hover:text-yellow-500 hover:bg-gold transition duration-300">
              Login
            </button>
          </Link>
        </section>

        <hr className="border-t-2 border-white opacity-50 my-4" />

        {/* Footer */}
        <footer className="text-center p-6 bg-white bg-opacity-10 rounded-lg">
          <div className="flex justify-center gap-6 mb-4">
            <img src="zehra.jpg" alt="Team Member 1" className="w-20 h-20 rounded-full" />
            <img src="amna.jpg" alt="Amna Shahh" className="w-20 h-20 rounded-full" />
            <img src="muhammad.jpg" alt="Muhammad Raza" className="w-20 h-20 rounded-full" />
          </div>
          <p className="text-lg text-gold">© DB Dreamcatcher Team</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
