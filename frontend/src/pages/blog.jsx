import React, { useState, useEffect, useRef } from 'react';
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
import { motion } from 'framer-motion';
import { BiSolidLike, BiSolidDislike, BiSolidMessage, BiSend } from "react-icons/bi";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaTrashCan } from 'react-icons/fa6';

const chats = [
  { id: 1, name: 'The Listening Lounge', description: 'A place to talk and be heard' },
  { id: 2, name: 'Sunny Side Up', description: 'Share positive vibes' },
  { id: 3, name: 'Achievement Arena', description: 'Celebrate your wins!' },
  { id: 4, name: 'Compassion Corner', description: 'Discuss feelings with kindness' },
];

const Blog = () => {
  const navigate = useNavigate();
  const repliesEndRef = useRef(null);
  const { userData } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();
  const [chatID, setChatID] = useState("");
  const [categories] = useState(['All Categories', 'General', 'Advice', 'Questions', 'Discussions']);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPostCategory, setSelectedPostCategory] = useState('General');
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [focusReply, setFocusReply] = useState(false);
  const textareaRef = useRef(null);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [newReplyAdded, setNewReplyAdded] = useState(false);
  const [newPostAdded, setNewPostAdded] = useState(false);
  const [deletion, setDeletion] = useState(false);
  const [postOrReply, setPostOrReply] = useState([]);
  const [interactions, setInteractions] = useState(null);
  const [postInteractions, setPostInteractions] = useState([]);
  const [allPostInteractions, setAllPostInteractions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userData || Object.keys(userData).length === 0) {
      navigate('/');
    }
  }, [userData, navigate]);

  if (!userData || Object.keys(userData).length === 0) {
    return null;
  }

  useEffect(() => {
    // Scroll to the newest reply when the replies change
    if (newReplyAdded && repliesEndRef.current) {
      repliesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        setNewReplyAdded(false);
      }, 800);
    }
  }, [replies, newReplyAdded]);

  const handleReplyClick = () => {
    setFocusReply(true);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleDelete = () => {
    setDeletion(!deletion);
  }

  const handleDelete = async (thread) => {
    try {
      const response = await axios.post(`http://localhost:3000/blog/delete`, { deleteID: thread.POST_ID, flag: 1 });
      if (response.status === 200) {
        setThreads((prevThreads) => prevThreads.filter(thr => thr.POST_ID !== thread.POST_ID));
        enqueueSnackbar('Post Deleted', { variant: 'success', autoHideDuration: 1000 });
        if (isPopupOpen) {
          setIsPopupOpen(false);
        }
      }
    } catch (error) {
      console.log("error deleting post");
    }
  };

  const handleLike = async (thread) => {
    try {
      const response = await axios.post(`http://localhost:3000/blog/interact`, { userID: userData.userID, postID: thread.POST_ID, flag: 0 });
      if (response.data.inter === 1) {
        const postID = selectedThread ? selectedThread.POST_ID : thread.POST_ID;
        const response = await axios.post('http://localhost:3000/blog/replies', { userID: userData.userID, postID });
        setReplies(response.data.replies);
        setInteractions(response.data.inter);
        setPostInteractions(response.data.pInter);
        setAllPostInteractions(response.data.allInter);
      } 
    } catch (error) {
      console.log("error liking");
    }
  };

  const handleDislike = async (thread) => {
    try {
      const response = await axios.post(`http://localhost:3000/blog/interact`, { userID: userData.userID, postID: thread.POST_ID, flag: 1 });
      if (response.data.inter === 1) {
        const postID = selectedThread ? selectedThread.POST_ID : thread.POST_ID;
        const response = await axios.post('http://localhost:3000/blog/replies', { userID: userData.userID, postID });
        setReplies(response.data.replies);
        setInteractions(response.data.inter);
        setPostInteractions(response.data.pInter);
        setAllPostInteractions(response.data.allInter);
      } 
    } catch (error) {
      console.log("error disliking");
    }
  };

  const handleDeleteReply = async (reply) => {
    try {
      const response = await axios.post(`http://localhost:3000/blog/delete`, { deleteID: reply.REPLY_ID, flag: 2 });
      if (response.status === 200) {
        setReplies((prevReplies) => prevReplies.filter(rep => rep.REPLY_ID !== reply.REPLY_ID));
        enqueueSnackbar('Reply Deleted', { variant: 'success', autoHideDuration: 1000 });
      }
    } catch (error) {
      console.log("error deleting reply");
    }
  };

  const togglePopup = async (thread) => {
    setIsPopupOpen(!isPopupOpen);
    if (thread != null) {
      setSelectedThread(thread);
      try {
        setRepliesLoading(true);

        await new Promise(resolve => setTimeout(resolve, 700));

        const response = await axios.post('http://localhost:3000/blog/replies', { userID: userData.userID, postID: thread.POST_ID });
        setReplies(response.data.replies);
        setInteractions(response.data.inter);
        setPostInteractions(response.data.pInter);
        setAllPostInteractions(response.data.allInter);
      } catch (error) {
        console.log("Error fetching replies: ", error);
      } finally {
        setRepliesLoading(false);
      }
    }

  };


  const toggleMemberPopup = () => {
    if (!isMember) {
      setIsMemberPopupOpen(!isMemberPopupOpen);
    }
  };

  const checkMember = async (userID, chatRoomID) => {
    try {
      const response = await axios.get('http://localhost:3000/blog/checkMember', { params: { userID, chatRoomID } });
      setIsMember(response.data.member === 1);
      setRequestSent(response.data.requestCheck == 1);
      if (response.data.member === 1) {
        const admin_ID = response.data.ADMIN_ID;
        navigate(`/chatroom/${chatRoomID}`, { state: { admin_ID } });
        return true;
      } else {
        toggleMemberPopup();
        return false;
      }
    } catch (error) {
      console.log("Error checking member status:", error);
    }
  };

  const handleCategorySelect = async (categoryName) => {
    setSelectedCategory(categoryName);
    try {
      setPostsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 700));
      const response = await axios.get('http://localhost:3000/blog', { params: { categoryName } });
      setThreads(response.data.posts);
      setAllPostInteractions(response.data.allInter);
      console.log(response.data.allInter);
    } catch (error) {

    } finally {
      setPostsLoading(false);
    }
  };

  const sendJoinRequest = async (userID, chatRoomID, checkStatus) => {
    try {
      const response = await axios.post('http://localhost:3000/blog/request', { userID, chatRoomID, checkStatus });
      if (response.data.requestSend === 1) {
        enqueueSnackbar('Request Sent Successfully', { variant: 'success', autoHideDuration: 1000 });
      } else {
        enqueueSnackbar('Request Deleted Successfully', { variant: 'success', autoHideDuration: 1000 });
      }
    } catch (error) {
      console.log("Error sending join request:", error);
    }
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    const currentCategory = selectedCategory !== "All Categories" ? selectedCategory : selectedPostCategory;
    if (newPost == '') {
      setError("Post field cannot be empty");
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/blog/post', {
        userID: userData.userID,
        categoryName: currentCategory,
        postContent: newPost
      });

      if (response.data.postSend === 1) {
        console.log("Post submitted successfully");
        setNewPostAdded(true);
        const getPosts = await axios.get('http://localhost:3000/blog', {
          params: { categoryName: selectedCategory }
        });

        setThreads(getPosts.data.posts);
        setNewPost("");
        setAllPostInteractions(getPosts.data.allInter);
        setTimeout(() => {
          setNewPostAdded(false);
        }, 800);
      } else {
        console.log("Error: Post not sent");
      }
    } catch (error) {
      console.error("Error while submitting post:", error);
    }
  };

  const handleNewReplySubmit = async (newReply) => {
    console.log(newReply);
    try {
      const response = await axios.post('http://localhost:3000/blog/reply', {
        userID: userData.userID,
        postID: selectedThread.POST_ID,
        replyContent: newReply
      });

      if (response.data.replySend === 1) {
        console.log("Reply submitted successfully");

        const response = await axios.post('http://localhost:3000/blog/replies', { userID: userData.userID, postID: selectedThread.POST_ID });
        setReplies(response.data.replies);
        setNewReply("");
        setNewReplyAdded(true);


      } else {
        console.log("Error: Reply not sent");
      }
    } catch (error) {
      console.error("Error while submitting reply:", error);
    }
  };

  useEffect(() => {
    let spinnerTimeout;
    const fetchData = async () => {
      try {
        const spinnerTimeout = setTimeout(() => {
          setShowSpinner(false);
        }, 1000);
        setPostsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 700));
        const response = await axios.get('http://localhost:3000/blog', { params: { categoryName: selectedCategory } });
        setThreads(response.data.posts);
        setAllPostInteractions(response.data.allInter);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        clearTimeout(spinnerTimeout);
        setPostsLoading(false);
      }
    };

    fetchData();
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
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                backgroundColor: '#416461',
                color: 'white',
                borderColor: '#1f2c2b',
                textAlign: 'center'
              }}
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
            >
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
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                backgroundImage: 'linear-gradient(to right, #416461, #2f534e)',
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
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #2f534e, #1f3936)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #416461, #2f534e)')}
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
            className="md:w-3/4 w-full backdrop-blur-sm bg-white/10 dark:bg-gray-900/70 p-4 ml-auto rounded-lg shadow-lg overflow-x-hidden mb-9"
            style={{
              padding: '20px',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
          >
            {/* Post Input Box */}
            <div className="backdrop-blur-md bg-white/10 dark:bg-gray-800/50 p-4 rounded-lg mb-4" style={{ boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)' }}>
              <h2 className="mb-2 font-DirtyHeadline"
                style={{
                  color: '#74bdb7',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                  fontSize: '1.7em',
                  textAlign: 'left',
                }}>
                Create a New Post
              </h2>
              <form onSubmit={handleNewPostSubmit}>
                <textarea
                  className="focus: outline-none font-Poppins w-full p-2 pl-4 pr-4 rounded dark:bg-gray-800 dark:text-gray-200"
                  placeholder="Share your thoughts..."
                  value={newPost}
                  onChange={(e) => {
                    setNewPost(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setError("");
                      handleNewPostSubmit(e);
                    }
                  }}
                  style={{ resize: 'none', height: '100px', fontSize: '1em' }}
                />
                <div className='flex flex-row justify-between items-center'>
                  {selectedCategory === "All Categories" && (
                    <select
                      className="w-1/4 h-1/2 p-2 mt-2 text-center rounded border font-Poppins hover: cursor-pointer"
                      style={{
                        backgroundColor: '#416461',
                        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        borderColor: '#1f2c2b',
                        textAlign: 'center'
                      }}
                      value={selectedPostCategory}
                      onChange={(e) => setSelectedPostCategory(e.target.value)}
                    >
                      <option value="General">General</option>
                      <option value="Advice">Advice</option>
                      <option value="Questions">Questions</option>
                      <option value="Discussions">Discussions</option>
                    </select>
                  )}

                  <h1 className='mt-2 font-PoppinsBold ml-5' style={{ color: '#be3030', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)', }}>{error}</h1>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className="w-1/5 h-1/2 p-2 mt-2 text-center rounded border font-Poppins ml-auto cursor-pointer"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #416461, #2f534e)',
                      color: 'white',
                      borderColor: '#1f2c2b',
                      textAlign: 'center',
                      fontSize: '1em',
                      transition: 'background-color 0.1s ease',
                      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                    }}
                    type="submit"
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #2f534e, #1f3936)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #416461, #2f534e)')}
                  >
                    Post
                  </motion.button>

                </div>
              </form>
            </div>

            {/* Display Threads */}
            {postsLoading ? (
              <div>
                {/* Render Pulsating Skeleton Loaders for posts */}
                <div className="animate-pulse">
                  {[...Array(2)].map((_, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/10 dark:bg-gray-800/50 rounded-lg mb-4 shadow-lg"
                    >
                      <div className="flex flex-row items-start">
                        <Skeleton circle={true} height={30} width={30} containerClassName="mr-4" />
                        <div className="flex flex-col w-full">
                          <Skeleton
                            width="60%"
                            height={20}
                            containerClassName="mb-2"
                            style={{ borderRadius: '10px' }}
                          />
                          <Skeleton
                            width="80%"
                            height={15}
                            containerClassName="mb-2"
                            style={{ borderRadius: '10px' }}
                          />
                          <Skeleton
                            width="90%"
                            height={50}
                            containerClassName="mb-2"
                            style={{ borderRadius: '10px' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2
                  className="mb-6 mt-6 font-DirtyHeadline"
                  style={{
                    color: '#74bdb7',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                    fontSize: '1.7em',
                    textAlign: 'center',
                  }}
                >
                  All Posts (Most Recent First)
                </h2>
                {threads.length === 0 ? (
                  <p className="font-Poppins text-gray-200 dark:text-gray-400" style={{ fontSize: '1.1em' }}>
                    No posts yet.
                  </p>
                ) : (
                  threads.map((thread) => {
                    const interaction = allPostInteractions.find((item) => item.POST_ID === thread.POST_ID && item.USER_ID === userData.userID);
                    const interactions = interaction ? interaction.INTERACTION : 2;

                    return (
                      <div
                        key={thread.POST_ID}
                        className={`p-4 backdrop-blur-md bg-white/10 dark:bg-gray-800/50 dark:text-gray-300 rounded-lg mb-4 shadow-lg relative ${newPostAdded && thread.POST_ID === threads[0]?.POST_ID ? 'highlightPost' : ''
                          }`}
                        style={{
                          minHeight: '150px',
                          overflow: 'hidden',
                          wordWrap: 'break-word',
                          boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                          marginBottom: '5%',
                        }}
                      >
                        <div className="flex flex-row">
                          <img
                            src={
                              thread.GENDER === 'F'
                                ? `/girls/${thread.USER_ID % 10}.jpg`
                                : `/boys/${thread.USER_ID % 10}.jpg`
                            }
                            alt="Member"
                            className="rounded-full"
                            style={{ width: '30px', height: '30px', marginRight: '10px' }}
                          />

                          <div className="flex flex-col w-3/4">
                            <div className="flex flex-row space-x-2">
                              <h3
                                className="text-lg font-PoppinsBold"
                                style={{
                                  fontSize: '1.1em',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  color: darkMode ? '#70bdb7' : '#0b0629',
                                }}
                              >
                                {thread.FIRST_NAME} {thread.LAST_NAME}
                              </h3>
                              {thread.USER_ID === userData.userID && (
                                <button
                                  className="cursor-pointer"
                                  onClick={() => {
                                    toggleDelete();
                                    setPostOrReply([0, thread]);
                                  }}
                                >
                                  <FaTrashCan className="w-5 h-5 text-[#a03b3b] hover:text-[#832020]" />
                                </button>
                              )}
                            </div>
                            <h3
                              className="font-PoppinsBold mb-2"
                              style={{
                                fontSize: '0.9em',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: darkMode ? '#60928e' : '#0b0629',
                              }}
                            >
                              @{thread.USERNAME}
                            </h3>
                            <h3
                              className="text-lg font-Poppins mb-2"
                              style={{
                                fontSize: '1em',
                                whiteSpace: 'normal',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                color: darkMode ? '#ffffff' : '#000000',
                              }}
                            >
                              {thread.POST_CONTENT}
                            </h3>
                          </div>
                        </div>
                        <p
                          className="font-Poppins text-sm absolute top-2 right-2 p-2"
                          style={{ color: darkMode ? '#b8b8b8' : '#181818' }}
                        >
                          {thread.P_DATE} - {thread.P_TIME}
                        </p>
                        <p
                          className="font-PoppinsBold text-sm dark:text-gray-500 absolute top-8 right-2 p-2"
                          style={{ color: darkMode ? '#70bdb7' : '#0b0629' }}
                        >
                          {thread.POST_CATEGORY}
                        </p>
                        <div className='flex flex-row justify-end items-center'>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            className="flex items-center px-3 py-1 rounded font-PoppinsBold"
                            style={{
                              backgroundColor: 'transparent',
                              color: interactions === 0 ? '#70bdb7' : '#8f8f8f',
                              transition: '0.2s ease',
                            }}
                            onClick={() => handleLike(thread)}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = darkMode ? '#4e4e4e' : '#211a46')
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <BiSolidLike className="mr-1" /> {interactions === 0 ? 'Liked' : 'Like'}
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            className="flex items-center px-3 py-1 rounded font-PoppinsBold"
                            style={{
                              backgroundColor: 'transparent',
                              color: interactions == 1 ? '#70bdb7' : '#8f8f8f',
                              transition: '0.2s ease',
                            }}
                            onClick={() => handleDislike(thread)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? '#4e4e4e' : '#211a46')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <BiSolidDislike className="mr-1" /> {interactions === 1 ? 'Disliked' : 'Dislike'}
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            className="flex p-2 w-1/6 h-1/4 text-center items-center justify-center rounded border font-Poppins hover:cursor-pointer"
                            style={{
                              backgroundImage: 'linear-gradient(to right, #416461, #2f534e)',
                              color: 'white',
                              borderColor: '#1f2c2b',
                              textAlign: 'center',
                              fontSize: '1em',
                              transition: 'background-color 0.1s ease',
                              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                              marginLeft: '10px',
                            }}
                            type="submit"
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #2f534e, #1f3936)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #416461, #2f534e)')
                            }
                            onClick={() => togglePopup(thread)}
                          >
                            View Replies
                          </motion.button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isPopupOpen && selectedThread && (
        <div className="flex flex-col justify-center text-center fixed inset-0 bg-black bg-opacity-50 items-center z-50">
          <div
            className="relative rounded-lg shadow-lg bg-white dark:bg-gray-800"
            style={{
              width: '60%',
              height: '90%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              overflowY: 'auto',
              maxHeight: '90%',
            }}
          >
            {/* Sticky Header and Close Button Wrapper */}
            <div
              className="sticky border-b border-gray-500 top-0 bg-white dark:bg-gray-800 z-10 flex items-center justify-between inset-x-0 mb-9"
              style={{

                padding: '1.1rem 2rem',
              }}
            >
              {/* Centered Header */}
              <h3
                className="font-DirtyHeadline text-center flex-grow"
                style={{
                  fontSize: '2em',
                  letterSpacing: '2px',
                  color: darkMode ? '#70bdb7' : '#0b0629',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                }}
              >
                {selectedThread.FIRST_NAME} {selectedThread.LAST_NAME}'s Post
              </h3>

              {selectedThread.USER_ID === userData.userID && (
                <button
                  className='absolute right-5 cursor-pointer'
                  onClick={() => {
                    toggleDelete();
                    setPostOrReply([0, selectedThread]);
                  }}
                >
                  <FaTrashCan
                    className={`w-5 h-5 text-[#a03b3b] hover:text-[#832020]`}
                  />
                </button>
              )}

              {/* Close Button */}
              <button
                className="absolute text-white px-4 py-2 rounded font-PoppinsBold"
                style={{
                  zIndex: '20',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                  background: 'linear-gradient(90deg, #e45a5a, #ff1a1a)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #e26464, #e50000)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #e45a5a, #ff1a1a)';
                }}
                onClick={() => togglePopup(null)}
              >
                Close
              </button>

            </div>

            {/* Image and text aligned left */}
            <div className="flex flex-row items-center justify-start px-8">
              {repliesLoading ? (
                <Skeleton
                  circle={true}
                  height={50}
                  width={50}
                  containerClassName="mr-4"
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <img
                  src={
                    selectedThread.GENDER === 'F'
                      ? `/girls/${selectedThread.USER_ID % 10}.jpg`
                      : `/boys/${selectedThread.USER_ID % 10}.jpg`
                  }
                  alt="Member"
                  className="rounded-full"
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
              )}

              <div className="flex flex-col">
                {repliesLoading ? (
                  <>
                    <Skeleton width={150} height={20} containerClassName="mb-2" />
                    <Skeleton width={100} height={15} />
                  </>
                ) : (
                  <>
                    <h3 className="font-PoppinsBold text-l text-left" style={{ color: darkMode ? '#70bdb7' : '#0b0629' }}>
                      {selectedThread.FIRST_NAME} {selectedThread.LAST_NAME}
                    </h3>
                    <h3 className="font-Poppins text-sm dark:text-gray-400 text-left">
                      {selectedThread.P_DATE} <br /> {selectedThread.P_TIME}
                    </h3>
                  </>
                )}
              </div>
            </div>

            {repliesLoading ? (
              <Skeleton
                width="90%"
                height={80}
                containerClassName="mt-7 mb-8 "
                style={{ borderRadius: '10px' }}
              />
            ) : (
              <h3 className="font-Poppins text-m dark:text-gray-200 text-left mt-7 mb-8 px-8">
                {selectedThread.POST_CONTENT}
              </h3>
            )}
            <div
              className="flex flex-row p-2 border-t border-b border-gray-500"
            >
              <div
                className="flex flex-row justify-start items-center space-x-2"
                style={{
                  width: '100%',
                }}
              >
                {/* Like, Dislike, and Reply Buttons */}
                {repliesLoading ? (
                  <div
                    className="pl-5 flex flex-row justify-start items-center space-x-5"
                    style={{
                      width: '100%',
                    }}
                  >
                    {/* Skeleton loaders for the buttons */}
                    <Skeleton
                      width={70}
                      height={20}
                      containerClassName="rounded"
                      style={{ borderRadius: '20px' }}
                    />
                    <Skeleton
                      width={70}
                      height={20}
                      containerClassName="rounded"
                      style={{ borderRadius: '20px' }}
                    />
                    <Skeleton
                      width={70}
                      height={20}
                      containerClassName="rounded"
                      style={{ borderRadius: '20px' }}
                    />
                  </div>
                ) : (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="flex items-center px-3 py-1 rounded font-PoppinsBold"
                      style={{
                        backgroundColor: 'transparent',
                        color: interactions == 0 ? '#70bdb7' : '#8f8f8f',
                        transition: '0.2s ease',
                      }}
                      onClick={() => handleLike(selectedThread)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? '#4e4e4e' : '#211a46')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <BiSolidLike className="mr-1" /> {interactions === 0 ? 'Liked' : 'Like'}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="flex items-center px-3 py-1 rounded font-PoppinsBold"
                      style={{
                        backgroundColor: 'transparent',
                        color: interactions == 1 ? '#70bdb7' : '#8f8f8f',
                        transition: '0.2s ease',
                      }}
                      onClick={() => handleDislike(selectedThread)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? '#4e4e4e' : '#211a46')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <BiSolidDislike className="mr-1" /> {interactions === 1 ? 'Disliked' : 'Dislike'}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="flex items-center px-3 py-1 rounded font-PoppinsBold"
                      style={{
                        backgroundColor: 'transparent',
                        color: !darkMode ? '#70bdb7' : '#8f8f8f',
                        transition: '0.2s ease',
                      }}
                      onClick={handleReplyClick}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? '#4e4e4e' : '#211a46')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <BiSolidMessage className="mr-1" /> Reply
                    </motion.button>
                  </>
                )}

              </div>
              <div
                className="pr-6 flex flex-row justify-end items-center space-x-5"
                style={{
                  width: '100%',
                }}
              >
                {repliesLoading ? (
                  <Skeleton
                    width={70}
                    height={20}
                    containerClassName="rounded"
                    style={{ borderRadius: '10px' }}
                  />
                ) : (
                  <h1
                    className="rounded font-PoppinsBold mt-1 mb-1"
                    style={{
                      width: 'fit-content',
                      color: !darkMode ? '#70bdb7' : '#8f8f8f',
                    }}
                  >
                    {postInteractions.LIKES} {postInteractions.LIKES === 1 ? "Like" : "Likes"}
                  </h1>
                )}

                {repliesLoading ? (
                  <Skeleton
                    width={90}
                    height={20}
                    containerClassName="rounded"
                    style={{ borderRadius: '10px' }}
                  />
                ) : (
                  <h1
                    className="rounded font-PoppinsBold mt-1 mb-1"
                    style={{
                      width: 'fit-content',
                      color: !darkMode ? '#70bdb7' : '#8f8f8f',
                    }}
                  >
                    {postInteractions.DISLIKES} {postInteractions.DISLIKES === 1 ? "Dislike" : "Dislikes"}
                  </h1>
                )}

                {repliesLoading ? (
                  <Skeleton
                    width={80}
                    height={20}
                    containerClassName="rounded"
                    style={{ borderRadius: '10px' }}
                  />
                ) : (
                  <h1
                    className="rounded font-PoppinsBold mt-1 mb-1"
                    style={{
                      width: 'fit-content',
                      color: !darkMode ? '#70bdb7' : '#8f8f8f',
                    }}
                  >
                    {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
                  </h1>
                )}
              </div>
            </div>
            <br />
            {repliesLoading ? (
              <div>
                {/* Render Pulsating Skeleton Loaders for replies with matching padding */}
                <div className="flex flex-row items-start animate-pulse">
                  <Skeleton
                    circle={true}
                    height={30}
                    width={30}
                    containerClassName="ml-4"
                  />
                  <div className="flex flex-col w-full">
                    <Skeleton width="90%" height={50} containerClassName="mb-2" style={{ borderRadius: '20px' }} />
                    <Skeleton width="90%" height={50} containerClassName="mb-2" style={{ borderRadius: '20px' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {replies.length === 0 ? (
                  <p className="font-Poppins text-gray-200 dark:text-gray-400" style={{ fontSize: '1em' }}>
                    Be the first to reply.
                  </p>
                ) : (
                  replies.map((reply) => (
                    <div
                      key={reply.REPLY_ID}
                      className="flex flex-col justify-start pt-3 pb-3 pl-4 pr-4 relative"
                      style={{
                        wordWrap: 'break-word',
                      }}
                    >
                      <div className="flex flex-row items-start">
                        <img
                          src={reply.GENDER === 'F' ? `/girls/${reply.USER_ID % 10}.jpg` : `/boys/${reply.USER_ID % 10}.jpg`}
                          alt="Member"
                          className="rounded-full"
                          style={{ width: '30px', height: '30px', marginRight: '10px' }}
                        />
                        <div
                          className={`flex flex-col w-full text-left bg-gray-700 p-3 pl-4 pr-4 ${newReplyAdded && reply.REPLY_ID === replies[replies.length - 1].REPLY_ID ? 'highlightReply' : ''}`}
                          style={{ borderRadius: '25px' }}
                        >
                          <div className="flex flex-row">
                            <div className="flex flex-col">
                              <h3
                                className="text-lg font-PoppinsBold"
                                style={{
                                  fontSize: '1em',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  color: darkMode ? '#70bdb7' : '#0b0629',
                                }}
                              >
                                {reply.FIRST_NAME} {reply.LAST_NAME}
                              </h3>
                              <h3
                                className="font-PoppinsBold mb-2"
                                style={{
                                  fontSize: '0.9em',
                                  whiteSpace: 'nowrap',
                                  color: darkMode ? '#60928e' : '#0b0629',
                                }}
                              >
                                @{reply.USERNAME}
                              </h3>
                            </div>
                            {reply.USER_ID === userData.userID && (
                              <button
                                className='mb-8 cursor-pointer'
                                onClick={() => {
                                  toggleDelete();
                                  setPostOrReply([1, reply]);
                                }}
                              >
                                <FaTrashCan
                                  className={`w-5 h-5 text-[#a03b3b] hover:text-[#832020]`}
                                />
                              </button>
                            )}
                            <div className="ml-auto flex flex-col">
                              <p
                                className="font-Poppins text-sm"
                                style={{ color: darkMode ? '#b8b8b8' : '#181818' }}
                              >
                                {reply.R_DATE}
                              </p>
                              <p
                                className="ml-auto font-Poppins text-sm"
                                style={{ color: darkMode ? '#b8b8b8' : '#181818' }}
                              >
                                {reply.R_TIME}
                              </p>
                            </div>
                          </div>

                          <h3
                            className="text-lg font-Poppins mb-2"
                            style={{
                              fontSize: '1em',
                              whiteSpace: 'normal',
                              color: darkMode ? '#ffffff' : '#000000',
                            }}
                          >
                            {reply.REPLY_CONTENT}
                          </h3>

                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Reply Box */}
            <div className='sticky bottom-0 mt-auto flex flex-row px-4 py-4 font-Poppins dark:bg-gray-800 dark:text-gray-300' style={{ fontSize: '1em' }}>
              <img
                src={userData.gender === 'F' ? `/girls/${userData.userID % 10}.jpg` : `/boys/${userData.userID % 10}.jpg`}
                alt="Member"
                className="rounded-full"
                style={{ width: '30px', height: '30px', marginRight: '10px' }}
              />
              <div
                className="flex flex-col dark:bg-gray-700 dark:text-gray-300 w-full pl-2 pr-3 pb-3"
                style={{ borderRadius: '20px', maxHeight: '100px' }}
              >
                <textarea
                  ref={textareaRef}
                  className="p-2 rounded bg-transparent resize-none focus: outline-none"
                  placeholder="Write your reply here..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  onFocus={() => setFocusReply(true)}
                  onBlur={() => setFocusReply(false)}
                  style={{ maxHeight: '50px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleNewReplySubmit(newReply);
                    }
                  }}
                />
                <button
                  className="ml-auto"
                  onClick={() => {
                    handleNewReplySubmit(newReply)
                  }}
                >
                  <BiSend className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div ref={repliesEndRef}></div>
          </div>
        </div>
      )}

      {isMember == false && isMemberPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="relative p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800"
            style={{
              width: '50%',
              height: '50%',
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

            {/* Button to Send Join Request */}
            {requestSent == 1 && (
              <>
                {chatID && (
                  <h3 className="font-DirtyHeadline mb-10"
                    style={{
                      fontSize: '2em',
                      textAlign: 'center',
                      letterSpacing: '2px',
                      color: '#74bdb7',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                    }}>
                    Your Request Is Pending Approval
                  </h3>
                )}
                <button
                  className="bg-red-500 text-white px-8 py-3 rounded font-PoppinsBold hover:bg-red-600 mb-4"
                  style={{ fontSize: '1.1em' }}
                  onClick={() => {
                    sendJoinRequest(userData.userID, chatID, 0);
                    setRequestSent(0);
                  }}
                >
                  Cancel Request
                </button>
              </>
            )}
            {requestSent == 0 && (
              <>
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
                <button
                  style={{ fontSize: '1.1em' }}
                  className="bg-green-700 text-white px-8 py-3 rounded font-PoppinsBold hover:bg-green-900 mb-4"
                  onClick={() => {
                    sendJoinRequest(userData.userID, chatID, 1);
                    setRequestSent(1);
                  }}
                >
                  Send Join Request
                </button>
              </>
            )}

            {/* Popup Button */}
            <button
              className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-red-600"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                background: 'linear-gradient(90deg, #e45a5a, #ff1a1a)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #e26464, #e50000)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #e45a5a, #ff1a1a)';
              }}
              onClick={toggleMemberPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {deletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="relative p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800"
            style={{
              width: '50%',
              height: '30%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <h3 className="font-DirtyHeadline mb-7"
              style={{
                fontSize: '2em',
                textAlign: 'center',
                letterSpacing: '2px',
                color: '#74bdb7',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
              }}>
              Confirm Deletion
            </h3>
            <div className='w-full flex flex-row justify-center items-center space-x-12'>
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="w-1/4 p-2 text-center items-center justify-center rounded border font-Poppins hover:cursor-pointer"
                style={{
                  backgroundImage: 'linear-gradient(to right, #416461, #2f534e)',
                  color: 'white',
                  borderColor: '#1f2c2b',
                  textAlign: 'center',
                  fontSize: '1em',
                  transition: 'background-color 0.1s ease',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                }}
                type="submit"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #2f534e, #1f3936)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #416461, #2f534e)')
                }
                onClick={() => {
                  if (postOrReply[0] === 0) {
                    handleDelete(postOrReply[1]);
                  } else {
                    handleDeleteReply(postOrReply[1]);
                  }
                  toggleDelete();
                }}
              >
                Yes
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="w-1/4 p-2 text-center items-center justify-center rounded border font-Poppins hover:cursor-pointer"
                style={{
                  backgroundImage: 'linear-gradient(to right, #416461, #2f534e)',
                  color: 'white',
                  borderColor: '#1f2c2b',
                  textAlign: 'center',
                  fontSize: '1em',
                  transition: 'background-color 0.1s ease',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                }}
                type="submit"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #2f534e, #1f3936)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #416461, #2f534e)')
                }
                onClick={toggleDelete}
              >
                No
              </motion.button>
            </div>
            {/* Popup Button */}
            <button
              className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-red-600"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                background: 'linear-gradient(90deg, #e45a5a, #ff1a1a)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #e26464, #e50000)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #e45a5a, #ff1a1a)';
              }}
              onClick={toggleDelete}
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
