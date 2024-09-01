import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spinner from '../components/spinner'; 
import Navbar from '../components/navbar';

const Home = () => {
  const [stats, setStats] = useState(0);
  const sentences = [
    "The Dreamcatcher DB project is an innovative data science initiative.",
    "It delves into the realm of sentiment analysis using Oracle, React, Express, Node.js, and Vite.",
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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
       <Navbar />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner /> {/* Display Spinner while loading */}
        </div>
      ) : (
        <>
          {/* Title Section with Background Image */}
          <motion.div 
            className="flex flex-col items-center justify-center h-64 bg-cover bg-center relative" 
            style={{ backgroundImage: `url("dream_catcher.png")` }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-75">
              <h1 className="text-6xl font-bold mb-4 text-yellow-900 animate-pulse">DREAMCATCHER</h1>
              <p className="text-lg font-bold mb-4 text-gold animate-pulse">{sentences[sentenceIndex]}</p>
            </div>
          </motion.div>

          <hr className="border-t-2 border-gray-600 opacity-50 my-4" />

          {/* Main Content */}
          <motion.div 
            className="mx-auto w-3/4 text-black rounded-lg p-6 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-75" 
            style={{ backgroundColor: '#cebebc' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {/* About Section */}
            <motion.section 
              className="mb-8 text-center"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-semibold mb-4 text-gold">About</h2>
              <p className="text-lg text-black">
                The Dreamcatcher DB project is an innovative data science initiative that delves into the realm of sentiment analysis, leveraging Oracle, React, Express, Node.js, and Vite. It aims to capture and analyze dreams, uncovering hidden patterns and emotions to revolutionize our understanding of dreams.
              </p>
            </motion.section>

            <hr className="border-t-2 border-white opacity-50 my-4" />

            {/* Stats Section */}
            <motion.section 
              className="mb-8 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-semibold mb-4 text-gold">Stats</h2>
              <p className="text-2xl text-black">{stats} Users have logged their dreams.</p>
            </motion.section>

            <hr className="border-t-2 border-white opacity-50 my-4" />

            {/* View Analysis Section */}
            <motion.section 
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-semibold mb-4 text-gold">View Analysis</h2>
              <p className="text-2xl text-black mb-4">See how the rest of the population dreams.</p>
              <Link to="/analysis">
                <motion.button 
                  className="px-8 py-4 text-xl rounded-lg bg-gray-300 text-yellow-900 hover:text-yellow-500 hover:bg-white transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Analysis
                </motion.button>
              </Link>
            </motion.section>

            <hr className="border-t-2 border-white opacity-50 my-4" />

            {/* Login Section */}
            <motion.section 
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-semibold mb-4 text-gold">Login</h2>
              <p className="text-lg text-black mb-4">Log in your dreams.</p>
              <Link to="/login">
                <motion.button 
                  className="px-8 py-4 text-xl rounded-lg bg-gray-300 text-yellow-900 hover:text-yellow-500 hover:bg-white transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
            </motion.section>

            <hr className="border-t-2 border-white opacity-50 my-4" />

            {/* Footer */}
            <motion.footer 
              className="text-center p-6 bg-white bg-opacity-10 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
             <div className="flex justify-center gap-6 mb-4">
  {/* Zehra Waqar */}
  <div className="relative group">
    <img src="zehra_tablet.png" alt="Zehra's Tablet" className="w-24 h-24"/>
    <p className="absolute inset-0 flex items-center justify-center text-black font-bold bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Zehra Waqar
    </p>
  </div>

  {/* Amna Shah */}
  <div className="relative group">
    <img src="amna_tablet.png" alt="Amna's Tablet" className="w-24 h-24"/>
    <p className="absolute inset-0 flex items-center justify-center text-black font-bold bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Amna Shah
    </p>
  </div>

  {/* Muhammad Raza */}
  <div className="relative group">
    <img src="my_tablet.png" alt="Raza's Tablet" className="w-24 h-24"/>
    <p className="absolute inset-0 flex items-center justify-center text-black font-bold bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Muhammad Raza
    </p>
  </div>
</div>

              <p className="text-lg text-gold">© DB Dreamcatcher Team</p>
            </motion.footer>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Home;
