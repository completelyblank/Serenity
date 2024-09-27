  import React, { useState, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import { Link } from 'react-router-dom';
  import Navbar from '../components/navbar';
  import Spinner from '../components/spinner';
  import Sparkle from 'react-sparkle';
  import seaPic from '/sea.jpg';
  import bubbleGame from '/bubble_boom.jpg';
  import cloudGame from '/airborne.jpeg';
  import breatheGame from '/synhale.jpg';

  const games = [
    { image: cloudGame, route: '/jumper' },
    { image: bubbleGame, route: '/bubbles' },
    { image: breatheGame, route: '/breathe' },
  ];

  const GameHandler = () => {
    const [dreamTokens, setDreamTokens] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSpinner, setShowSpinner] = useState(true);
    const [currentGameIndex, setCurrentGameIndex] = useState(0); // Track current image

    const handleMilestone = (tokens) => {
      setDreamTokens(dreamTokens + tokens);
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          setTimeout(() => {
            setShowSpinner(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    const nextGame = () => {
      setCurrentGameIndex((prevIndex) => (prevIndex + 1) % games.length); // Loop to next game
    };

    const prevGame = () => {
      setCurrentGameIndex((prevIndex) =>
        prevIndex === 0 ? games.length - 1 : prevIndex - 1
      ); // Loop to previous game
    };

    if (loading || showSpinner) {
      return (
        <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#001f24' }}>
          <Navbar />
          <Spinner />
        </div>
      );
    }

    return (
      <div className="h-screen overflow-y-auto overflow-x-hidden relative" style={{ backgroundColor: '#001f24' }}>
        <Navbar />

        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${seaPic})`, backgroundSize: 'cover', height: '100vh', width: '100vw' }}
        >
          {/* Title Section with Background Image */}
          <motion.div
            className="flex flex-col items-center justify-center bg-cover bg-center z-10"
            style={{  height: '60vh' }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-col items-center justify-center">
              <Sparkle
                color="#00bfa5"
                count={20}
                fadeOutSpeed={10}
                flicker={true}
                flickerSpeed="slowest"
                flickerAmount={0.5}
                minSize={10}
                maxSize={20}
                newSparkleOnFadeOut={true}
              />
              <h1 className="text-6xl mb-5 font-CoolVetica" style={{ fontSize: '6.3em', letterSpacing: '3px', color: '#00bfa5', marginTop: '20%' }}>
                Mini Games
              </h1>
              <p
                className="font-bold text-white font-PoppinsBold"
                style={{ fontSize: '2em', textAlign: 'center'}}
              >
                Revitalize Your Mind with Fun Mini Games!
              </p>
            </div>
          </motion.div>

          {/* Game Selection Section */}
          <motion.div
            className="relative text-white shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-50"
            style={{ backgroundColor: '#002f34', borderRadius: '20px', margin: '5%', padding: '3%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <section
              className="text-center flex flex-col justify-center items-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '20px', padding: '3%' }}
            >
              <h1 className="font-CoolVetica" style={{ fontSize: '4em', letterSpacing: '3px', color: '#00bfa5', marginTop: '5%', marginBottom: '5%' }}>
                Choose A Game To Play
              </h1>

              {/* Image Carousel */}
              <div className="flex justify-center items-center ">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={games[currentGameIndex].image}
                    alt="Game"
                    className="w-80 h-80 object-cover"
                    style={{ borderRadius: '10px' }}
                  />
                </motion.div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center w-full mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-neon-blue text-white font-PoppinsBold py-3 px-5 rounded-lg shadow-lg"
                  style={{fontSize: '3em'}}
                  onClick={prevGame}
                >
                  {'<'}
                </motion.button>

                      <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: '#00bfa5' }}
                      transition={{ duration: 0.3 }}
                      className="bg-neon-blue text-white font-PoppinsBold py-4 px-8 rounded-lg shadow-lg"
                      style={{ fontSize: '2em' }}
                    >
                      <Link to={games[currentGameIndex].route} style={{ textDecoration: 'none', color: 'inherit' }}>
                        Play
                      </Link>
                    </motion.button>


                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-neon-blue font-PoppinsBold text-white font-bold py-3 px-5 rounded-lg shadow-lg"
                  style={{fontSize: '3em'}}
                  onClick={nextGame}
                >
                  {'>'}
                </motion.button>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    );
  };

  export default GameHandler;
