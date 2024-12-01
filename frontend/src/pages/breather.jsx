import React, { useState, useEffect, useRef } from 'react';
import sereneImage from '../assets/serene.png';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useUserContext } from '../context/userContext';

const BreathingExercise = () => {
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [progressCount, setProgressCount] = useState(4);
  const [gameStarted, setGameStarted] = useState(false);
  const [setCount, setSetCount] = useState(0);
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const tokensUpdated = useRef(false);
  const { userData, setUserData } = useUserContext();

  const handleTokenUpdate = async () => {
    const tokenCount = 5;
    try {
      const response = await axios.post('http://localhost:3000/games/tokens', {
        userID: userData.userID,
        tokens: tokenCount
      });
      const newCount = userData.token + tokenCount;
      setUserData({ ...userData, token: newCount });
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const breathingDurations = {
    inhale: 4,
    hold: 5,
    exhale: 4,
  };

  useEffect(() => {
    if (preGameCountdown > 0 && gameStarted) {
      const countdownTimer = setInterval(() => {
        setPreGameCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownTimer);
    }

    if (preGameCountdown === 0) {
      setProgressCount(breathingDurations.inhale);
    }
  }, [preGameCountdown, gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setProgressCount((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timer);
        setBreathingPhase((prevPhase) => {
          const nextPhase =
            prevPhase === 'inhale' ? 'hold' : prevPhase === 'hold' ? 'exhale' : 'inhale';
            if (prevPhase === 'exhale' && setCount < 5) {
              setSetCount((prevSetCount) => {
                const newSetCount = prevSetCount + 1;
                if (newSetCount === 4) {
                  setGameOver(true); 
                  if (!tokensUpdated.current) {
                    handleTokenUpdate();
                    tokensUpdated.current = true;  
                  }
                }
                return newSetCount;
              });
            }
          return nextPhase;
        });
        return breathingDurations[breathingPhase];
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, progressCount, breathingPhase, gameOver]);

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setSetCount(0);
    setPreGameCountdown(3);
    tokensUpdated.current = false;
    
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setGameStarted(false);
  };

  const phaseColor = {
    inhale: '#00f2ff',
    hold: '#ffc107',
    exhale: '#ff5733',
  };

  return (
    <div className="w-full h-full relative">
      {!gameStarted ? (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            className="relative p-8 rounded-lg shadow-lg bg-gray-400"
            style={{
              width: '60%',
              height: '60%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <h2 className="font-DirtyHeadline mb-2" style={{ fontSize: '1.8em' }}>
              Synhale
            </h2>
            <div
              className="relative"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div className="flex flex-row">
                <h2 className="font-PoppinsBold text-m mt-2 mb-2 mr-2">
                  This breathing exercise game guides you through calming inhale, hold, and exhale
                  cycles, helping you stay mindful and relaxed. Follow the rhythm for a peaceful
                  experience.
                </h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="w-3/4 p-2 mt-2 text-center rounded font-PoppinsBold cursor-pointer"
                style={{
                  backgroundImage: 'linear-gradient(to right, #1479ec, #1727bd)',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '1em',
                  transition: 'background-color 0.1s ease',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                }}
                onClick={handleStartGame}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundImage =
                    'linear-gradient(to right, #075ab9, #0a1685)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundImage =
                    'linear-gradient(to right, #1479ec, #1727bd)')
                }
              >
                Start Game
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative overflow-hidden flex flex-col justify-start items-center"
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url("./breathe.jpeg")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              color: 'white',
              fontSize: '1.2em',
              fontFamily: 'PoppinsBold',
              padding: '5px 10px',
              borderRadius: '5px',
            }}
          >
            Set {setCount === 4 ? setCount : setCount + 1} of 4
          </div>

          <div className="mb-9" style={{ position: 'relative', top: '10%', textAlign: 'center' }}>
            <h1 className="text-white text-5xl font-bold font-PoppinsBold">Breathe with Me</h1>
            <p className="text-white text-2xl font-Poppins mt-2">Relax your mind and body</p>
          </div>

          {preGameCountdown > 0 && gameStarted && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
              <h1
                className="text-white font-bold"
                style={{ fontSize: '2.5em', fontFamily: 'PoppinsBold' }}
              >
                Starting in {preGameCountdown}...
              </h1>
            </div>
          )}
          {preGameCountdown === 0 && !gameOver && (
            <div
              className="flex flex-row justify-center items-center relative"
              style={{
                maxWidth: '600px',
                borderRadius: '10px',
                textAlign: 'center',
                animation: 'fadeIn 1s ease-in-out',
              }}
            >
              <motion.div
                animate={{
                  scale: breathingPhase === 'inhale' ? 1.2 : breathingPhase === 'exhale' ? 1 : 1.2,
                }}
                transition={{ duration: breathingDurations[breathingPhase] }}
                className="mb-9 font-PoppinsBold flex flex-col items-center justify-center p-4 "
                style={{ width: '80%' }}
              >
                <p
                  className="font-PoppinsBold"
                  style={{
                    fontSize: '2em',
                    color: phaseColor[breathingPhase],
                    textShadow: `0 0 15px ${phaseColor[breathingPhase]}`,
                  }}
                >
                  {breathingPhase.charAt(0).toUpperCase() + breathingPhase.slice(1)}
                </p>
                <p className="mt-6" style={{ color: 'white', fontSize: '1.2em' }}>
                  Seconds Remaining: {progressCount}
                </p>
              </motion.div>
              <div>
                <motion.img
                  src={sereneImage}
                  alt="Serene"
                  className="mt-6"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: breathingPhase === 'inhale' ? 1.2 : breathingPhase === 'exhale' ? 1 : 1.2,
                  }}
                  transition={{ duration: breathingDurations[breathingPhase] }}
                  style={{ width: '500px' }}
                />
              </div>
            </div>
          )}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
              <div
                className="relative p-6 rounded-lg shadow-lg bg-gray-400"
                style={{
                  width: '50%',
                  height: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
                }}
              >
                <h2 className="font-DirtyHeadline mb-2" style={{ fontSize: '1.8em' }}>Congratulations!</h2>
                <div
                  className="relative"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                    <h2 className="font-PoppinsBold text-xl mb-2 mr-2">All Sets Completed</h2>
                    

                  <div className="flex flex-row">
                    <h2 className="font-PoppinsBold text-xl mb-2 mr-2">Tokens Earned:</h2>
                    <h2 className="font-Poppins text-xl mb-3">5</h2>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className="w-full p-2 mt-2 text-center rounded font-PoppinsBold cursor-pointer"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #1479ec, #1727bd)',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '1em',
                      transition: 'background-color 0.1s ease',
                      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                    }}
                    type="submit"
                    onClick={handlePlayAgain}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #075ab9, #0a1685)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #1479ec, #1727bd)')}
                  >
                    Play Again
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BreathingExercise;
