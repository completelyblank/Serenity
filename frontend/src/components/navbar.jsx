import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for client-side routing

const Navbar = () => {
  const linkStyle = {
    color: '#7fddb9', // Replace with your hex code for blue (equivalent to blue-900)
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
    transition: 'color 0.3s ease',
    fontSize: '1.1em',
  };

  const handleMouseEnter = (e) => {
    e.target.style.color = '#a0f5d4'; // Hover color
  };

  const handleMouseLeave = (e) => {
    e.target.style.color = '#7fddb9'; // Revert to original color
  };

  return (
    <nav
      className="flex items-center justify-between bg-gray-900 p-5 font-PoppinsBold"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50, // Make sure it's above other content
        opacity: 0.85,
        backgroundColor: '#16423C',
      }}
    >
      <div
        className="text-lg font-bold ml-2"
        style={{
          fontSize: '2.2em',
          fontFamily: 'PoppinsBold',
          color: '#7fddb9',
          textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
        }}
      >
        Serenity
      </div>
      <div className="flex space-x-5 mr-5">
        <Link
          to="/login"
          style={linkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Dashboard
        </Link>
        <Link
          to="/analysis"
          style={linkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Analysis
        </Link>
        <Link
          to="/form"
          style={linkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Mood Form
        </Link>
        <Link
          to="/jumper"
          style={linkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Games
        </Link>
        <Link
          to="/profile"
          style={linkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
