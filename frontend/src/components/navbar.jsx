import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); // Get current route
  const [activeLink, setActiveLink] = useState(null); // Track which link is active
  const [hoveredLink, setHoveredLink] = useState(null); // Track which link is hovered

  // On component mount, set the active link based on the current URL or from localStorage
  useEffect(() => {
    const savedActiveLink = localStorage.getItem('activeLink');
    const currentPath = location.pathname;

    if (savedActiveLink) {
      setActiveLink(savedActiveLink);
    } else {
      // Set active link based on current route
      if (currentPath.includes('dashboard')) setActiveLink('Dashboard');
      if (currentPath.includes('analysis')) setActiveLink('Analysis');
      if (currentPath.includes('form')) setActiveLink('Mood Form');
      if (currentPath.includes('games')) setActiveLink('Games');
      if (currentPath.includes('profile')) setActiveLink('Profile');
    }
  }, [location.pathname]); // Run this effect on page load or route change

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    localStorage.setItem('activeLink', linkName); // Store active link in localStorage
  };

  const getLinkStyle = (linkName) => ({
    color: activeLink === linkName ? '#ffffff' : hoveredLink === linkName ? '#a0f5d4' : '#7fddb9', // Different colors for active, hover, and normal states
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
    transition: 'color 0.3s ease',
    fontSize: '1.1em',
  });

  const toggleProfileMenu = () => {
    const newActiveLink = activeLink === 'Profile' ? null : 'Profile';
    setActiveLink(newActiveLink);
    localStorage.setItem('activeLink', newActiveLink); // Persist profile state
  };

  return (
    <nav
      className="flex items-center justify-between bg-gray-900 p-5 font-PoppinsBold"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
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
        {/* Nav links with hover and active state */}
        <Link
          to="/login"
          style={getLinkStyle('Dashboard')}
          onClick={() => handleLinkClick('Dashboard')}
          onMouseEnter={() => setHoveredLink('Dashboard')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Dashboard
        </Link>
        <Link
          to="/analysis"
          style={getLinkStyle('Analysis')}
          onClick={() => handleLinkClick('Analysis')}
          onMouseEnter={() => setHoveredLink('Analysis')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Analysis
        </Link>
        <Link
          to="/form"
          style={getLinkStyle('Mood Form')}
          onClick={() => handleLinkClick('Mood Form')}
          onMouseEnter={() => setHoveredLink('Mood Form')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Mood Form
        </Link>
        <Link
          to="/games"
          style={getLinkStyle('Games')}
          onClick={() => handleLinkClick('Games')}
          onMouseEnter={() => setHoveredLink('Games')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Games
        </Link>

        {/* Profile button with dropdown */}
        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            onMouseEnter={() => setHoveredLink('Profile')}
            onMouseLeave={() => setHoveredLink(null)}
            style={getLinkStyle('Profile')}
          >
            Profile
          </button>

          {activeLink === 'Profile' && (
            <div
              className="absolute right-0 w-48 bg-white shadow-lg rounded-md flex flex-col"
              style={{
                zIndex: 100,
                borderRadius: '5px',
                backgroundColor: '#16423C',
                color: '#7fddb9',
                marginTop: '60%',
                alignItems: 'center',
                marginRight: '-30%'
              }}
            >
              {/* Arrow pointing up */}
              <div
                className="absolute top-[-7px] right-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent"
                style={{
                  borderBottomColor: '#16423C', // Arrow color
                  transform: 'translateX(50%)',
                }}
              ></div>
              <img src='../../src/assets/avatar.png' alt='Profile' className="w-3/4 pt-4" />
              <Link
                to="/profile"
                className="block px-4 py-2 pt-5"
                style={{ color: '#7fddb9', fontSize: '1.1em' }}
              >
                View Profile
              </Link>
              <hr className="w-3/4" style={{ border: '1px solid #5f8d87' }} />
              <Link
                to="/"
                className="block px-4 py-2 pb-5"
                style={{ color: '#7fddb9', fontSize: '1.1em' }}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
