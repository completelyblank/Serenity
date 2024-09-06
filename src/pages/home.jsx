import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spinner from '../components/spinner'; 
import Navbar from '../components/navbar';

const Home = () => {
  const [stats, setStats] = useState(0);
  const sentences = [
    "Serenity uses blockchain to create a secure, decentralized mood tracking platform.",
    "Leveraging modern technologies, Serenity captures and analyzes emotions for mental wellness.",
    "Serenity uncovers emotional patterns using blockchain, enhancing mental well-being insights.",
    "Serenity offers a secure platform for tracking emotions, earning rewards, and mindfulness exercises.",
    "Serenity empowers individuals to take control of their mental wellness with a decentralized platform."
];

  const [sentenceIndex, setSentenceIndex] = useState(0);

  // Increment stats every second
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setStats(prevStats => prevStats + 1);
    }, 1000);

    return () => clearInterval(statsInterval)
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
    <div className="font-montserrat text-pink-900 h-screen overflow-y-auto bg-gradient-to-b from-pink-200 to-peach-200">
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
            style={{ backgroundImage: `url("serenity.png")` }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-75">
              <h1 className="text-6xl font-bold mb-4 text-yellow-50 animate-pulse">SERENITY</h1>
              <p className="text-lg font-bold mb-4 text-black animate-pulse">{sentences[sentenceIndex]}</p>
            </div>
          </motion.div>

          <hr className="border-t-2 border-pink-300 opacity-50 my-4" />

          {/* Main Content */}
          <motion.div 
            className="mx-auto w-3/4 text-pink-900 rounded-lg p-6 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-75" 
            style={{ backgroundColor: '#ffe4e1' }}  // Peach background color
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
              <h2 className="text-4xl font-semibold mb-4 text-pink-800">About</h2>
              <p className="text-lg text-pink-900">
                The Serenity project is an innovative data science initiative that delves into the realm of sentiment analysis, leveraging blockchain, React, Express, Node.js, and Vite. It aims to capture and analyze emotions, uncovering hidden patterns to revolutionize our understanding of mental wellness.
              </p>
            </motion.section>

            <hr className="border-t-2 border-pink-300 opacity-50 my-4" />

            {/* Stats Section */}
            <motion.section 
              className="mb-8 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-semibold mb-4 text-pink-800">Stats</h2>
              <p className="text-2xl text-pink-900">{stats} Users have logged their emotions.</p>
            </motion.section>

            <hr className="border-t-2 border-pink-300 opacity-50 my-4" />

            {/* View Analysis Section */}
            <motion.section 
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-semibold mb-4 text-pink-800">View Analysis</h2>
              <p className="text-2xl text-pink-900 mb-4">See how the rest of the population feels.</p>
              <Link to="/analysis">
                <motion.button 
                  className="px-8 py-4 text-xl rounded-lg bg-pink-300 text-peach-900 hover:text-peach-600 hover:bg-white transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Analysis
                </motion.button>
              </Link>
            </motion.section>

            <hr className="border-t-2 border-pink-300 opacity-50 my-4" />

            {/* Login Section */}
            <motion.section 
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-semibold mb-4 text-pink-800">Login</h2>
              <p className="text-lg text-pink-900 mb-4">Log in to track your emotions.</p>
              <Link to="/login">
                <motion.button 
                  className="px-8 py-4 text-xl rounded-lg bg-pink-300 text-peach-900 hover:text-peach-600 hover:bg-white transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
            </motion.section>

            <hr className="border-t-2 border-pink-300 opacity-50 my-4" />

            {/* Footer */}
            <motion.footer 
              className="text-center p-6 bg-pink-200 bg-opacity-10 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              <div className="flex justify-center gap-6 mb-4">
                {/* Zehra Waqar */}
                <div className="relative group">
                  <img src="zehra_tablet.png" alt="Zehra's Tablet" className="w-24 h-24"/>
                  <p className="absolute inset-0 flex items-center justify-center text-peach-900 font-bold bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Zehra Waqar
                  </p>
                </div>

                {/* Amna Shah */}
                <div className="relative group">
                  <img src="amna_tablet.png" alt="Amna's Tablet" className="w-24 h-24"/>
                  <p className="absolute inset-0 flex items-center justify-center text-peach-900 font-bold bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Amna Shah
                  </p>
                </div>

                {/* Muhammad Raza */}
                <div className="relative group">
                  <img src="my_tablet.png" alt="Muhammad's Tablet" className="w-24 h-24"/>
                  <p className="absolute inset-0 flex items-center justify-center text-peach-900 font-bold bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Muhammad Raza
                  </p>
                </div>
              </div>

              <p className="text-lg text-pink-800">© Serenity Team</p>
            </motion.footer>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Home;
