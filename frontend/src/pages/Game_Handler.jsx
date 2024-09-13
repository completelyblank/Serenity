import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Spinner from '../components/spinner';
import Navbar from '../components/navbar';
import Sparkle from 'react-sparkle';
import JumperGame from './jumper_game';
import Memory_Game from './memory_game';
import Quiz_Game from './quiz_game';
import seaPic from '/sea.jpg';
import BubbleGame from '/bubbleGame.png';
import cloudGame from '/cloudGame.png';

const GameHandler = () => {
  const [dreamTokens, setDreamTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);

  const handleMilestone = (tokens) => {
    setDreamTokens(dreamTokens + tokens);
  };

  useEffect(() => {
    let spinnerTimeout;
    const fetchData = async () => {
      try {
        const spinnerTimeout = setTimeout(() => {
          setShowSpinner(false);
        }, 1000);


      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
        clearTimeout(spinnerTimeout);
      }
    };

    fetchData();
  }, []);

  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#b2dfdb' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden relative" style={{ backgroundColor: '#c1e4e7' }}>
      <Navbar />

      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${seaPic})`, backgroundSize: 'cover', height: '100vh', width: '100vw' }}>

        {/* Title Section with Background Image */}
        <motion.div
          className="flex flex-col items-center justify-center h-64 bg-cover bg-center relative z-10"
          style={{ backgroundImage: `url(${seaPic})`, height: '70vh' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-75">
            <Sparkle
              color="#009688"
              count={20}
              fadeOutSpeed={10}
              flicker={true}
              flickerSpeed="slowest"
              flickerAmount={0.5}
              minSize={10}
              maxSize={20}
              newSparkleOnFadeOut={true}
            />
            <h1 className="text-6xl mb-9 mt-5 font-CoolVetica" style={{ fontSize: '6.3em', letterSpacing: '3px', color: '#b2dfdb' }}>Mini Games</h1>
            <p className="text-lg font-bold text-black font-PoppinsBold" style={{ fontSize: '2em', wordWrap: 'break-word', textAlign: 'center', color: '#b2dfdb', paddingLeft: '20%', paddingRight: '20%' }}>Revitalize Your Mind with Fun Mini Games!</p>

          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="text-blue-900 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-75 relative z-10"
          style={{ backgroundColor: '#004d40' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <section
            className="mb-8 text-center flex flex-col justify-center items-center"
            style={{ backgroundColor: '#9af1ea', opacity: 0.85 }}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="font-CoolVetica" style={{ fontSize: '4em', letterSpacing: '3px', color: '#004d40', marginTop: '5%', marginBottom: '5%'}}>Choose A Game To Play</h1>

            {/* Container for Images */}
            <div className="flex justify-between w-full mt-5" style={{paddingBottom: '7%', paddingLeft: '10%', paddingRight: '10%'}}>
              {/* Image 1 */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1, cursor: 'pointer' }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={cloudGame}  
                  alt="Image 1"
                  className="w-64 h-64 object-cover"
                  style={{ borderRadius: '10px' }}
                />
              </motion.div>

              {/* Image 2 */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1, cursor: 'pointer'}}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={BubbleGame}
                  alt="Image 2"
                  className="w-64 h-64 object-cover"
                  style={{ borderRadius: '10px' }}
                />
              </motion.div>

              {/* Image 3 */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  //src={breathingExercise}
                  alt="Image 3"
                  className="w-64 h-64 object-cover"
                  style={{ borderRadius: '10px' }}
                />
              </motion.div>
            </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
};

export default GameHandler;
