import React, { useState, useEffect, useRef } from 'react';
import './Bubbles.css'; // Ensure this CSS includes necessary styles for the game

const BubblesGame = () => {
  const [bubbles, setBubbles] = useState([]); // Array to store bubble objects
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(1); // Set lives to 1
  const [gameStarted, setGameStarted] = useState(false); // Track if the game has started
  const canvasRef = useRef(null);

  const livesRef = useRef(lives); // Ref to track lives without triggering re-render

  useEffect(() => {
    livesRef.current = lives; // Sync livesRef with lives state
    if (livesRef.current <= 0) {
      setGameOver(true); // Trigger game over when lives run out
    }
  }, [lives]);

  const generateBubble = () => {
    const randomX = Math.floor(Math.random() * 400); // Random X position for bubbles
    const constantSpeed = 0.3; // Set constant speed for all bubbles

    const newBubble = {
      id: Date.now(),
      positionX: randomX,
      positionY: 0,
      speed: constantSpeed, // Set constant speed for bubbles
     
      points: 10,
      color: getRandomColor(),
    };
    setBubbles((prevBubbles) => [...prevBubbles, newBubble]);
  };

  const updateBubblePositions = () => {
    setBubbles((prevBubbles) => {
      const updatedBubbles = prevBubbles.map((bubble) => ({
        ...bubble,
        positionY: bubble.positionY + bubble.speed, // Move bubbles upwards
      }));
  
      // Filter out the bubbles that reached the top and decrement lives if necessary
      const bubblesOutOfBounds = updatedBubbles.filter((bubble) => bubble.positionY >= 400); // Adjust to the height of the canvas
      const newLivesCount = livesRef.current - bubblesOutOfBounds.length;
  
      if (newLivesCount < livesRef.current) {
        // Only decrease lives if a bubble has gone out of bounds
        livesRef.current = newLivesCount;
        setLives(livesRef.current); // Update the state with the new lives count
      }
  
      // Filter out the bubbles that have gone out of bounds
      const aliveBubbles = updatedBubbles.filter((bubble) => bubble.positionY < 800);
  
      return aliveBubbles;
    });
  };
  
  const popBubble = (id, points) => {
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
    setScore(score + points);
  };

  // Use requestAnimationFrame for smoother animation
  useEffect(() => {
    const gameLoop = () => {
      if (!isPaused && !gameOver) {
        updateBubblePositions();
        requestAnimationFrame(gameLoop); // Continue the game loop
      }
    };

    if (!isPaused && !gameOver) {
      requestAnimationFrame(gameLoop); // Start the game loop
    }
  }, [isPaused, gameOver]);

  useEffect(() => {
    let intervalId;
    if (!isPaused && !gameOver) {
      intervalId = setInterval(generateBubble, 1000); // Generate one bubble every second
    }
    return () => clearInterval(intervalId);
  }, [isPaused, gameOver]);

  const handleStart = () => {
    setGameStarted(true);
    setIsPaused(false);
    setGameOver(false);
    setScore(0);
    setLives(1); // Start with 1 life
    setBubbles([]); // Clear any existing bubbles
    livesRef.current = 1; // Reset livesRef to match the initial value
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const getRandomColor = () => {
    const colors = ['red-to-pink', 'blue-to-purple', 'green-to-yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const resetGame = () => {
    setGameStarted(false); // Reset to starting screen
    setGameOver(false);
    setLives(1); // Start again with 1 life
    setScore(0);
    livesRef.current = 1; // Reset livesRef to match the initial value
    setBubbles([]); // Clear any existing bubbles
  };

  return (
    <div className="bubble-game">
      {/* Starting Screen */}
      {!gameStarted && !gameOver && (
        <div className="start-screen">
          <h1 className="game-title">Bubble Pop Game</h1>
          <p className="description">
            Welcome to the Bubble Pop Game! Pop as many bubbles as you can to rack up points.
            Be careful, as each missed bubble will cost you a life. How long can you last?
          </p>
          <button onClick={handleStart} className="start-btn">
            Start Game
          </button>
        </div>
      )}

      {/* Game Container */}
      {gameStarted && !gameOver && (
        <div className="game-container">
          <div className="header-container">
            <div className="header">
              <h1 className="game-title">Bubble Pop Game</h1>
              <div className="score-lives">
                <p>Score: {score}</p>
                <p>Lives: {lives}</p>
              </div>
            </div>
            <button onClick={handlePause} className="pause-btn">
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>

          <div className="canvas" ref={canvasRef}>
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className={`bubble ${bubble.color} shadow-xl`}
                style={{
                  left: `${bubble.positionX}px`,
                  bottom: `${bubble.positionY}px`, // Fixed Y positioning for movement
                }}
                onClick={() => popBubble(bubble.id, bubble.points)}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Your Score: {score}</p>
          <button onClick={resetGame} className="restart-btn">
            Start Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BubblesGame;
