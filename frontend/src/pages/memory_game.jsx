import React, { useState } from 'react';
import './MemoryGame.css'; // Importing CSS for styling
import Navbar from '../components/navbar';

// Shuffle function
const shuffle = (array) => {
  let shuffledArray = array.slice(); // Copy the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

const MemoryGame = ({ onMilestone }) => {
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