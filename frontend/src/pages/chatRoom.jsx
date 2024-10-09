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
    const [lastActive, setLastActive] = useState("");
    const [showSpinner, setShowSpinner] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [members, setMembers] = useState([]);
    const titles = ['The Listening Lounge', 'Sunny Side Up', 'Achievement Arena', 'Compassion Corner'];
    let imageNum = userData.userID % 10;

    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await axios.get(`http://localhost:3000/chatroom/${id}`, { params: { userID: userData.userID } });
            const sortedMembers = response.data.members.sort((a, b) => (a.USER_ID === userData.userID ? -1 : b.USER_ID === userData.userID ? 1 : 0));
            setMembers(sortedMembers);
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
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/chatroom/${id}`, { params: { userID: userData.userID } });
                const data = response.data;
                const sortedMembers = data.members.sort((a, b) => (a.USER_ID === userData.userID ? -1 : b.USER_ID === userData.userID ? 1 : 0));
                setMembers(sortedMembers);
                setMembers(data.members);
                setMessages(data.messages);
                setLastActive(response.data.lastActive);
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
                                                <td className="font-Poppins p-2" style={{ borderBottom: '1px solid white' }}>
                                                    {member.FIRST_NAME} {member.LAST_NAME}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Part */}
                    <div className="flex flex-col justify-between w-full md:w-3/4 p-6 bg-white dark:bg-gray-800">
                        <div className="flex-grow overflow-y-auto mb-4">
                            {messages.map((message, index) => {
                                const isUnread = new Date(message.SENT_TIME) > new Date(lastActive);
                                const showUnreadLabel = index === 0 || (new Date(messages[index - 1].SENT_TIME) <= new Date(lastActive) && isUnread);

                                return (
                                    <div key={index}>
                                        {showUnreadLabel && (
                                            <div className="unread-label">
                                                <strong>Unread Messages</strong>
                                            </div>
                                        )}
                                        <div className={`message ${isUnread ? 'unread' : ''}`}>
                                            <p><strong>{message.member}:</strong> {message.MESSAGE_CONTENT}</p>
                                            <small>{message.SENT_TIME}</small>
                                            {message.USER_ID === userData.userID && (
                                                <button onClick={() => handleDeleteMessage(message)} className="delete-button">
                                                    <FaTrashCan />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={endOfMessagesRef}></div>
                        </div>

                        <form onSubmit={handleSendMessage} className="flex">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-grow border border-gray-300 rounded-lg px-4 py-2 mr-2"
                                placeholder="Type your message..."
                            />
                            <button type="submit" className="bg-blue-500 text-white px-4 rounded-lg">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
