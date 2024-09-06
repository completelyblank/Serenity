import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for client-side routing

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-900 p-4" style={{ opacity: 0.85, backgroundColor: 'rgba(198, 226, 255, 0.2)' }}>
      <div
        className="text-lg font-bold"
        style={{
          fontSize: '2em',
          fontFamily: 'Poppins',
          color: '#C8857E', // Soft pastel blue for the text
          textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)', // Subtle shadow for a calming effect
        }}
      >
        Serenity
      </div>
      <div className="flex space-x-4">
        <Link
          to="/"
          className="text-pink-900 hover:text-pink-700 transition duration-300"
          style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)' }}
        >
          Dashboard
        </Link>
        <Link
          to="/analysis"
          className="text-pink-900 hover:text-pink-700 transition duration-300"
          style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)' }}
        >
          Analysis
        </Link>
        <Link
          to="/form"
          className="text-pink-900 hover:text-pink-700 transition duration-300"
          style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)' }}
        >
          Mood Form
        </Link>
        <Link
          to="/jumper"
          className="text-pink-900 hover:text-pink-700 transition duration-300"
          style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)' }}
        >
          Jumper Game
        </Link>
        <Link
          to="/breathe"
          className="text-pink-900 hover:text-pink-700 transition duration-300"
          style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)' }}
        >
          Breathe
        </Link>
        <Link
          to="/memory"
          className="text-pink-900 hover:text-pink-700 transition duration-300"
          style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)' }}
        >
          Memory Game
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
