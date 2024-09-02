import React, { useState } from 'react';

const shuffle = (array) => {
  let shuffledArray = array.slice(); // Copy the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

const MemoryGame = () => {
  const cardImages = [
    'amna_tablet.png', 'zehra_tablet.png', 'my_tablet.png',
    'amna_tablet.png', 'zehra_tablet.png', 'my_tablet.png',
    'amna_tablet.png', 'zehra_tablet.png', 'my_tablet.png',
    // Add more pairs of images as needed
  ];

  const [cards, setCards] = useState(shuffle(cardImages)); // Shuffle card images
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [message, setMessage] = useState('');

  const handleCardClick = (index) => {
    if (flipped.length === 1 && flipped[0] !== index) {
      if (cards[flipped[0]] === cards[index]) {
        setMatched([...matched, flipped[0], index]);
        setMessage('Correct!');
        setTimeout(() => setMessage(''), 1500); // Clear message after 1.5 seconds
      }
      setTimeout(() => setFlipped([]), 1000); // Flip back after 1 second
    } else {
      setFlipped([index]);
    }
  };

  return (
    <>
      <style>
        {`
          body {
            background-image: url('../assets/table.png'); 
            background-size: cover;
            background-position: center;
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }

          .memory-game-container {
            text-align: center;
            color: #fff;
            max-width: 800px;
            width: 100%;
            padding: 20px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }

          .game-title {
            font-size: 2.5rem;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(64, 255, 0, 0.8);
            font-family: sans-serif;
            color: #03ffc0;
          }

          .memory-game {
            display: grid;
            grid-template-columns: repeat(5, 100px);
            gap: 20px;
            justify-content: center;
            margin-bottom: 20px;
          }

          .card {
            width: 100px;
            height: 150px;
            perspective: 1000px;
            cursor: pointer;
          }

          .card-inner {
            width: 100%;
            height: 100%;
            position: relative;
            transition: transform 0.6s ease-in-out;
            transform-style: preserve-3d;
          }

          .card.flipped .card-inner {
            transform: rotateY(180deg);
          }

          .card-front,
          .card-back {
            width: 100%;
            height: 100%;
            position: absolute;
            backface-visibility: hidden;
            border-radius: 10px;
          }

          .card-front {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #333;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: background 0.3s ease;
            background: linear-gradient(145deg, #3a3a3a, #1e1e1e);
          }

          .card-front img {
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            object-fit: cover;
          }

          .card-back {
            background: linear-gradient(145deg, #4e4e4e, #2b2b2b);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotateY(180deg);
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .message-container {
            margin-top: 20px;
          }

          .message {
            font-size: 1.5rem;
            color: #ffc107;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          }
        `}
      </style>

      <h1 className="game-title">Dreamy Memories</h1>
      <div className="memory-game-container">
        <div className="memory-game">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
              style={{ visibility: matched.includes(index) ? 'hidden' : 'visible' }} // Hide matched cards
            >
              <div className="card-inner">
                <div className="card-front">
                  <img src={card} alt="card" />
                </div>
                <div className="card-back">?</div>
              </div>
            </div>
          ))}
        </div>
        <div className="message-container">
          <p className="message">{message}</p>
        </div>
      </div>
    </>
  );
};

export default MemoryGame;
