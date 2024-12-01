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
import BubblesGame from './bubbles';
import Jumper_Game from './jumper_game';
import BreathingExercise from './breather';

const GameHandler = () => {
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [gameLoading, setGameLoading] = useState(false);

  const handleGameLoad = (tokens) => {
    setGameLoading(true);
    setTimeout(() => {
      setGameLoading(false);
    }, 1500);
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

  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#b2dfdb' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-y-auto overflow-x-hidden relative"
      style={{
        backgroundImage: `url(${seaPic})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />
      <div
        className="flex items-center justify-center"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -45%)",
          width: "80%",
          height: "80%",
          backgroundColor: '#16423C',
          border: '4px solid #062420',
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
          textAlign: "center",
          padding: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Large Box Content */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: 'url("games.png")',
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: "0.8",
            border: "4px solid #062420",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
            position: "relative",
          }}
        >
          {/* Inner div */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(95, 94, 94, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentGameIndex === 0 && (
              <span
                style={{
                  fontFamily: "DirtyHeadline",
                  fontSize: "2.6em",
                  color: "#ffffff",
                }}
              >
                Choose a Game To Start Playing
              </span>
            )}
            {gameLoading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: 'url("games.png")',
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  zIndex: 15,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className='flex flex-col space-y-5'>
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(95, 94, 94, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  ></div>
                  <img src="processing.gif" alt="Processing" />
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    style={{
                      fontFamily: 'PoppinsBold',
                      fontSize: '2em',
                      textAlign: 'center',
                      color: 'white'
                    }}
                  >
                    Loading ...
                  </motion.h1>
                </div>
              </div>
            )}
            {!gameLoading && currentGameIndex === 1 && <BubblesGame />}
            {!gameLoading && currentGameIndex === 2 && <Jumper_Game />}
            {!gameLoading && currentGameIndex === 3 && <BreathingExercise />}
          </div>
        </div>

        {/* Small Boxes Section */}
        <div
          style={{
            width: "20%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: "20px",
          }}
        >
          {/* Small Boxes Section */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Small Box 1 */}
            <div
              className="relative group"
              style={{
                width: "100%",
                height: "30%"
              }}
              onClick={() => {
                setCurrentGameIndex(1);
                handleGameLoad();
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  border: "4px solid #062420",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
                  backgroundImage: `url(${bubbleGame})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />
              {/* Overlay */}
              <div
                className="flex flex-col space-y-3 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                style={{ borderRadius: "10px" }}
              >
                <p
                  style={{
                    fontFamily: 'DirtyHeadline',
                    color: 'white',
                    fontSize: '1.2rem',
                    letterSpacing: '3px'
                  }}
                >
                  Bubble Boom
                </p>
                <button
                  className="bg-teal-800 text-white font-bold py-2 px-4 rounded"
                  style={{
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  Play Game
                </button>
              </div>
            </div>

            {/* Small Box 2 */}
            <div
              className="relative group"
              style={{
                width: "100%",
                height: "30%"
              }}
              onClick={() => {
                setCurrentGameIndex(2);
                handleGameLoad();
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  border: "4px solid #062420",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
                  backgroundImage: `url(${cloudGame})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />
              {/* Overlay */}
              <div
                className="flex flex-col space-y-3 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                style={{ borderRadius: "10px" }}
              >
                <p
                  style={{
                    fontFamily: 'DirtyHeadline',
                    color: 'white',
                    fontSize: '1.2rem',
                    letterSpacing: '3px'
                  }}
                >
                  Airborne Adventures
                </p>
                <button
                  className="bg-teal-800 text-white font-bold py-2 px-4 rounded"
                  style={{
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  Play Game
                </button>
              </div>
            </div>

            {/* Small Box 3 */}
            <div
              className="relative group"
              style={{
                width: "100%",
                height: "30%"
              }}
              onClick={() => {
                setCurrentGameIndex(3);
                handleGameLoad();
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  border: "4px solid #062420",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
                  backgroundImage: `url(${breatheGame})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />
              {/* Overlay */}
              <div
                className="flex flex-col space-y-3 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                style={{ borderRadius: "10px" }}
              >
                <p
                  style={{
                    fontFamily: 'DirtyHeadline',
                    color: 'white',
                    fontSize: '1.2rem',
                    letterSpacing: '3px'
                  }}
                >
                  Synhale
                </p>
                <button
                  className="bg-teal-800 text-white font-bold py-2 px-4 rounded"
                  style={{
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  Play Game
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

};

export default GameHandler;
