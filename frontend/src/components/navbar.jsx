import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for client-side routing

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-900 p-4 opacity-60">
      <div
        className="text-white text-lg font-bold"
        style={{
          fontSize: '2em',
          fontFamily: 'Poppins',
          color: '#FFFFFF',
          textShadow: '10px 10px 10px #000000',
        }}
      >
        DreamCatcher
      </div>
      <div className="flex space-x-4">
        <Link to="/" className="text-gray-400 hover:text-white transition duration-300">
          Dashboard
        </Link>
        <Link to="/home" className="text-gray-400 hover:text-white transition duration-300">
          Homepage
        </Link>
        <Link to="/analysis" className="text-gray-400 hover:text-white transition duration-300">
          Analysis
        </Link>
        <Link to="/form" className="text-gray-400 hover:text-white transition duration-300">
          Dream Form
        </Link>
        <Link to="/jumper" className="text-gray-400 hover:text-white transition duration-300">
          Jumper Game
        </Link>
        <Link to="/quiz" className="text-gray-400 hover:text-white transition duration-300">
          Quiz Game
        </Link>
        <Link to="/memory" className="text-gray-400 hover:text-white transition duration-300">
          Memory Game
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
