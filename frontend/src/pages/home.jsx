import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Spinner from '../components/spinner';
import Navbar from '../components/navbar';
import Sparkle from 'react-sparkle';

const Home = () => {
  const [stats, setStats] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [num, setNum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [error, setError] = useState(null);

  const sentences = [
    "Serenity uses blockchain to create a secure, decentralized mood tracking platform",
    "Leveraging modern technologies, Serenity captures and analyzes emotions for mental wellness",
    "Serenity uncovers emotional patterns using blockchain, enhancing mental well-being insights",
    "Serenity offers a secure platform for tracking emotions, earning rewards, and mindfulness exercises",
    "Serenity empowers individuals to take control of their mental wellness with a decentralized platform"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set a timeout for the spinner to be displayed for at least 2 seconds
        const spinnerTimeout = setTimeout(() => {
          setShowSpinner(false);
        }, 1000);

        const response = await axios.get('http://localhost:3000/');
        const data = response.data;
        setNum(data.num);
        console.log(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
        clearTimeout(spinnerTimeout); // Clear the timeout when data is fetched
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setStats(prevStats => prevStats + 1);
    }, 1000);

    return () => clearInterval(statsInterval);
  }, []);

  useEffect(() => {
    const sentenceInterval = setInterval(() => {
      setSentenceIndex(prevIndex => (prevIndex + 1) % sentences.length);
    }, 4000);

    return () => clearInterval(sentenceInterval);
  }, []);

  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#d7f3e8' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }


  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden" style={{ backgroundColor: '#7fddb9' }}>
      <Navbar />
      {/* Title Section with Background Image */}
      <motion.div
        className="flex flex-col items-center justify-center h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url("serene.jpg")`, height: '60vh' }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-75">
          <Sparkle
            color="#3dc000"
            count={20}
            fadeOutSpeed={10}
            flicker={true}
            flickerSpeed="slowest"
            flickerAmount={0.5}
            minSize={10}
            maxSize={20}
            newSparkleOnFadeOut={true}
          />
          <h1 className="text-6xl mb-9 font-CoolVetica" style={{ fontSize: '6.3em', letterSpacing: '3px', color: '#011746' }}>Serenity</h1>
          <p className="text-lg font-bold mt-5 text-black animate-pulse font-PoppinsBold" style={{ fontSize: '1.5em', wordWrap: 'break-word', textAlign: 'center', color: '#011746', paddingLeft: '20%', paddingRight: '20%' }}>{sentences[sentenceIndex]}</p>
        </div>
      </motion.div>


      {/* Main Content */}
      <motion.div
        className="text-blue-900 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-75"
        style={{ backgroundColor: '#16423C' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* About Section */}
        <motion.section
          className="mb-8 text-center flex flex-col justify-center items-center"
          style={{ backgroundColor: '#16423C', height: '50vh', opacity: 0.85 }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl mb-10 mt-10 font-CoolVetica" style={{ fontSize: '4em', color: '#7fddb9' }}>
            About
          </h2>
          <p className="text-lg font-Poppins" style={{ fontSize: '1.5em', paddingRight: '10%', paddingLeft: '10%', paddingTop: '1%', paddingBottom: '1%', color: '#7fddb9' }}>
            The Serenity project is an innovative data science initiative that delves into the realm of sentiment analysis, leveraging blockchain, React, Express, Node.js, and Vite. It aims to capture and analyze emotions, uncovering hidden patterns to revolutionize our understanding of mental wellness
          </p>
        </motion.section>

        <hr className="border-t-2 opacity-50 my-4" style={{ borderTop: '3px solid #7fddb9' }} />

        {/* Stats Section */}
        <motion.div
          className="mb-4 text-center flex justify-between items-center w-full"
          style={{ backgroundColor: '#7fddb9', height: '50vh', width: '100%' }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Left Column (Stats) */}
          <div className="w-1/2 flex flex-col justify-center items-center h-60" style={{ backgroundColor: '#7fddb9', borderRight: '3px solid #011746' }}>
            <h2 className="text-4xl mb-4 font-CoolVetica" style={{ fontSize: '4em', paddingTop: '2%', color: '#011746' }}>Stats</h2>
            <p className="text-lg mb-4 mt-8 font-Poppins" style={{ fontSize: '1.5em', paddingTop: '1%', paddingBottom: '1%', color: '#011746' }}>
              <strong>{num}</strong> Users Have Logged Their Emotions
            </p>

          </div>

          {/* Right Column (Empty) */}
          <div className="w-1/2 flex flex-col justify-center items-center h-60" style={{ backgroundColor: '#7fddb9', borderRight: '3px solid #011746' }}>
            <h2 className="text-4xl mb-4 font-CoolVetica" style={{ fontSize: '4em', paddingTop: '2%', color: '#011746' }}>Get Started</h2>
            <p className="text-lg mb-3 mt-4 font-Poppins" style={{ fontSize: '1.5em', paddingTop: '1%', paddingBottom: '1%', color: '#011746' }}>
              Try It Out Yourself!
            </p>
            <Link to="/form">
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="text-white bg-gradient-to-tr from-green-900 to-green-400 border-b-8 border-opacity-80 opacity-80 border-green-800 hover:border-opacity-100 hover:opacity-100 transition duration-100 inline-flex items-center justify-center flex"
                style={{
                  fontFamily: 'CoolVetica',
                  fontSize: '1.5em',
                  cursor: 'pointer',
                  borderRadius: "60px",
                  height: '150%',
                  width: '140%',
                  letterSpacing: '3px',
                  textShadow: "5px 5px 5px #000000",
                  alignItems: 'center',
                  animation: "glow 1.5s infinite",
                  marginLeft: '-19%'
                }}
              >
                <span className="flex text-align-center">
                  Start Mood Logging
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>


        <hr className="border-t-2 opacity-50" style={{ borderTop: '3px solid #7fddb9' }} />


        {/* Footer */}
        <motion.footer
          className="text-center flex flex-col justify-center items-center"
          style={{ backgroundColor: '#002722', height: '40vh', opacity: 0.85 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="w-full flex justify-center items-center gap-8 mb-6">
            {/* Zehra Waqar */}
            <div className="relative group">
              <img src="zehra_tablet.png" alt="Zehra's Tablet" className="w-24 h-24" />
              <p className="absolute inset-0 flex items-center justify-center text-peach-900 font-bold bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                Zehra Waqar
              </p>
            </div>

            {/* Amna Shah */}
            <div className="relative group">
              <img src="amna_tablet.png" alt="Amna's Tablet" className="w-24 h-24" />
              <p className="absolute inset-0 flex items-center justify-center text-peach-900 font-bold bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Amna Shah
              </p>
            </div>

            {/* Muhammad Raza */}
            <div className="relative group">
              <img src="my_tablet.png" alt="Muhammad's Tablet" className="w-24 h-24" />
              <p className="absolute inset-0 flex items-center justify-center text-peach-900 font-bold bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Muhammad Raza
              </p>
            </div>
          </div>

          <p className="text-lg font-Poppins" style={{ fontSize: '1.3em', color: '#7fddb9' }}>© Serenity Team</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Home;
