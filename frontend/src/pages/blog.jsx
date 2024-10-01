import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';

const Blog = () => {
  const [categories] = useState(['General', 'Advice', 'Questions', 'Discussion']); // Predefined categories
  const [selectedCategory, setSelectedCategory] = useState(''); // For filtering threads
  const [threads, setThreads] = useState([]); // For storing threads
  const [newPost, setNewPost] = useState(''); // For storing new post content
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);

  const handleNewPostSubmit = (e) => {
    e.preventDefault();
    if (newPost) {
      const newThread = { id: threads.length + 1, title: newPost, category: selectedCategory || 'General' };
      setThreads([...threads, newThread]);
      setNewPost(''); // Clear the new post input
    }
  };

  useEffect(() => {
    const spinnerTimeout = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    setLoading(false);
    return () => clearTimeout(spinnerTimeout); // Clean up the timeout on unmount
  }, []);

  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-hidden" style={{ backgroundColor: '#b2dfdb' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden relative" style={{
      backgroundColor: '#74bdb7', backgroundImage: 'url("lights.jpg")', backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    }}>
      <Navbar />
      <div className="flex h-full">
        {/* Left part */}
        <div className="md:w-1/4 w-full bg-gray-200 p-4 flex flex-col" style={{ position: 'fixed', height: '100%', backgroundColor: '#16423C', opacity: '0.95' }}>
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
            }}>Browse Threads</h2>

          {/* Dropdown for categories */}
          <select
            className="w-full p-2 text-center rounded border font-PoppinsBold hover: cursor-pointer"
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
          {/* Exit button */}
          <Link to="/community" className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white font-PoppinsBold rounded-lg shadow-lg hover:from-red-500 hover:to-red-700 transition duration-300 ease-in-out transform"
            style={{
              marginLeft: '10%',
              marginTop: 'auto', // Ensures the button is at the bottom
              width: '80%',
              textAlign: 'center'
            }}
          >
            Exit Blog
          </Link>
        </div>

        {/* Right part */}
        <div className="md:w-3/4 w-full bg-gray-300 p-4 ml-auto" style={{
          borderRadius: '20px',
          height: '86.5vh',
          backgroundColor: '#cde6f1',
          opacity: '0.65',
          marginLeft: '25.8%',
          marginTop: '10px',
          marginRight: '10px',
          marginBottom: '10px',
          padding: '20px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}>
          {/* Post Input Box */}
          <div style={{
            padding: '20px',
            backgroundColor: '#e0f7fa',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontFamily: 'PoppinsBold', fontSize: '1.5em', marginBottom: '10px' }}>Create a New Post</h3>
            <form onSubmit={handleNewPostSubmit}>
              <textarea
                className="w-full p-2 rounded"
                style={{
                  fontFamily: 'Poppins',
                  height: '100px',
                  border: '1px solid #ccc',
                  padding: '10px',
                  resize: 'none',
                }}
                placeholder="Share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <button
                className="mt-4 px-9 py-2 text-white rounded transition duration-200 transform hover:scale-105"
                style={{
                  backgroundColor: '#1f2c2b',
                  fontFamily: 'PoppinsBold',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                  marginLeft: '88.5%'
                }}
                type="submit"
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 0 20px #1f2c2b';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
                }}
              >
                Post
              </button>
            </form>
          </div>

          {/* Display Posts */}
          <div>
            <h2 style={{ fontFamily: 'PoppinsBold', fontSize: '1.5em', marginBottom: '10px' }}>Recent Posts</h2>
            {threads.length === 0 ? (
              <p style={{fontFamily: 'Poppins', fontSize: '1.1em'}}>No posts yet.</p>
            ) : (
              threads.map((thread) => (
                <div key={thread.id} style={{
                  padding: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  fontFamily: 'Poppins',
                }}>
                  <h3 style={{ fontSize: '1.1em', marginBottom: '5px' }}>{thread.title}</h3>
                  <p style={{ fontFamily: 'PoppinsBold', fontSize: '1.1em', color: '#888' }}>Category: {thread.category}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
