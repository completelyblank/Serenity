import React, { useState, useEffect } from 'react';
import FlipCard from './FlipCard';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/userContext';
import Spinner from '../components/spinner.jsx';
import axios from 'axios';
import './CardFlip.css';

const getRandomNumber = () => {
    return Math.floor(Math.random() * 10) + 1;
};

const CardFlipModal = () => {
    const [chosen, setChosen] = useState(false);
    const [cards, setCards] = useState([]);
    const { userData, setUserData } = useUserContext();
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();

    const handleNavigation = () => {
        setUserData(prevData => ({ ...prevData, card: false }));
        navigate('/dashboard');
    };

    useEffect(() => {
        const newCards = [
            { title: 'A', content: `${getRandomNumber()} Tokens` },
            { title: 'B', content: `${getRandomNumber()} Tokens` },
            { title: 'C', content: `${getRandomNumber()} Tokens` }
        ];
        setCards(newCards);
    }, []);

    const handleCardClick = async (index) => {
        setSelectedCard(index);
        const selectedCardContent = cards[index].content;
        const cardNum = parseInt(selectedCardContent, 10);
        try {
            const response = await axios.post('http://localhost:3000/form/tokens', {
                userID: userData.userID,
                tokens: cardNum
            });
            const newCount = userData.token + cardNum;
            setUserData({ ...userData, token: newCount });
        } catch (error) {
            console.error('Error posting data:', error);
        }

        setTimeout(() => {
            setChosen(true); 
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 overflow-y-hidden overflow-x-hidden mt-9">
            {chosen && <Confetti width={window.innerWidth} height={window.innerHeight} gravity={0.1} />}
            {!chosen ? (
                <div
                    className="relative p-8 rounded-lg shadow-lg bg-gray-800"
                    style={{
                        width: '60%',
                        height: '70%',
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
                        Test Your Luck!
                    </h3>
                    <h3
                        className="font-DirtyHeadline mb-7"
                        style={{
                            fontSize: '2em',
                            textAlign: 'center',
                            letterSpacing: '2px',
                            color: '#74bdb7',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                        }}
                    >
                        Pick a Card
                    </h3>
                    <div className="font-PoppinsBold card-container cursor-pointer" style={{ display: 'flex' }}>
                        {cards.map((card, index) => (
                            <div key={index} onClick={() => handleCardClick(index)}>
                                <FlipCard title={card.title} content={card.content} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div
                    className="relative p-8 rounded-lg shadow-lg bg-gray-800"
                    style={{
                        width: '60%',
                        height: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <h3
                        className="font-DirtyHeadline mb-10 text-center"
                        style={{
                            fontSize: '2em',
                            textAlign: 'center',
                            letterSpacing: '2px',
                            color: '#74bdb7',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                        }}
                    >
                        Congratulations, you have won {cards[selectedCard].content}
                    </h3>
                    <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={handleNavigation}
                        className="font-PoppinsBold bg-teal-700 text-white py-2 px-5 rounded hover:bg-teal-900"
                        style={{
                            fontSize: '1.5em',
                            textAlign: 'center',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                        }}
                    >
                        Return To Dashboard
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default CardFlipModal;
