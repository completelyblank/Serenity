import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import { FaSun, FaMoon } from 'react-icons/fa';
import '../index.css';
import { useUserContext } from '../../src/context/userContext';
import axios from 'axios';
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';

const chats = [
  { id: 1, name: 'The Listening Lounge', description: 'A place to talk and be heard' },
  { id: 2, name: 'Sunny Side Up', description: 'Share positive vibes' },
  { id: 3, name: 'Achievement Arena', description: 'Celebrate your wins!' },
  { id: 4, name: 'Compassion Corner', description: 'Discuss feelings with kindness' },
];

const Blog = () => {
  const navigate = useNavigate();
  const { userData } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();
  const [chatID, setChatID] = useState("");
  const [categories] = useState(['General', 'Advice', 'Questions', 'Discussion']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [threads, setThreads] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [selectedThread, setSelectedThread] = useState(null);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [adminID, setAdminID] = useState(0);

  const togglePopup = (thread) => {
    setSelectedThread(thread); // Set the clicked thread
    setIsPopupOpen(!isPopupOpen); // Toggle popup
  };

  const toggleMemberPopup = () => {
    if (!isMember) {
      setIsMemberPopupOpen(!isMemberPopupOpen); // Toggle popup
    }
  };

  const checkMember = async (userID, chatRoomID) => {
    try {
      const response = await axios.get('http://localhost:3000/blog/checkMember', { params: { userID, chatRoomID } });
      setIsMember(response.data.member === 1);
      setRequestSent(response.data.requestCheck == 1);
      if (response.data.member === 1) {
        const admin_ID = response.data.ADMIN_ID;
        navigate(`/chatroom/${chatRoomID}`, {state: { admin_ID }});
        return true;
      } else {
        toggleMemberPopup();
        return false;
      }
    } catch (error) {
      console.log("Error checking member status:", error);
    }
  };

  const sendJoinRequest = async (userID, chatRoomID, checkStatus) => {
    try {
      const response = await axios.post('http://localhost:3000/blog/request', { userID, chatRoomID, checkStatus });
      if(response.data.requestSend === 1) {
        enqueueSnackbar('Request Sent Successfully', { variant: 'success', autoHideDuration: 1000 });
      } else {
        enqueueSnackbar('Request Deleted Successfully', { variant: 'success', autoHideDuration: 1000 });
      }
      toggleMemberPopup();
    } catch (error) {
      console.log("Error sending join request:", error);
    }
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
          <div className="md:w-1/4 w-full backdrop-blur-sm bg-white/10 dark:bg-gray-900/70 p-4 ml-auto rounded-lg shadow-lg overflow-x-hidden">
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

            <h2 className="mb-2 mt-5 font-DirtyHeadline overflow-y-hidden"
              style={{
                color: '#74bdb7',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                fontSize: '1.7em',
                textAlign: 'center'
              }}>
              Chats
            </h2>
            <table
              style={{
                backgroundColor: '#416461',
                fontFamily: 'Poppins',
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'center',
                height: '30%',
                color: 'white',
                borderRadius: '2%',
                position: 'relative'
              }}
            >
              <tbody>
                {chats.map((chat) => (
                  <tr key={chat.id}>
                    <td
                      style={{
                        padding: '8px',
                        height: '30px',
                        verticalAlign: 'middle',
                        borderBottom: '2px solid #1f2c2b',
                        position: 'relative',
                        backgroundColor: hoveredChat === chat.id ? '#2b3b38' : 'transparent', // Darker background on hover
                        transition: 'background-color 0.3s ease', // Smooth transition
                      }}
                      onMouseEnter={() => setHoveredChat(chat.id)}
                      onMouseLeave={() => setHoveredChat(null)}
                    >
                      <Link
                        to={isMember ? `/chatroom/${chat.id}` : '/blog'}
                        style={{
                          textDecoration: 'none',
                          color: 'white',
                          display: 'block',
                          height: '100%',
                          lineHeight: '30px',
                        }}
                        onClick={() => {
                          if (checkMember(userData.userID, chat.id) != true) {
                            setChatID(chat.id);
                            
                          }
                        }}
                      >
                        {chat.name}
                      </Link>

                      {/* Tooltip for the chat description */}
                      {hoveredChat === chat.id && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '40px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '5px',
                            fontSize: '1em',
                            width: '50%',
                            height: '200%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            zIndex: 1000,
                            fontFamily: 'Poppins'
                          }}
                        >
                          {chat.description}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              marginLeft: '10px',
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
                  id='post_button'
                  className="font-PoppinsBold flex items-center justify-center p-1 mt-3 mb-3"
                  style={{ fontSize: '1.2em', marginLeft: '83%', width: '16%' }}
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
      {/* Popup Modal */}
      {isPopupOpen && selectedThread && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="relative p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800"
            style={{
              width: '60%',
              height: '60%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <h3 className="font-DirtyHeadline mb-10"
              style={{
                fontSize: '2em',
                textAlign: 'center',
                letterSpacing: '2px',
                color: '#74bdb7',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
              }}>
              Replies
            </h3>
            <h3 className="font-PoppinsBold text-xl dark:text-gray-200">
              {selectedThread?.title}
            </h3>
            {/* Popup Button */}
            <button
              className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-red-600"
              onClick={togglePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isMember == false && isMemberPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="relative p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800"
            style={{
              width: '60%',
              height: '60%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <h3 className="font-DirtyHeadline mb-10"
              style={{
                fontSize: '2em',
                textAlign: 'center',
                letterSpacing: '2px',
                color: '#74bdb7',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
              }}>
              You Don't Have Access
            </h3>
            {chatID && (
              <h3 className="font-DirtyHeadline mb-10"
                style={{
                  fontSize: '2em',
                  textAlign: 'center',
                  letterSpacing: '2px',
                  color: '#74bdb7',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                }}>

                Request To Join {chats[chatID - 1].name}


              </h3>
            )}

            {/* Button to Send Join Request */}
            {requestSent == 1 && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-blue-600 mb-4"
                onClick={() => sendJoinRequest(userData.userID, chatID, 0)}
              >
                Cancel Request
              </button>
            )}
            {requestSent == 0 && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-blue-600 mb-4"
                onClick={() => sendJoinRequest(userData.userID, chatID, 1)}
              >
                Send Join Request
              </button>
            )}

            {/* Popup Button */}
            <button
              className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-red-600"
              onClick={toggleMemberPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
