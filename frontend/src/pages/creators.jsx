import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const creators = [
  {
    name: 'Amna Shah',
    role: 'Engineering Wizard',
    bio: 'Excels in backend development while ensuring every part of the system works perfectly.',
    theme: 'from-red-600/60 to-red-900/60',
    background: '../src/assets/red.jpg',
    image: '../src/assets/amna.jpg',
  },
  {
    name: 'Muhammad Raza Khan',
    role: 'Creative Visionary',
    bio: 'Brings out-of-the-box solutions and creativity into every aspect of the project.',
    theme: 'from-black/60 to-gray-700/60',
    background: '../src/assets/black.jpg',
    image: '../src/assets/muhammad.jpg',
  },
  {
    name: 'Zehra Waqar',
    role: 'Frontend + DB Architect',
    bio: 'Calm and logical, she shapes ideas into reality with her frontend and database expertise.',
    theme: 'from-teal-500/60 to-teal-700/60',
    background: '../src/assets/blue.jpg',
    image: '../src/assets/zehra.jpg',
  },
];

const CreatorsPage = () => {
  const [activeCreator, setActiveCreator] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCreator((prev) => (prev + 1) % creators.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentCreator = creators[activeCreator];

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white px-8 py-16 flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${currentCreator.background})` }}
    >
      <motion.h1
        className="text-4xl md:text-6xl font-KgTen mb-12 text-center text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Meet the Creators
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl font-bold text-gray-200 text-center max-w-2xl mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Celebrating the talent, dedication, and creativity behind this project.
      </motion.p>
      <AnimatePresence>
        <motion.div
          key={currentCreator.name}
          className={`relative w-full max-w-4xl flex flex-col items-center text-center p-8 bg-gradient-to-br ${currentCreator.theme} rounded-xl shadow-lg backdrop-blur-lg bg-opacity-40 border border-gray-700`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={currentCreator.image}
            alt={currentCreator.name}
            className="w-64 h-64 object-cover rounded-lg mb-6 shadow-xl border-4 border-gray-900"
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
          <motion.h2
            className="text-3xl font-bold text-gray-300 mb-2 drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {currentCreator.name}
          </motion.h2>
          <motion.p
            className="text-xl italic text-gray-200 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {currentCreator.role}
          </motion.p>
          <motion.p
            className="text-gray-100 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {currentCreator.bio}
          </motion.p>
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <button className="px-8 py-4 bg-gradient-to-br from-pink-700 to-black rounded-lg text-gray-200 font-bold hover:from-black hover:to-pink-700 transition-all duration-300 shadow-lg">
          Explore the Website
        </button>
      </motion.div>
    </div>
  );
};

export default CreatorsPage;
