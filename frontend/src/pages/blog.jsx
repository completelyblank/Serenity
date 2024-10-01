import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';

const Blog = () => {
  const [categories] = useState(['General', 'Advice', 'Questions', 'Discussion']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [threads, setThreads] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
          backgroundImage: 'url("lights.jpg")',
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
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

        {/* Dark Mode Toggle */}
        <div className="flex justify-end p-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={darkMode} 
              onChange={() => setDarkMode(!darkMode)} 
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-gray-900 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-400"></div>
            <span className="ml-3 text-sm font-medium text-gray-300 dark:text-gray-300">
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </label>
        </div>

        <div className="flex h-full">
          {/* Left Part */}
          <div className="md:w-1/4 w-full backdrop-blur-md bg-white/10 dark:bg-gray-900/70 p-4 flex flex-col fixed h-full rounded-lg shadow-lg">
            <h2 className="font-DirtyHeadline text-3xl text-center text-teal-200 dark:text-teal-400 text-shadow-lg">
              The Zen Board
            </h2>
            <h2 className="font-DirtyHeadline mb-10 text-center text-xl text-teal-100 dark:text-teal-300">
              Share, Reflect, Unwind
            </h2>

            <h2 className="font-DirtyHeadline mb-2 text-center text-lg text-teal-100 dark:text-teal-300">
              Browse Threads
            </h2>

            {/* Dropdown for Categories */}
            <select
              className="w-full p-2 text-center rounded border bg-white/30 dark:bg-gray-800/70 text-black dark:text-teal-700"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Exit Button */}
            <Link
              to="/community"
              className="mt-auto bg-red-500 hover:bg-red-400 text-white dark:bg-red-700 dark:hover:bg-red-500 px-6 py-3 rounded-lg text-center shadow-md"
              style={{ marginLeft: '10%', width: '80%' }}
            >
              Exit Blog
            </Link>
          </div>

          {/* Right Part */}
          <div
            className="md:w-3/4 w-full backdrop-blur-md bg-white/10 dark:bg-gray-900/70 p-4 ml-auto rounded-lg shadow-lg"
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
              <h3 className="text-xl font-bold mb-2 text-white dark:text-gray-200">Create a New Post</h3>
              <form onSubmit={handleNewPostSubmit}>
                <textarea
                  className="w-full p-2 rounded border dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200"
                  placeholder="Share your thoughts..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  style={{ resize: 'none', height: '100px' }}
                />
                <button
                  className="mt-4 px-9 py-2 bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 dark:from-gray-700 dark:to-teal-400 dark:hover:from-gray-900 dark:hover:to-teal-300 text-white dark:text-gray-200 rounded transition duration-200 transform hover:scale-105 shadow-lg"
                  type="submit"
                >
                  Post
                </button>
              </form>
            </div>

            {/* Display Posts */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-teal-400 dark:text-teal-300">Recent Posts</h2>
              {threads.length === 0 ? (
                <p className="text-gray-200 dark:text-gray-400">No posts yet.</p>
              ) : (
                threads.map((thread) => (
                  <div
                    key={thread.id}
                    className="p-4 backdrop-blur-md bg-white/10 dark:bg-gray-800/50 dark:text-gray-300 rounded-lg mb-4 shadow-lg"
                  >
                    <h3 className="text-lg">{thread.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category: {thread.category}</p>
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
