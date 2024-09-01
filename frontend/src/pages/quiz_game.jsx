import React, { useState, useEffect } from 'react';
import quizBackgroundImage from '../assets/brain.png'; 
import chibiHappyImage from '../assets/dreamer_happy.png'; 
import chibiSadImage from '../assets/dreamer_sad.png'; 
import PropTypes from 'prop-types';  // Import PropTypes for type checking

const Quiz_Game = ({ onMilestone }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [chibiReaction, setChibiReaction] = useState('neutral'); 

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      const data = await response.json();
      const formattedQuestions = data.results.map((question) => ({
        question: question.question,
        options: shuffleOptions([...question.incorrect_answers, question.correct_answer]),
        answer: question.correct_answer,
      }));
      setQuestions(formattedQuestions);
      setCurrentQuestion(0); 
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const shuffleOptions = (options) => {
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
      //onMilestone(1);  // Call the onMilestone function
      setChibiReaction('correct');
    } else {
      setChibiReaction('wrong');
    }
    setTimeout(() => setChibiReaction('neutral'), 1000);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      fetchQuestions();
    }
  };

  const getChibiImage = () => {
    if (chibiReaction === 'correct') {
      return chibiHappyImage;
    } else if (chibiReaction === 'wrong') {
      return chibiSadImage;
    } else {
      return chibiHappyImage;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: `url(${quizBackgroundImage})`,
        backgroundSize: 'cover',
        padding: '20px',
        boxSizing: 'border-box',
        color: '#fff',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
      }}
    >
      <div style={{ position: 'absolute', top: '10%', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            color: '#fff',
            textShadow: '0 0 15px #00ffcc, 0 0 30px #00ffcc',
            animation: 'pulseGlow 2s infinite',
          }}
        >
          Welcome to the Dream Quiz!
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#fff',
            textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff',
          }}
        >
          Train your brain for more versatile dreams!
        </p>
      </div>
      {questions.length > 0 ? (
        <div
          style={{
            maxWidth: '600px',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            animation: 'fadeIn 1s ease-in-out',
          }}
        >
          {currentQuestion < questions.length ? (
            <div>
              <p
                style={{
                  fontSize: '24px',
                  marginBottom: '20px',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
                }}
                dangerouslySetInnerHTML={{ __html: questions[currentQuestion].question }}
              ></p>
              <div>
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 0',
                      margin: '10px 0',
                      fontSize: '18px',
                      color: '#fff',
                      backgroundColor: '#007BFF',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s, transform 0.3s',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#0056b3';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#007BFF';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '24px', textShadow: '0 0 10px rgba(255, 255, 255, 0.7)' }}>Your score: {score}</p>
          )}
        </div>
      ) : (
        <p style={{ fontSize: '24px', textShadow: '0 0 10px rgba(255, 255, 255, 0.7)' }}>Loading questions...</p>
      )}
      <div style={{ marginLeft: '20px', position: 'relative' }}>
        <img
          src={getChibiImage()}
          alt="Chibi Character"
          style={{
            width: '450px',
            transition: 'transform 0.3s',
            transform:
              chibiReaction === 'correct' ? 'scale(1.2) scale(1)' : chibiReaction === 'wrong' ? 'scale(0.8)' : 'scale(1)',
            filter: chibiReaction === 'wrong' ? 'grayscale(100%)' : 'none',
            animation: chibiReaction === 'correct' ? 'chibiBounce 0.5s ease-in-out' : 'none',
          }}
        />
        {chibiReaction === 'correct' && (
          <p
            style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '18px',
              color: '#00FF00',
              textShadow: '0 0 10px rgba(0, 255, 0, 0.7)',
              animation: 'fade 1s forwards',
            }}
          >
            Correct!
          </p>
        )}
        {chibiReaction === 'wrong' && (
          <p
            style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '18px',
              color: '#FF0000',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.7)',
              animation: 'fade 1s forwards',
            }}
          >
            Wrong!
          </p>
        )}
      </div>
      <style>
        {`
          @keyframes pulseGlow {
            0% {
              text-shadow: 0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc, 0 0 40px #00ffcc;
            }
            50% {
              text-shadow: 0 0 15px #00ffcc, 0 0 25px #00ffcc, 0 0 35px #00ffcc, 0 0 50px #00ffcc;
            }
            100% {
              text-shadow: 0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc, 0 0 40px #00ffcc;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fade {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }

          @keyframes chibiBounce {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.4);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Quiz_Game;
