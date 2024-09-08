import React, { useState, useEffect, useRef } from 'react';
import './Bubbles.css';

const BubblesGame = () => {
  const [bubbles, setBubbles] = useState([]); // array to store bubble objects
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(5);
  const canvasRef = useRef(null);

  useEffect(() => {
    let intervalId;
    if (!isPaused && !gameOver) {
      intervalId = setInterval(generateBubble, 1000); // generate bubbles every second
    }
    return () => clearInterval(intervalId);
  }, [isPaused, gameOver]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      alert('Game Over');
    }
  }, [lives]);

  const generateBubble = () => {
    const randomX = Math.floor(Math.random() * 400); // random x position for bubbles
    const newBubble = {
      id: Date.now(),
      positionX: randomX,
      positionY: 0,
      speed: Math.random() * 2 + 1, // random speed for bubbles
      points: 10,
      color: getRandomColor(),
    };
    setBubbles((prevBubbles) => [...prevBubbles, newBubble]);
  };

  const updateBubblePositions = () => {
    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble) => ({
        ...bubble,
        positionY: bubble.positionY + bubble.speed,
      }))
    );
  };

  const popBubble = (id, points) => {
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
    setScore(score + points);
  };

  const loseLife = () => {
    setLives((prevLives) => prevLives - 1);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isPaused && !gameOver) {
        updateBubblePositions();
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [isPaused, gameOver]);

  const handleStart = () => {
    setIsPaused(false);
    setGameOver(false);
    setScore(0);
    setLives(5);
    setBubbles([]);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const getRandomColor = () => {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="game-container">
        <div class="header-container">
      <div className="header">
    <h1>Bubble Pop Game</h1>
        <div className="score-lives">
          <p>Score: {score}</p>
          <p>Lives: {lives}</p>
        </div>
        </div>
        <button onClick={handleStart} className="start-btn">
          {gameOver ? 'Restart Game' : 'Start Game'}
        </button>
        <button onClick={handlePause} className="pause-btn">
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      <div className="canvas" ref={canvasRef}>
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={`bubble ${bubble.color}`}
            style={{ left: `${bubble.positionX}px`, bottom: `${bubble.positionY}px` }}
            onClick={() => popBubble(bubble.id, bubble.points)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BubblesGame;
