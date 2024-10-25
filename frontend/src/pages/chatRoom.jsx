import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../src/context/userContext';
import { FaTrashCan } from 'react-icons/fa6';
import { useSnackbar } from "notistack";
import { motion } from 'framer-motion';

const ChatRoom = () => {
    const { id } = useParams();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const { userData } = useUserContext();
    const endOfMessagesRef = useRef(null);
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLeavePopupOpen, setIsLeavePopupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lastActive, setLastActive] = useState("");
    const [showSpinner, setShowSpinner] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [messages, setMessages] = useState([]);
    const [requests, setRequests] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [members, setMembers] = useState([]);
    const [adminID, setAdminID] = useState(0);
    const titles = ['The Listening Lounge', 'Sunny Side Up', 'Achievement Arena', 'Compassion Corner'];
    let imageNum = userData.userID % 10;

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const toggleLeavePopup = () => {
        setIsLeavePopupOpen(!isLeavePopupOpen);
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await axios.get(`http://localhost:3000/chatroom/${id}`, { params: { userID: userData.userID } });
            const sortedMembers = response.data.members.sort((a, b) => (a.USER_ID === userData.userID ? -1 : b.USER_ID === userData.userID ? 1 : 0));
            setMembers(sortedMembers);
            setRequests(response.data.requests);
            setLastActive(response.data.lastActive);
            const newMessages = response.data.messages;
            if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
                console.log("setting");
                setMessages(newMessages);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [id, messages]);

    useEffect(() => {
        let spinnerTimeout;
        const spinnerShow = async () => {
            try {
                await new Promise((resolve) => {
                    spinnerTimeout = setTimeout(() => {
                        setShowSpinner(false);
                        resolve();
                    }, 1000);
                });
            } finally {
                setLoading(false);
                clearTimeout(spinnerTimeout);
            }
        };

        spinnerShow();
    }, []);

    useEffect(() => {
        const { state } = location;
        if (state !== null) {
            const { admin_ID } = state;
            setAdminID(admin_ID);
        }
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/chatroom/${id}`, { params: { userID: userData.userID } });
                const data = response.data;
                const sortedMembers = data.members.sort((a, b) => (a.USER_ID === userData.userID ? -1 : b.USER_ID === userData.userID ? 1 : 0));
                setMembers(sortedMembers);
                setMembers(data.members);
                setMessages(data.messages);
                setLastActive(response.data.lastActive);
                setRequests(response.data.requests);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const updateStatus = async () => {
            try {
                const response = await axios.post(`http://localhost:3000/chatroom/${id}`, { userID: userData.userID, active: 1 });
            } catch (error) {
                console.log("error changing status");
            }
        };

        updateStatus();
    }, [id]);


    useEffect(() => {
        // Scroll to the bottom whenever loading changes
        if (!loading) {
            endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [loading]);

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]); // Runs whenever messages change

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (newMessage.trim()) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const newMsg = {
                member: `${userData.FIRST_NAME} ${userData.LAST_NAME}`,
                USER_ID: userData.userID,
                MESSAGE_CONTENT: newMessage,
                SENT_TIME: time,
            };

            try {
                const response = await axios.post(`http://localhost:3000/chatroom/${id}/message`, { userID: userData.userID, messageContent: newMessage });
                const message = response.data;

                // Ensure message contains valid data before updating state
                if (message && message.USER_ID && message.MESSAGE_CONTENT) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                } else {
                    console.error('Received invalid message:', message);
                }

                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };


    const handleDeleteMessage = async (message) => {
        try {
            const response = await axios.post(`http://localhost:3000/chatroom/${id}/delete`, { messageID: message.MESSAGE_ID });
            if (response.status === 200) {
                setMessages((prevMessages) => prevMessages.filter(msg => msg.MESSAGE_ID !== message.MESSAGE_ID));
                enqueueSnackbar('Message Deleted', { variant: 'success', autoHideDuration: 1000 });
            }
        } catch (error) {
            console.log("error deleting message");
        }
    };

    const handleLeaveChatroom = async () => {
        try {
            if (adminID == userData.userID) {
                const response = await axios.post(`http://localhost:3000/chatroom/${id}/leave`, { userID: userData.userID, admin: members[1].USER_ID });
            } else {
                const response = await axios.post(`http://localhost:3000/chatroom/${id}/leave`, { userID: userData.userID, admin: 0 });
            }
        } catch (error) {
            console.log("error leaving chatroom");
        }
    };

    const acceptRequest = async (request) => {
        try {
            const response = await axios.post(`http://localhost:3000/chatroom/${id}/acceptRequest`, { userID: request.USER_ID });
            if (response.status === 200) {
                setRequests((prevRequests) => prevRequests.filter(r => r.USER_ID !== request.USER_ID));
                enqueueSnackbar('Request Accepted', { variant: 'success', autoHideDuration: 1000 });
                const response = await axios.get(`http://localhost:3000/chatroom/${id}`, { params: { userID: userData.userID } });
                const data = response.data;
                const sortedMembers = data.members.sort((a, b) => (a.USER_ID === userData.userID ? -1 : b.USER_ID === userData.userID ? 1 : 0));
                setMembers(sortedMembers);
            }
        } catch (error) {
            console.log("error accepting request");
        }

    };

    const deleteRequest = async (request) => {
        try {
            const response = await axios.post(`http://localhost:3000/chatroom/${id}/deleteRequest`, { userID: request.USER_ID });
            if (response.status === 200) {
                setRequests((prevRequests) => prevRequests.filter(r => r.USER_ID !== request.USER_ID));
                enqueueSnackbar('Request Deleted', { variant: 'success', autoHideDuration: 1000 });
            }
        } catch (error) {
            console.log("error deleting request");
        }
    };

    // Function to format the date as readable
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleStatusChange = async (event) => {
        try {
            const response = await axios.post(`http://localhost:3000/chatroom/${id}`, { userID: userData.userID, active: 0 });
        } catch (error) {
            console.log("error changing status");
        }
    };

    useEffect(() => {
        // Trigger handleStatusChange when the component is unmounted
        return () => {
            handleStatusChange();
        };
    }, []);

    const unreadMessages = messages.filter(message => new Date(message.SENT_TIME) > new Date(lastActive));

    if (loading || showSpinner) {
        return (
            <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#b2dfdb' }}>
                <Navbar />
                <Spinner />
            </div>
        );
    }

    return (
        <div className={'dark'}>
            <div className="h-screen overflow-hidden relative">
                <Navbar />
                <div className="flex">
                    {/* Left Part */}
                    <div style={{ maxHeight: '100vh' }} className="md:w-1/4 w-full backdrop-blur-sm bg-white/10 dark:bg-gray-900/70 p-4 ml-auto rounded-lg shadow-lg overflow-x-hidden">
                        <h2 className="font-DirtyHeadline" style={{
                            fontSize: '3.1em',
                            textAlign: 'center',
                            color: '#74bdb7',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                        }}>
                            <br />
                            The Zen Board
                        </h2>
                        <h2 className="font-DirtyHeadline mb-10" style={{
                            fontSize: '1.5em',
                            textAlign: 'center',
                            color: '#74bdb7',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                        }}>
                            Share, Reflect, Unwind
                        </h2>

                        <h2 className="mb-2 font-DirtyHeadline" style={{
                            color: '#74bdb7',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                            fontSize: '1.7em',
                            textAlign: 'center'
                        }}>
                            {titles[id - 1]}
                        </h2>

                        <h2 className="mb-2 mt-5 font-DirtyHeadline" style={{
                            color: '#74bdb7',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                            fontSize: '1.7em',
                            textAlign: 'center'
                        }}>
                            Members in the Room ({members.length})
                        </h2>
                        <div style={{ paddingBottom: '100px' }}>
                            {/* Scrollable Members Table */}
                            <div className="flex-grow overflow-y-auto max-h-60 mt-5">
                                <table className="w-full text-left" style={{
                                    backgroundColor: '#416461',
                                    fontFamily: 'Poppins',
                                    borderCollapse: 'collapse',
                                    textAlign: 'center',
                                    color: 'white',
                                    borderRadius: '2%',
                                    position: 'relative',
                                }}>
                                    <tbody>
                                        {members.map((member, index) => (
                                            <tr key={index}>
                                                <td className="font-Poppins p-2" style={{ borderBottom: '2px solid #1f2c2b' }}>
                                                    <div className="flex items-center justify-between ml-2">
                                                        {/* Member Name and Avatar */}
                                                        <div className="flex items-center">
                                                            <img
                                                                src={(member.GENDER === 'F'
                                                                    ? `/girls/${member.USER_ID % 10}.jpg`
                                                                    : `/boys/${member.USER_ID % 10}.jpg`
                                                                )
                                                                }
                                                                alt="Member"
                                                                className="rounded-full"
                                                                style={{ width: '30px', height: '30px', marginRight: '10px' }}
                                                            />
                                                            {member.USER_ID === userData.userID ? (
                                                                <span>{member.FIRST_NAME} {member.LAST_NAME} (You)</span>
                                                            ) :
                                                                <span>{member.FIRST_NAME} {member.LAST_NAME}</span>
                                                            }
                                                        </div>

                                                        {/* Green Circle to show Active Status */}
                                                        <div
                                                            className="rounded-full"
                                                            style={{
                                                                backgroundColor: member.IS_ACTIVE ? '#1eff00' : '#f04c4c',
                                                                width: '12px',
                                                                height: '12px',
                                                                marginRight: '10px',
                                                                boxShadow: member.IS_ACTIVE ? '0 0 10px rgba(30, 255, 0, 0.8), 0 0 20px rgba(30, 255, 0, 0.6)' : '0 0 10px rgba(240, 76, 76, 0.8), 0 0 20px rgba(240, 76, 76, 0.6)',
                                                                transition: 'box-shadow 0.3s ease',
                                                            }}
                                                            title="Active"
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {adminID == userData.userID && (
                                <>
                                    <h2 className="mb-2 mt-9 font-DirtyHeadline" style={{
                                        color: '#74bdb7',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                                        fontSize: '1.7em',
                                        textAlign: 'center'
                                    }}>
                                        Join Requests
                                    </h2>
                                    <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        className="font-PoppinsBold flex items-center justify-center p-1 mt-7 pt-2 pb-2"
                                        style={{
                                            fontSize: '1.1em',
                                            marginLeft: '17%',
                                            width: '65%',
                                            backgroundColor: '#74bdb7',
                                            borderRadius: '10px'
                                        }}
                                        type="submit"
                                        onClick={togglePopup}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#559992'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#74bdb7'}
                                    >
                                        View Requests
                                    </motion.button>
                                </>
                            )}
                        </div>
                        <div className="flex-grow"></div>
                    </div>

                    {/* Right Part */}
                    <div
                        className="md:w-3/4 w-max-full backdrop-blur-sm bg-white/10 dark:bg-gray-900/70 p-4 ml-auto rounded-lg shadow-lg overflow-x-hidden"
                        style={{
                            borderRadius: '20px',
                            height: '86.5vh',
                            width: '73.5%',
                            marginLeft: '10px',
                            marginTop: '5.8%',
                            marginRight: '10px',
                            marginBottom: '10px',
                            padding: '0px',
                            boxSizing: 'border-box',
                            backgroundImage: `url("/chatBack${id}.jpg")`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            opacity: '0.6',
                        }}
                    >
                        {/* Header Div */}
                        <div className="sticky top-0 left-0 right-0 p-4 bg-gray-700 flex items-center h-12">
                            {/* Back Button */}
                            <button
                                onClick={() => {
                                    handleStatusChange(); // Call your status change function
                                    navigate(-1);        // Navigate back
                                }}
                                className="font-PoppinsBold text-white bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded-lg mr-auto"
                            >
                                Back To Community
                            </button>
                            {/* Title */}
                            <h2 className="font-DirtyHeadline text-white" style={{ letterSpacing: '2px', textAlign: 'center', fontSize: '1.5em' }}>
                                {titles[id - 1]}
                            </h2>

                            {/* Leave Chatroom Button */}
                            <button
                                onClick={() => {
                                    toggleLeavePopup();
                                }}
                                className="font-PoppinsBold text-white bg-red-600 hover:bg-red-500 px-4 py-1 rounded-lg ml-auto"
                            >
                                Leave Chatroom
                            </button>
                        </div>


                        {/* Message Box */}
                        <div className="mr-5 ml-5 mt-8 font-Poppins flex-grow overflow-y-auto" style={{ fontSize: '1em' }}>
                            {messages.map((message, index) => {
                                const previousMessage = messages[index - 1];
                                const showDate =
                                    !previousMessage ||
                                    new Date(previousMessage.SENT_DATE).toDateString() !== new Date(message.SENT_DATE).toDateString();

                                return (
                                    <div key={index}>
                                        {showDate && (
                                            <div
                                                className="font-PoppinsBold text-center text-black pt-1 pb-1"
                                                style={{ backgroundColor: '#b4b3b3', width: '20%', margin: '0 auto', marginBottom: '3%', borderRadius: '10px', opacity: '0.7' }}
                                            >
                                                {formatDate(message.SENT_DATE)}
                                            </div>
                                        )}

                                        <div className={`flex mb-4 ${message.USER_ID === userData.userID ? 'justify-end' : 'justify-start'}`}>
                                            {/* For messages sent by the user */}
                                            {message.USER_ID === userData.userID ? (
                                                <div className="flex items-center justify-end" style={{ maxWidth: '45%', wordBreak: 'break-word' }}>
                                                    <div className={`font-Poppins rounded-lg p-2 pl-4 pr-4 bg-blue-300 text-black`}>
                                                        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                            <p style={{ fontSize: '0.9em', fontFamily: 'PoppinsBold', margin: 0 }}>{userData.firstName} {userData.lastName}</p>
                                                            <button onClick={() => handleDeleteMessage(message)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                                                <FaTrashCan className='pl-3 h-6 w-6' />
                                                            </button>
                                                        </span>
                                                        <p>{message.MESSAGE_CONTENT}</p>
                                                        <p className="font-PoppinsBold text-xs text-gray-800 text-right mt-1">{message.SENT_TIME}</p>
                                                    </div>
                                                    {/* User's profile image on the right */}
                                                    <img
                                                        src={(userData.gender === 'F'
                                                            ? `/girls/${userData.userID % 10}.jpg`
                                                            : `/boys/${userData.userID % 10}.jpg`
                                                        )}
                                                        alt="User"
                                                        className="rounded-full"
                                                        style={{ width: '30px', height: '30px', marginLeft: '10px' }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-start" style={{ maxWidth: '45%', wordBreak: 'break-word' }}>
                                                    {/* Show avatar and name for other users */}
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={(message.GENDER === 'F'
                                                                ? `/girls/${message.USER_ID % 10}.jpg`
                                                                : `/boys/${message.USER_ID % 10}.jpg`
                                                            )}
                                                            alt="Member"
                                                            className="rounded-full"
                                                            style={{ width: '30px', height: '30px', marginRight: '10px' }}
                                                        />
                                                    </div>
                                                    <div className={`font-Poppins rounded-lg p-2 pl-4 pr-4 bg-gray-300 text-black`}>
                                                        <p className="font-Poppins">{message.member}</p>
                                                        <p style={{ fontSize: '0.9em', fontFamily: 'PoppinsBold', margin: 0 }}>{message.FIRST_NAME} {message.LAST_NAME}</p>
                                                        <p>{message.MESSAGE_CONTENT}</p>
                                                        <p className="font-PoppinsBold text-xs text-gray-800 mt-1">{message.SENT_TIME}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={endOfMessagesRef} />
                        </div>

                        {/* Message Input */}
                        {/* Message Input Box */}
                        <div
                            className="sticky bottom-0 left-0 right-0 p-4 bg-gray-800 bg-opacity-60 flex items-center justify-between"
                            style={{ borderRadius: '20px' }}
                        >
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="font-Poppins flex-grow rounded-lg p-2 text-black pl-4"
                                placeholder="Type your message..."
                                style={{ backgroundColor: 'white', borderRadius: '10px', marginRight: '10px' }}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="font-PoppinsBold text-white bg-blue-500 hover:bg-blue-400 px-8 py-2 rounded-lg"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isPopupOpen && adminID == userData.userID && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
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
                        <h3
                            className="font-DirtyHeadline mb-10"
                            style={{
                                fontSize: '2em',
                                textAlign: 'center',
                                letterSpacing: '2px',
                                color: '#74bdb7',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                            }}
                        >
                            Join Requests ({requests.length})
                        </h3>
                        <div className="flex-grow overflow-y-auto max-h-60 mb-5 w-full">
                            <table className="w-full">
                                <tbody>
                                    {requests.map((request, index) => (
                                        <tr key={index}>
                                            <td
                                                className="font-Poppins p-2"
                                                style={{ borderBottom: '2px solid #1f2c2b' }}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    {/* Left-aligned content */}
                                                    <div className="flex items-center">
                                                        <img
                                                            src={
                                                                request.GENDER === 'F'
                                                                    ? `/girls/${request.USER_ID % 10}.jpg`
                                                                    : `/boys/${request.USER_ID % 10}.jpg`
                                                            }
                                                            alt="Request"
                                                            className="rounded-full"
                                                            style={{ width: '50px', height: '50px', marginRight: '20px' }}
                                                        />
                                                        <div
                                                            className="flex flex-col font-PoppinsBold"
                                                            style={{ fontSize: '1em', color: '#74bdb7' }}
                                                        >
                                                            <h1>{request.FIRST_NAME} {request.LAST_NAME}</h1>
                                                            <h1 style={{ fontFamily: 'Poppins', color: '#40918a' }}>@{request.USERNAME}</h1>
                                                        </div>
                                                    </div>
                                                    {/* Right-aligned button */}
                                                    <div className="font-PoppinsBold flex justify-end mr-5">
                                                        <motion.button
                                                            whileTap={{ scale: 0.85 }}
                                                            onClick={() => acceptRequest(request)}
                                                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mr-4"
                                                        >
                                                            Accept
                                                        </motion.button>
                                                        <motion.button
                                                            whileTap={{ scale: 0.85 }}
                                                            onClick={() => deleteRequest(request)}
                                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                                        >
                                                            Decline
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Close Popup Button */}
                        <button
                            className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-red-600"
                            onClick={togglePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isLeavePopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
                    <div
                        className="relative p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800"
                        style={{
                            width: '45%',
                            height: '40%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <h3
                            className="font-DirtyHeadline mb-10"
                            style={{
                                fontSize: '2em',
                                textAlign: 'center',
                                letterSpacing: '2px',
                                color: '#74bdb7',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                            }}
                        >
                            Are You Sure?
                        </h3>

                        <motion.button
                            className="bg-red-700 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-red-800 flex items-center justify-center p-1 mt-2 pt-2 pb-2"
                            style={{
                                fontSize: '1.1em',
                                width: '50%',
                                borderRadius: '10px'
                            }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => {
                                handleLeaveChatroom();
                                navigate(-1);
                            }}
                           
                        >
                            Leave Chat Room
                        </motion.button>
                        

                        {/* Close Popup Button */}
                        <button
                            className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded font-PoppinsBold hover:bg-red-600"
                            onClick={toggleLeavePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;