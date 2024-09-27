import React, { useState, useEffect } from 'react';
import sereneImage from '../assets/serene.png';
import Navbar from '../components/navbar';

const BreathingExercise = () => {
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [progressCount, setProgressCount] = useState(4);

  useEffect(() => {
    const updateCount = setInterval(() => {
      setProgressCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(updateCount);
  }, [breathingPhase]);

  useEffect(() => {
    const breathingCycle = setInterval(() => {
      if (breathingPhase === 'inhale') {
        setBreathingPhase('hold');
        setCount(7);
        setProgressCount(7);
      } else if (breathingPhase === 'hold') {
        setBreathingPhase('exhale');
        setCount(8);
        setProgressCount(8);
      } else {
        setBreathingPhase('inhale');
        setCount(4);
        setProgressCount(4);
      }
    }, (breathingPhase === 'inhale' ? 4000 : breathingPhase === 'hold' ? 7000 : 8000));

    return () => clearInterval(breathingCycle);
  }, [breathingPhase]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          backgroundImage: `url(/breathe.jpeg)`, // Reference the image directly
          backgroundSize: 'cover',
          padding: '20px',
          boxSizing: 'border-box',
          color: '#fff',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
          position: 'relative',
          zIndex: 0,
        }}
      >
        <div style={{ position: 'absolute', top: '10%', textAlign: 'center' }}>
        <h1 className='text-white text-5xl font-bold font-Poppins'>
            Breathe with Me
          </h1>
          <p className='text-white text-2xl font-Poppins'>
            Relax your mind and body.
          </p>
        </div>
        <div
          style={{
            maxWidth: '600px',
            padding: '200px',
            borderRadius: '10px',
            textAlign: 'center',
            animation: 'fadeIn 1s ease-in-out',
          }}
        >
          <p
            style={{
              fontSize: '24px',
              marginBottom: '20px',
              textShadow: `0 0 15px ${breathingPhase === 'inhale' ? '#00f2ff' : '#ffffff'}`,
              animation: `${breathingPhase === 'inhale' ? 'inhaleGlow' : 'exhaleGlow'} 4s infinite`,
            }}
          >
            {breathingPhase.charAt(0).toUpperCase() + breathingPhase.slice(1)} - {progressCount} seconds remaining
          </p>
        </div>
        <div style={{ marginLeft: '20px', position: 'relative' }}>
          <img
            src={sereneImage}
            alt="Serene"
            style={{
              width: '450px',
              animation: `${breathingPhase === 'inhale' ? 'inhaleGlow' : 'exhaleGlow'} 4s infinite`,
            }}
          />
        </div>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes inhaleGlow {
              0%, 100% { text-shadow: 0 0 15px #00f2ff, 0 0 30px #00f2ff; transform: scale(1); }
              50% { text-shadow: 0 0 20px #00e0ff; transform: scale(1.1); }
            }

            @keyframes exhaleGlow {
              0%, 100% { text-shadow: 0 0 15px #ffffff; transform: scale(1); }
              50% { text-shadow: 0 0 20px #e0e0e0; transform: scale(1.1); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default BreathingExercise;
