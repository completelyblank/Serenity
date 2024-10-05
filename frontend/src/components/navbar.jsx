import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../src/context/userContext';

const Navbar = () => {
  const { userData } = useUserContext();
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // Programmatic navigation
  const [hoveredLink, setHoveredLink] = useState(null); // Track which link is hovered
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State to control profile menu visibility
  let imageNum = userData.userID % 10;

  // Automatically highlight the link that matches the current path
  const getLinkStyle = (linkName, path) => {
    const isActive = location.pathname === path;

    return {
      color: isActive
        ? '#ffffff' // Active link color
        : hoveredLink === linkName
          ? '#a0f5d4' // Hover color
          : '#7fddb9', // Default link color
      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
      transition: 'color 0.3s ease',
      fontSize: '1.1em',
    };
  };

  // Toggle profile menu visibility
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Handle "View Profile" click inside the profile dropdown
  const handleViewProfile = () => {
    setIsProfileMenuOpen(false); // Close the dropdown
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <nav
      className="flex items-center justify-between bg-gray-900 p-5 font-PoppinsBold"
      style={{
        position: 'sticky', 
        top: 0,
        zIndex: 50,
        width: '100%', // Ensure it stretches across the screen
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
          to="/dashboard"
          style={getLinkStyle('Dashboard', '/dashboard')}
          onMouseEnter={() => setHoveredLink('Dashboard')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Dashboard
        </Link>
        <Link
          to="/analysis"
          style={getLinkStyle('Analysis', '/analysis')}
          onMouseEnter={() => setHoveredLink('Analysis')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Analysis
        </Link>
        <Link
          to="/form"
          style={getLinkStyle('Mood Form', '/form')}
          onMouseEnter={() => setHoveredLink('Mood Form')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Mood Form
        </Link>
        <Link
          to="/games"
          style={getLinkStyle('Games', '/games')}
          onMouseEnter={() => setHoveredLink('Games')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Games
        </Link>

        <Link
          to="/blog"
          style={getLinkStyle('Blog', '/blog')}
          onMouseEnter={() => setHoveredLink('Blog')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Community
        </Link>

        {/* Profile button with dropdown */}
        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            onMouseEnter={() => setHoveredLink('Profile')}
            onMouseLeave={() => setHoveredLink(null)}
            style={getLinkStyle('Profile', '/profile')}
          >
            Profile
          </button>

          {/* Toggle the dropdown based on state */}
          {isProfileMenuOpen && (
            <div
              className="absolute right-0 w-48 bg-white shadow-lg rounded-md flex flex-col"
              style={{
                zIndex: 100,
                borderRadius: '5px',
                backgroundColor: '#16423C',
                color: '#7fddb9',
                marginTop: '60%',
                alignItems: 'center',
                marginRight: '-30%',
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
              <div
                className="w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-center bg-cover mb-2 mt-4"
                style={{
                  backgroundImage: `url(${!userData || !userData.gender ? '/unknown.jpg' : userData.gender === 'F' ? `/girls/${imageNum}.jpg` : `/boys/${imageNum}.jpg`})`,
                }}
              />
              <p className='pb-2' style={{ color: '#7fddb9', fontSize: '1.1em', textAlign: 'center', marginTop: '5%' }}>{userData.firstName}</p>
              <hr className="w-3/4" style={{ border: '1px solid #5f8d87' }} />
              <button
                onClick={handleViewProfile} // Handle click to navigate to profile
                className="block px-4 py-2 pt-2"
                style={{ color: '#7fddb9', fontSize: '1.1em' }}
              >
                View Profile
              </button>
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
