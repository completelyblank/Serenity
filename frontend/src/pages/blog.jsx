import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
import Toggle from 'react-toggle';
import ChatList from '../components/chatlist';
import "react-toggle/style.css";
import { FaSun, FaMoon } from 'react-icons/fa';

const Blog = () => {
  const [categories] = useState(['General', 'Advice', 'Questions', 'Discussion']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [threads, setThreads] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [selectedThread, setSelectedThread] = useState(null);

  const togglePopup = (thread) => {
    setSelectedThread(thread); // Set the clicked thread
    setIsPopupOpen(!isPopupOpen); // Toggle popup
  };

  const handleNewPostSubmit = (e) => {
    e.preventDefault();
    if (newPost) {
      const newThread = { id: threads.length + 1, title: newPost, category: selectedCategory || 'General' };
      setThreads([...threads, newThread]);
      setNewPost('');
    }
  };

  useEffect(() => {
    const spinnerTimeout = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    setLoading(false);
    return () => clearTimeout(spinnerTimeout);
  }, []);

  if (loading || showSpinner) {
    return (
      <div
        className="h-screen overflow-hidden"
        style={{
          backgroundColor: '#b2dfdb'
        }}
      >
        <Navbar />
        <Spinner />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div
        className="h-screen overflow-hidden relative"
        style={{
          backgroundImage: darkMode ? 'url("lights.jpg")' : 'url("lights.jpg")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Navbar />

        <div className="flex h-full">
          {/* Left Part */}
          <div className="md:w-1/4 w-full backdrop-blur-sm bg-white/10 dark:bg-gray-900/70 p-4 flex flex-col fixed h-full shadow-lg">
            <h2
              className="font-DirtyHeadline"
              style={{
                fontSize: '3.1em',
                textAlign: 'center',
                color: '#74bdb7',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
              }}
            >
              The Zen Board
            </h2>
            <h2
              className="font-DirtyHeadline mb-10"
              style={{
                fontSize: '1.5em',
                textAlign: 'center',
                color: '#74bdb7',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
              }}
            >
              Share, Reflect, Unwind
            </h2>

            <h2 className="mb-2 font-DirtyHeadline"
              style={{
                color: '#74bdb7',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                fontSize: '1.7em',
                textAlign: 'center'
              }}>
              Browse Threads
            </h2>

            {/* Dropdown for Categories */}
            <select
              className="w-full p-2 text-center rounded border font-Poppins hover: cursor-pointer"
              style={{
                backgroundColor: '#416461',
                color: 'wheat',
                borderColor: '#1f2c2b',
                textAlign: 'center'
              }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option> {/* Option to show all categories */}
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <h2 className="mb-2 mt-5 font-DirtyHeadline"
              style={{
                color: '#74bdb7',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                fontSize: '1.7em',
                textAlign: 'center'
              }}>
              Chats
            </h2>
            <ChatList />
            <div className="flex-grow"></div>

            {/* Dark Mode Toggle */}
            <div className="flex justify-start p-4 mt-auto mb-9 pb-9">
              <label className="relative inline-flex items-center cursor-pointer">
                <Toggle
                  className='custom-classname'
                  id="dark-mode-toggle"
                  defaultChecked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  icons={{
                    unchecked: (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <FaSun style={{ color: 'orange' }} />
                      </div>
                    ),
                    checked: (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <FaMoon style={{ color: 'white' }} />
                      </div>
                    ),
                  }}
                />
                <label
                  htmlFor="dark-mode-toggle"
                  className="font-PoppinsBold ml-2 text-black-900 dark:text-gray-200"
                  style={{ fontSize: '1.1em' }}
                >
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </label>
              </label>
            </div>
          </div>

          {/* Right Part */}
          <div
            className="md:w-3/4 w-full backdrop-blur-sm bg-white/10 dark:bg-gray-900/70 p-4 ml-auto rounded-lg shadow-lg overflow-x-hidden"
            style={{
              borderRadius: '20px',
              height: '86.5vh',
              marginLeft: '25.8%',
              marginTop: '10px',
              marginRight: '10px',
              marginBottom: '10px',
              padding: '20px',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
          >
            {/* Post Input Box */}
            <div className="bg-white/20 dark:bg-gray-800/50 p-4 rounded-lg mb-4">
              <h2 className="mb-2 font-DirtyHeadline"
                style={{
                  color: '#74bdb7',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                  fontSize: '1.7em',
                  textAlign: 'left'
                }}>
                Create a New Post
              </h2>
              <form onSubmit={handleNewPostSubmit}>
                <textarea
                  className="font-Poppins w-full p-2 pl-4 pr-4 rounded border dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200"
                  placeholder="Share your thoughts..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  style={{ resize: 'none', height: '100px' }}
                />
                <button
                  className="font-PoppinsBold mt-4 px-9 py-2 bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 dark:from-gray-700 dark:to-teal-400 dark:hover:from-gray-900 dark:hover:to-teal-300 text-white dark:text-gray-200 rounded transition duration-200 transform hover:scale-105 shadow-lg"
                  style={{ fontSize: '1.1em', marginLeft: '88%' }}
                  type="submit"
                >
                  Post
                </button>
              </form>
            </div>

            {/* Display Threads */}
            <div>
              <h2 className="mb-2 font-DirtyHeadline" style={{ color: '#74bdb7', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)', fontSize: '1.7em', textAlign: 'left' }}>Recent Posts</h2>
              {threads.length === 0 ? (
                <p className="font-Poppins text-gray-200 dark:text-gray-400" style={{ fontSize: '1.1em' }}>No posts yet.</p>
              ) : (
                threads.map((thread) => (
                  <div
                    key={thread.id}
                    className="p-4 backdrop-blur-md bg-white/10 dark:bg-gray-800/50 dark:text-gray-300 rounded-lg mb-4 shadow-lg hover:cursor-pointer"
                    style={{ maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', wordWrap: 'break-word' }}
                    onClick={() => togglePopup(thread)}
                  >
                    <h3 className="text-lg font-Poppins mb-2" style={{ fontSize: '1.1m', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#70bdb7' }}>{thread.title}</h3>
                    <p className="text-sm dark:text-gray-500">{thread.category}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
