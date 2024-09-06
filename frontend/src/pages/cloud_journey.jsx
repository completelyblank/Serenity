import React, { useState, useEffect, useRef } from 'react';
import playerImage from '../assets/blob.png';
import skyImage from '../assets/sky.png';
import platformImage from '../assets/cloud.png';
import memoryTokenImage from '../assets/memory_token.png';

const Cloud_Journey = ({ onMilestone }) => {
  const [playerX, setPlayerX] = useState(100);
  const [playerY, setPlayerY] = useState(window.innerHeight / 2 - 45);
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [platforms, setPlatforms] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [backgroundX, setBackgroundX] = useState(0); // To track background position

  const gameAreaRef = useRef(null);

  useEffect(() => {
    const initialPlatforms = [];
    for (let i = 0; i < 5; i++) {
      initialPlatforms.push({
        x: i * 200 + 300,
        y: Math.random() * (window.innerHeight - 100)
      });
    }
    setPlatforms(initialPlatforms);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGameOver) {
        switch (e.key) {
          case 'w':
            setPlayerY((prevY) => Math.max(prevY - 10, 0));
            break;
          case 's':
            setPlayerY((prevY) => Math.min(prevY + 10, window.innerHeight - 90));
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

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!isGameOver) {
        // Move platforms and tokens left
        setPlatforms((prevPlatforms) =>
          prevPlatforms.map((platform) => ({
            ...platform,
            x: platform.x - 6
          }))
        );

        setTokens((prevTokens) =>
          prevTokens.map((token) => ({
            ...token,
            x: token.x - 6
          }))
        );

        // Check platform collisions
        platforms.forEach((platform) => {
          if (
            playerX + 90 >= platform.x &&
            playerX <= platform.x + 90 &&
            playerY + 90 >= platform.y &&
            playerY <= platform.y + 10
          ) {
            setScore((prevScore) => prevScore + 1);
          }
        });

        // Check token collection
        setTokens((prevTokens) => {
          return prevTokens.filter((token) => {
            if (
              playerX + 90 >= token.x &&
              playerX <= token.x + 50 &&
              playerY + 90 >= token.y &&
              playerY <= token.y + 50
            ) {
              setScore((prevScore) => prevScore + 5);
              onMilestone(5);
              return false;
            }
            return true;
          });
        });

        // Add a new platform when the previous ones move out of view
        setPlatforms((prevPlatforms) => {
          if (prevPlatforms[0].x < -100) {
            prevPlatforms.shift();
            return [
              ...prevPlatforms,
              {
                x: window.innerWidth + 100,
                y: Math.random() * (window.innerHeight - 100)
              }
            ];
          }
          return prevPlatforms;
        });

        // Spawn memory tokens randomly with a chance
        if (Math.random() < 0.01) {
          setTokens((prevTokens) => [
            ...prevTokens,
            {
              x: window.innerWidth + 100,
              y: Math.random() * (window.innerHeight - 50)
            }
          ]);
        }

        // Update background position
        setBackgroundX((prevX) => (prevX - 3) % window.innerWidth);

        // Check for game over (player moves off-screen)
        if (playerY > window.innerHeight || playerY < 0) {
          setIsGameOver(true);
        }
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [playerX, playerY, platforms, tokens, isGameOver, onMilestone]);

  const resetGame = () => {
    setPlayerY(window.innerHeight / 2 - 45);
    setPlayerX(100);
    setIsGameOver(false);
    setScore(0);
    setTokens([]);
    setBackgroundX(0);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
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
          width: '200vw', // Double the width for endless effect
          height: '100vh',
          backgroundImage: `url(${skyImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          transform: `translate(${backgroundX}px, -50%)`,
          transition: 'transform 0.02s linear'
        }}
      >
        <img
          src={playerImage}
          alt="Player"
          className="player"
          style={{
            position: 'absolute',
            width: '90px',
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
            src={memoryTokenImage}
            alt="Memory Token"
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
              background: 'black',
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
                background: 'linear-gradient(135deg, #333, #666)',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'background 0.3s, box-shadow 0.3s',
                outline: 'none'
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background =
                  'linear-gradient(135deg, #666, #333)')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  'linear-gradient(135deg, #333, #666)')
              }
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cloud_Journey;
