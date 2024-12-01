import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import playerImage from "../assets/jumper.png";
import tokenImage from "../assets/token.png";
import platformImage from "../assets/cloud.png";
import skyImage from "../assets/sky.png";
import grassImage from "../assets/grass.png";
import axios from 'axios';
import { useUserContext } from '../context/userContext';

const Jumper_Game = () => {
    const [blockPosition, setBlockPosition] = useState({ x: 50, y: 50 });
    const [velocity, setVelocity] = useState(0);
    const [jumpCount, setJumpCount] = useState(0);
    const [platforms, setPlatforms] = useState([]);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30);
    const [token, setToken] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const gameContainerRef = useRef(null);
    const [gameOver, setGameOver] = useState(false);
    const [scorePopup, setScorePopup] = useState(null);
    const [preGameCountdown, setPreGameCountdown] = useState(3);
    const [tokensUpdated, setTokensUpdated] = useState(false);
    const { userData, setUserData } = useUserContext();

    const gravity = -0.2;
    const jumpStrength = 15;
    const blockSize = 50;
    const platformWidth = 150;
    const platformHeight = 60;
    const groundLevel = 50;
    const floorSegmentWidth = 200;
  
    const handleTokenUpdate = async (score) => {
      const tokenCount = score/20;
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
  

    const handlePlayAgain = () => {
        setGameOver(false);
        setGameStarted(false);
        setScore(0);
        setTimer(30);
        setVelocity(0);
        setBlockPosition({ x: 50, y: 50 });
        setPlatforms(Array.from({ length: 100 }, (_, i) => ({
            x: Math.random() * 400 + 400 * i,
            y: Math.random() * 100 + 200,
            hasToken: Math.random() < 0.3,
            isActivated: false,
        })));
    };

    useEffect(() => {
        if (preGameCountdown > 0 && gameStarted) {
            const countdownTimer = setInterval(() => {
                setPreGameCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdownTimer);
        }
    }, [preGameCountdown, gameStarted]);

    useEffect(() => {
        const initialPlatforms = Array.from({ length: 100 }, (_, i) => ({
            x: Math.random() * 400 + 400 * i,
            y: Math.random() * 100 + 200,
            hasToken: Math.random() < 0.3,
            isActivated: false,
        }));
        setPlatforms(initialPlatforms);
    }, []);

    const handleStartGame = () => {
        setGameStarted(true);
        setScore(0);
        setTimer(30);
        setGameOver(false);
        setPreGameCountdown(3);
        setTokensUpdated(false);
    };

    const handleKeyPress = (e) => {
        if (gameOver) return;
        if (e.key === "ArrowUp" && jumpCount < 2) {
            setVelocity(jumpStrength);
            setJumpCount((prev) => prev + 1);
        }
    };


    const updatePosition = () => {
        if (gameOver) return; // Stop updating if game is over

        setBlockPosition((prev) => {
            let newY = prev.y + velocity;
            let newX = prev.x + 4;
            let isGrounded = false;

            setPlatforms((prevPlatforms) => {
                const updatedPlatforms = prevPlatforms.map((platform) => {
                    if (
                        prev.x + blockSize > platform.x &&
                        prev.x < platform.x + platformWidth &&
                        prev.y + blockSize <= platform.y &&
                        prev.y + blockSize + velocity > platform.y
                    ) {
                        newY = platform.y - blockSize;
                        setVelocity(0);
                        setJumpCount(0);
                        isGrounded = true;

                        if (platform.hasToken && !platform.isActivated) {
                            setToken({
                                x: platform.x + platformWidth / 2,
                                y: platform.y + platformHeight / 2,
                            });

                            setScore((prevScore) => prevScore + 10);
                            // Show score popup
                            setScorePopup({
                                x: platform.x + platformWidth / 2,
                                y: platform.y + platformHeight / 2,
                                value: "+20",
                            });

                            // Hide the popup after 1 second
                            setTimeout(() => setScorePopup(null), 1000);
                            setTimeout(() => setToken(null), 1000);
                        }

                        return { ...platform, isActivated: true };
                    }
                    return platform;
                });

                return updatedPlatforms;
            });

            if (!isGrounded) {
                setVelocity((prevVelocity) => prevVelocity + gravity);
            }

            if (newY <= groundLevel) {
                newY = groundLevel;
                setVelocity(0);
                setJumpCount(0);
            }

            return { x: newX, y: newY };
        });
    };

    useEffect(() => {
        if (gameStarted && timer > 0 && preGameCountdown == 0) {
            const timerInterval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerInterval);
                        setGameOver(true);
                        if(!tokensUpdated) {
                            handleTokenUpdate(score);
                            setTokensUpdated(true);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timerInterval);
        }
    }, [gameStarted, timer, preGameCountdown, tokensUpdated]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameStarted && preGameCountdown == 0) updatePosition();
        }, 1000 / 100);
        window.addEventListener("keydown", handleKeyPress);

        return () => {
            clearInterval(interval);
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [gameStarted, velocity, jumpCount, platforms, preGameCountdown]);

    return (
        <div className="w-full h-full relative">
            {!gameStarted ? (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div
                        className="relative p-8 rounded-lg shadow-lg bg-gray-400"
                        style={{
                            width: "60%",
                            height: "60%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <h2 className="font-DirtyHeadline mb-2" style={{ fontSize: "1.8em" }}>
                            Airborne Adventures
                        </h2>
                        <div
                            className="relative"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div className="flex flex-row">
                                <h2 className="font-PoppinsBold text-m mt-2 mb-2 mr-2">
                                    In this game, you guide a jumper through the skies using the "Up Arrow". Some clouds reveal shiny tokens, while others leave you guessing—how many can you collect before time runs out?                
                                </h2>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                className="w-3/4 p-2 mt-2 text-center rounded font-PoppinsBold cursor-pointer"
                                style={{
                                    backgroundImage: "linear-gradient(to right, #1479ec, #1727bd)",
                                    color: "white",
                                    textAlign: "center",
                                    fontSize: "1em",
                                    transition: "background-color 0.1s ease",
                                    boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.5)",
                                }}
                                onClick={handleStartGame}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #075ab9, #0a1685)')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #1479ec, #1727bd)')}
                            >
                                Start Game
                            </motion.button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="relative overflow-hidden"
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${skyImage})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div
                        className="absolute top-4 left-4 px-4 py-2 rounded shadow-lg font-PoppinsBold text-l"
                        style={{
                            zIndex: 10,
                            backgroundColor: 'white',
                            color: timer <= 5 ? 'red' : 'black',
                        }}
                    >
                        Time Remaining: {timer}s
                    </div>

                    <div
                        className="absolute top-4 right-4 flex items-center text-black font-bold space-x-4 font-PoppinsBold text-l"
                        style={{ zIndex: 10 }}
                    >
                        {scorePopup && (
                            <div
                                className="relative z-1000"
                                style={{
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    color: "gold",
                                    animation: "fadeOut 1s forwards",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {scorePopup.value}
                            </div>
                        )}
                        <div className="bg-white px-4 py-2 rounded shadow-lg ">Score: {score}</div>
                    </div>
                    <div
                        ref={gameContainerRef}
                        className="absolute bottom-0 left-0 w-full h-full"
                        style={{
                            transform: `translateX(-${blockPosition.x - 100}px)`,
                        }}
                    >
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
                        {timer > 0 && !gameOver && preGameCountdown == 0 && (
                            platforms.map((platform, index) => (
                                <div
                                    key={index}
                                    className={`absolute ${platform.isActivated ? "platform-activated" : "platform"
                                        }`}
                                    style={{
                                        left: `${platform.x}px`,
                                        bottom: `${platform.y}px`,
                                        width: `${platformWidth}px`,
                                        height: `${platformHeight}px`,
                                        backgroundImage: `url(${platformImage})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                            )))}
                        <div
                            className="absolute"
                            style={{
                                left: `${blockPosition.x}px`,
                                bottom: `${blockPosition.y}px`,
                                width: "50px",
                                height: "80px",
                                backgroundImage: `url(${playerImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                        {token && (
                            <div
                                className="absolute fade-out"
                                style={{
                                    left: `${token.x - 10}px`,
                                    bottom: `${token.y - 10}px`,
                                    width: "50px",
                                    height: "50px",
                                    backgroundImage: `url(${tokenImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    animation: "fadeOut 2s forwards",
                                }}
                            />
                        )}
                        {Array.from({ length: 10 }, (_, i) => i - 5).map((offset) => (
                            <div
                                key={offset}
                                className="absolute h-20 w-full"
                                style={{
                                    left: `${Math.floor(
                                        blockPosition.x / floorSegmentWidth + offset
                                    ) * floorSegmentWidth}px`,
                                    bottom: 0,
                                    backgroundImage: `url(${grassImage})`,
                                    backgroundSize: "fixed",
                                    backgroundRepeat: "repeat-x",
                                }}
                            />
                        ))}
                    </div>
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
                                <h2 className="font-DirtyHeadline mb-2" style={{ fontSize: '1.8em' }}>Time's Up!</h2>
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
                                        <h2 className="font-PoppinsBold text-xl mb-2 mr-2">Your Score:</h2>
                                        <h2 className="font-Poppins text-xl mb-2">{score}</h2>
                                    </div>

                                    <div className="flex flex-row">
                                        <h2 className="font-PoppinsBold text-xl mb-2 mr-2">Tokens Earned:</h2>
                                        <h2 className="font-Poppins text-xl mb-3">{Math.floor(score / 20)}</h2>
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

export default Jumper_Game;
