import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../src/context/userContext';
import { FaTrashCan } from 'react-icons/fa6';
import { useSnackbar } from "notistack";

const ChatRoom = () => {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { userData } = useUserContext();
    const endOfMessagesRef = useRef(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showSpinner, setShowSpinner] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [members, setMembers] = useState([]); // Create state for members
    const titles = ['The Listening Lounge', 'Sunny Side Up', 'Achievement Arena', 'Compassion Corner'];
    let imageNum = userData.userID % 10;

    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await axios.get(`http://localhost:3000/chatroom/${id}`);
            setMembers(response.data.members);
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
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/chatroom/${id}`);
                const data = response.data;
                setMembers(data.members);
                setMessages(data.messages);
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
                            Members in the Room
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
                                                            ):
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
                        <div className="sticky top-0 left-0 right-0 p-4 bg-gray-700 bg-opacity-60 flex items-center h-12">
                            {/* Back Button */}
                            <button
                                onClick={() => {
                                    handleStatusChange(); // Call your status change function
                                    navigate(-1);        // Navigate back
                                }}
                                className="absolute font-PoppinsBold text-white bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded-lg mr-4"
                            >
                                Back To Community
                            </button>
                            {/* Centered Title */}
                            <h2 className="font-DirtyHeadline text-white mx-auto" style={{ letterSpacing: '2px', textAlign: 'center', fontSize: '1.5em' }}>
                                {titles[id - 1]}
                            </h2>
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
        </div>
    );
};

export default ChatRoom;
