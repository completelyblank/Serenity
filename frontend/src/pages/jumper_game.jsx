import React, { useState, useEffect, useRef } from 'react';
import playerImage from '../assets/jumper.png';
import skyImage from '../assets/sky.png';
import platformImage from '../assets/cloud.png';
import tokenImage from '../assets/dream_token.png';

const Jumper_Game = ({ onMilestone }) => {
  const [playerX, setPlayerX] = useState(window.innerWidth / 2 - 35); // Center player horizontally
  const [playerY, setPlayerY] = useState(0); // Start from the top
  const [playerVelocity, setPlayerVelocity] = useState(0); // Initially falling down
  const [platforms, setPlatforms] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [tokens, setTokens] = useState([]);

  const gameAreaRef = useRef(null);

  // Initialize platforms
  useEffect(() => {
    const initialPlatforms = [];
    for (let i = 0; i < 5; i++) {
      initialPlatforms.push({
        x: Math.random() * (window.innerWidth - 100),
        y: i * 100 + 100
      });
    }
    setPlatforms(initialPlatforms);
  }, []);

  // Handle player movement with WASD keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGameOver) {
        switch (e.key) {
          case 'a':
            setPlayerX((prevX) => Math.max(prevX - 10, 0));
            break;
          case 'd':
            setPlayerX((prevX) => Math.min(prevX + 10, window.innerWidth - 70));
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameOver]);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!isGameOver) {
        // Update player's position
        setPlayerY((prevY) => prevY + playerVelocity);

        // Apply gravity
        setPlayerVelocity((prevVelocity) => prevVelocity + 0.5);

        // Check platform collisions
        platforms.forEach((platform) => {
          if (
            playerY >= platform.y &&
            playerY <= platform.y + 10 &&
            playerVelocity > 0 &&
            Math.abs(platform.x - playerX) < 50
          ) {
            setPlayerVelocity(-10); // Bounce up
            setScore((prevScore) => prevScore + 1);
            //onMilestone(1); // Award a token
          }
        });

        // Move platforms down (to simulate the player going up) //masla + collision ka 
        setPlatforms((prevPlatforms) =>
          prevPlatforms.map((platform) => ({
            ...platform,
            y: platform.y - 6
          }))
        );

        // Add a new platform when the previous ones move out of view
        setPlatforms((prevPlatforms) => {
          if (prevPlatforms[prevPlatforms.length - 1].y < window.innerHeight) {
            return [
              ...prevPlatforms,
              {
                x: Math.random() * (window.innerWidth - 100),
                y: window.innerHeight + 100
              }
            ];
          }
          return prevPlatforms;
        });

        // Spawn dream tokens randomly
        if (Math.random() < 0.01) {
          setTokens((prevTokens) => [
            ...prevTokens,
            { x: Math.random() * (window.innerWidth - 30), y: Math.random() * window.innerHeight }
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
  }, [playerY, playerVelocity, platforms, tokens, isGameOver, onMilestone, playerX]);

  const resetGame = () => {
    setPlayerY(0);
    setPlayerX(window.innerWidth / 2 - 35);
    setPlayerVelocity(0);
    setIsGameOver(false);
    setScore(0);
    setTokens([]);
  };

  return (
    <div
      style={{
        position: 'relative', // Container for sky background
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${skyImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}
    >
      <div
        className="game-area"
        ref={gameAreaRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '70vw',
          height: '100vh',
          backgroundImage: `url(${skyImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <img
          src={playerImage}
          alt="Player"
          className="player"
          style={{
            position: 'absolute',
            width: '100px',
            height: '90px',
            left: `${playerX}px`,
            top: `${playerY}px`
          }}
        />
        {platforms.map((platform, index) => (
          <img
            key={index}
            src={platformImage}
            alt="Platform"
            className="platform"
            style={{
              position: 'absolute',
              width: '90px',
              height: '90px',
              left: `${platform.x}px`,
              top: `${platform.y}px`
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
              position: 'absolute',
              width: '50px',
              height: '50px',
              left: `${token.x}px`,
              top: `${token.y}px`
            }}
          />
        ))}
        {isGameOver && (
          <div
            className="game-over"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white', 
              bg: "black",
              opacity: '60%'
            }}
          >
            <h2>Game Over</h2>
            <p>Score: {score}</p>
            <button
  onClick={resetGame}
  style={{
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    background: 'linear-gradient(135deg, #333, #666)', // Black to gray gradient
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'background 0.3s, box-shadow 0.3s',
    outline: 'none'
  }}
  onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #666, #333)'} // Reversed gradient
  onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #333, #666)'} // Original gradient
>
  Restart
</button>

          </div>
        )}
      </div>
    </div>
  );
};

export default Jumper_Game;
