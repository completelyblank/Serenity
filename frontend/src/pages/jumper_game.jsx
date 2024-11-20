import React, { useState, useEffect, useRef } from "react";
import playerImage from "../assets/jumper.png";
import skyImage from "../assets/sky.png";
import platformImage from "../assets/cloud.png";
import tokenImage from "../assets/dream_token.png";

const Jumper_Game = ({ onMilestone }) => {
  const [playerX, setPlayerX] = useState(window.innerWidth / 2 - 35); // Center player horizontally
  const [playerY, setPlayerY] = useState(0); // Start from the top
  const [playerVelocity, setPlayerVelocity] = useState(0); // Initially falling down
  const [isFacingRight, setIsFacingRight] = useState(true); // Track player direction
  const [platforms, setPlatforms] = useState([]);
  const [platformVelocities, setPlatformVelocities] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [gameStarted, setGameStarted] = useState(false); // Track whether the game has started

  const gameAreaRef = useRef(null);

  // Initialize platforms
  useEffect(() => {
    const initialPlatforms = [];
    const initialVelocities = [];
    for (let i = 0; i < 5; i++) {
      initialPlatforms.push({
        x: Math.random() * (window.innerWidth - 100),
        y: i * 100 + 100,
      });
      initialVelocities.push(Math.random() * 2 + 1); // Random horizontal speed
    }
    setPlatforms(initialPlatforms);
    setPlatformVelocities(initialVelocities);
  }, []);

  // Handle player movement with WASD keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGameOver && gameStarted) {
        switch (e.key) {
          case "a":
            setPlayerX((prevX) => Math.max(prevX - 10, 0));
            setIsFacingRight(false);
            break;
          case "d":
            setPlayerX((prevX) => Math.min(prevX + 10, window.innerWidth - 70));
            setIsFacingRight(true);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameOver, gameStarted]);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      if (!isGameOver) {
        // Update player's position
        setPlayerY((prevY) => prevY + playerVelocity);

        // Apply gravity
        setPlayerVelocity((prevVelocity) => Math.min(prevVelocity + 0.5, 5)); // Cap falling speed

        // Move platforms down (to simulate the player going up)
        setPlatforms((prevPlatforms) =>
          prevPlatforms.map((platform, index) => ({
            x: Math.max(
              0,
              Math.min(platform.x + platformVelocities[index], window.innerWidth - 100)
            ),
            y: platform.y - 5, // Move platforms downwards
          }))
        );

        // Check platform collisions
        platforms.forEach((platform, index) => {
          const playerTop = playerY;
          const playerBottom = playerY + 90; // Player's height is 90px
          const playerLeft = playerX;
          const playerRight = playerX + 70; // Player's width is 70px

          const platformTop = platform.y;
          const platformBottom = platform.y + 20; // Adjust based on platform height
          const platformLeft = platform.x;
          const platformRight = platform.x + 90; // Adjust based on platform width

          // Check if any part of the player intersects with the platform
          if (
            playerRight > platformLeft && // Player's right side intersects platform's left side
            playerLeft < platformRight && // Player's left side intersects platform's right side
            playerBottom > platformTop && // Player's bottom side intersects platform's top side
            playerTop < platformBottom // Player's top side intersects platform's bottom side
          ) {
            setPlayerVelocity(-10); // Make the player jump
            setScore((prevScore) => prevScore + 1); // Increment score for successful jump
            platforms[index].y = -9999; // Move the platform out of the screen after collision
          }
        });

        // Add a new platform when the previous ones move out of view
        setPlatforms((prevPlatforms) => {
          return prevPlatforms.map((platform) => {
            if (platform.y < -20) {
              return {
                x: Math.random() * (window.innerWidth - 100),
                y: window.innerHeight + 100,
              };
            }
            return platform;
          });
        });

        // Spawn dream tokens randomly
        if (Math.random() < 0.01) {
          setTokens((prevTokens) => [
            ...prevTokens,
            {
              x: Math.random() * (window.innerWidth - 30),
              y: Math.random() * window.innerHeight,
            },
          ]);
        }

        // Check token collection
        setTokens((prevTokens) => {
          return prevTokens.filter((token) => {
            if (
              playerY >= token.y &&
              playerY <= token.y + 30 &&
              Math.abs(token.x - playerX) < 50
            ) {
              setScore((prevScore) => prevScore + 5); // Award more points for tokens
              onMilestone(5); // Award more tokens for collection
              return false;
            }
            return true;
          });
        });

        // Check for game over
        if (playerY > window.innerHeight) {
          setIsGameOver(true);
        }
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [playerY, playerVelocity, platforms, tokens, isGameOver, gameStarted, playerX, onMilestone]);

  const resetGame = () => {
    setPlayerY(0);
    setPlayerX(window.innerWidth / 2 - 35);
    setPlayerVelocity(0);
    setIsGameOver(false);
    setScore(0);
    setTokens([]);
  };

  const startGame = () => {
    setGameStarted(true); // Start the game when the button is clicked
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${skyImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {!gameStarted ? (
        <div
          className="start-screen"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            background: "rgba(0, 0, 0, 0.6)",
            borderRadius: "15px",
            padding: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
          }}
        >
          <h1 className="text-4xl font-bold">Airborne Adventures</h1>
          <p className="mt-4 text-xl">
            In this thrilling game, you control a jumper who must navigate through floating platforms, avoiding obstacles and collecting dream tokens to rack up points. The sky is your limit, but be careful not to fall!
          </p>
          <button
            onClick={startGame}
            className="mt-6 px-6 py-3 text-lg font-medium text-black bg-gradient-to-r from-blue-200 to-gray-400 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div
          className="game-area"
          ref={gameAreaRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "70vw",
            height: "100vh",
            backgroundImage: `url(${skyImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={playerImage}
            alt="Player"
            className="player"
            style={{
              position: "absolute",
              width: "150px",
              height: "100px",
              left: `${playerX}px`,
              top: `${playerY}px`,
              transform: isFacingRight ? "scaleX(-1)" : "scaleX(1)",
            }}
          />
          {platforms.map((platform, index) => (
            <img
              key={index}
              src={platformImage}
              alt="Platform"
              className="platform"
              style={{
                position: "absolute",
                width: "80px",
                height: "80px",
                left: `${platform.x}px`,
                top: `${platform.y}px`,
              }}
            />
          ))}
          {tokens.map((token, index) => (
            <img
              key={index}
              src={tokenImage}
              alt="Token"
              className="token"
              style={{
                position: "absolute",
                width: "30px",
                height: "30px",
                left: `${token.x}px`,
                top: `${token.y}px`,
              }}
            />
          ))}
        </div>
      )}
      {isGameOver && (
        <div
          className="game-over"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: "15px",
            padding: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
          }}
        >
          <h1 className="text-3xl font-bold">Game Over</h1>
          <p className="mt-4 text-xl">Your score: {score}</p>
          <button
            onClick={resetGame}
            className="mt-6 px-6 py-3 text-lg font-medium text-black bg-gradient-to-r from-blue-200 to-gray-400 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Jumper_Game;
