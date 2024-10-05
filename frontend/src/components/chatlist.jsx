import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../src/context/userContext';
import axios from 'axios';

const ChatList = () => {
    const [hoveredChat, setHoveredChat] = useState(null);
    const { userData } = useUserContext();

    const chats = [
        { id: 1, name: 'The Listening Lounge', description: 'A place to talk and be heard' },
        { id: 2, name: 'Sunny Side Up', description: 'Share positive vibes' },
        { id: 3, name: 'Achievement Arena', description: 'Celebrate your wins!' },
        { id: 4, name: 'Compassion Corner', description: 'Discuss feelings with kindness' },
    ];

    const checkMember = async (userID, chatRoomID) => {
        try {
            const response = await axios.get('http://localhost:3000/blog/checkMember', { params: { userID, chatRoomID } });
            if (response.data.member === 1) {
                console.log("Yes");
            } else {
                console.log("No");
            }
        } catch (error) { 
            console.log("error checking member");
        }
    };

    return (
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
                                to={`/chatroom/${chat.id}`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'white',
                                    display: 'block',
                                    height: '100%',
                                    lineHeight: '30px',
                                }}
                                onClick={() => checkMember(userData.userID, chat.id)} 
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
    );
};

export default ChatList;
