import React, { useState, useEffect } from 'react';
import { FaPowerOff, FaMinus, FaPlus } from "react-icons/fa";
import { motion } from 'framer-motion';

const channelHeadings = ["The Mood Report", "Feelings Forecast"];

const Monitor = ({moodTokens}) => {
    const [isOn, setIsOn] = useState(false);
    const [currentChannel, setCurrentChannel] = useState(1);
    const totalChannels = 4;
    const [isHoveredMinus, setIsHoveredMinus] = useState(false);
    const [isHoveredPower, setIsHoveredPower] = useState(false);
    const [isHoveredPlus, setIsHoveredPlus] = useState(false);
    const [showStatic, setShowStatic] = useState(false);
    const [showChannel, setShowChannel] = useState(false);
    const [channelTimer, setChannelTimer] = useState(null);
    const [mood, setMood] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState(null);

    const emojis = [
        { src: "https://em-content.zobj.net/source/apple/391/beaming-face-with-smiling-eyes_1f601.png", name: "Happy" },
        { src: "https://em-content.zobj.net/source/apple/391/neutral-face_1f610.png", name: "Neutral" },
        { src: "https://em-content.zobj.net/source/apple/391/pouting-face_1f621.png", name: "Angry" },
        { src: "https://em-content.zobj.net/source/apple/391/pensive-face_1f614.png", name: "Sad" },
        { src: "https://em-content.zobj.net/source/apple/391/face-holding-back-tears_1f979.png", name: "Overwhelmed" }
    ];

    const handleEmojiClick = (emoji) => {
        setSelectedEmoji(emoji);
    };

    const changeChannel = (direction) => {
        if (direction === 'up' && currentChannel < totalChannels) {
            setCurrentChannel((prev) => prev + 1);
            displayStaticAndChannel();
        } else if (direction === 'down' && currentChannel > 1) {
            setCurrentChannel((prev) => prev - 1);
            displayStaticAndChannel();
        }
    };

    useEffect(() => {
        const preloadImages = () => {
            emojis.forEach((emoji) => {
                const img = new Image();
                img.src = emoji.src;
            });
        };

        preloadImages();
    }, []);

    const displayStaticAndChannel = () => {
        setShowStatic(true);
        setShowChannel(true);

        if (channelTimer) {
            clearTimeout(channelTimer);
        }

        const timer = setTimeout(() => {
            setShowChannel(false);
        }, 1000);

        setChannelTimer(timer);

        setTimeout(() => {
            setShowStatic(false);
        }, 400);
    };

    const togglePower = () => {
        setIsOn(prev => {
            if (!prev) {
                setShowChannel(true);
                if (channelTimer) {
                    clearTimeout(channelTimer);
                }
                const timer = setTimeout(() => {
                    setShowChannel(false);
                }, 1000);
                setChannelTimer(timer);
            }
            return !prev;
        });
    };

    const progressPercentage = ((currentChannel - 1) / (totalChannels - 1)) * 100;

    return (
        <article className="flex justify-center items-center min-h-screen p-8 sm:p-16">
            <div className="relative">
                <div
                    className="relative"
                    style={{
                        width: '80vw',
                        maxWidth: '1000px',
                        height: '32vw',
                        maxHeight: '410px',
                        border: '15px solid #2a292e',
                        borderBottom: '35px solid #2a292e',
                        borderRadius: '10px',
                        borderBottomLeftRadius: '0%',
                        borderBottomRightRadius: '0%',
                        backgroundSize: 'cover',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7), inset 0 0 30px rgba(0, 0, 0, 0.5)',
                        background: isOn ? 'linear-gradient(to bottom, #004d4d, #1a5e5e)' : '#1a1414',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {showStatic && (
                        <div className="absolute inset-0 flex justify-center items-center">
                            <img src="https://cliply.co/wp-content/uploads/2021/07/402107790_STATIC_NOISE_400.gif" alt="Static Noise" style={{ width: '100%', height: '100%', position: 'absolute' }} />
                        </div>
                    )}
                    {isOn && (
                        <div className="absolute bottom-0 w-full">
                            <div
                                style={{
                                    height: '10px',
                                    backgroundColor: '#e0e0e0',
                                }}
                            >
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        height: '10px',
                                        backgroundColor: '#39FF14',
                                        
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {isOn && showChannel && (
                        <div className="absolute top-0 left-0 w-full flex justify-center" style={{ zIndex: 10 }}>
                            <div className="pt-2" style={{
                                backgroundColor: '#535353',
                                fontFamily: 'BrokenConsole',
                                color: '#ffffff',
                                fontSize: '2em',
                                padding: '10px 0',
                                width: '100%',
                                textAlign: 'left',
                                opacity: '0.5',
                                paddingLeft: '30px'
                            }}>
                                CH {currentChannel} - {channelHeadings[currentChannel - 1]}
                            </div>
                        </div>
                    )}

                    {!isOn && (
                        <div>
                            <h2
                                className="font-CoolVetica"
                                style={{
                                    color: '#077e74',
                                    fontSize: '4em',
                                    textAlign: 'center',
                                    paddingBottom: '2%',
                                }}
                            >
                                Mood Logging
                            </h2>
                            <h2
                                className="font-BrokenConsole"
                                style={{
                                    color: '#5a5a5a',
                                    fontSize: '2em',
                                    textAlign: 'center',
                                    left: '20%'
                                }}
                            >
                                Turn on the Monitor. . .
                            </h2>
                        </div>
                    )}
                </div>

                {!showStatic && isOn && currentChannel === 1 && (
                    <div
                        className="absolute flex flex-col items-center justify-start w-full"
                        style={{
                            top: '15%',
                            padding: '2%',
                        }}
                    >
                        <label className="block mb-4 text-4xl font-BrokenConsole text-gray-200">
                            How's your mood today?
                        </label>

                        <textarea
                            className="font-Poppins mt-5 p-4 pl-6 pr-6 rounded-lg bg-gray-900 text-green-300 placeholder:text-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            placeholder="How are you feeling today?"
                            style={{
                                fontSize: '1.2em',
                                width: '100%',
                                maxWidth: '800px',
                                height: '120px',
                                border: '2px solid #004d40',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    </div>
                )}

                {!showStatic && isOn && currentChannel === 2 && (
                    <div
                        className="absolute flex flex-col items-center justify-center w-full"
                        style={{
                            top: '15%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            maxWidth: '75%',
                            wordBreak: 'break-word',
                            padding: '2%',
                            textAlign: 'center',
                        }}
                    >
                        <label className="block mb-4 text-4xl font-BrokenConsole text-gray-200">
                            Which Emoji describe you the BEST today?
                        </label>

                        <div className="flex justify-center space-x-9 cursor-pointer mt-2">
                            {emojis && emojis.length > 0 ? (
                                emojis.map((emoji, index) => (
                                    <div key={index}>
                                        <img
                                            src={emoji.src}
                                            alt={emoji.name}
                                            className={`w-16 h-16 ${selectedEmoji === emoji ? 'border-4 border-teal-500' : 'border-none'}`}
                                            onClick={() => handleEmojiClick(emoji)}
                                        />
                                        <p className="mt-2 font-BrokenConsole text-center">{emoji.name}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-lg">No emojis found</p>
                            )}
                        </div>
                    </div>
                )}
                {!showStatic && isOn && currentChannel === 3 && (
                    <div
                        className="absolute flex flex-col items-center justify-center w-full"
                        style={{
                            top: '15%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            maxWidth: '75%',
                            wordBreak: 'break-word',
                            padding: '2%',
                            textAlign: 'center',
                        }}
                    >
                        
                        <img src="Dream Token.png" width="300" height="300" />
                        <label className="block mb-4 text-4xl font-BrokenConsole text-gray-200">
                            Mood Tokens (MT): {moodTokens}
                        </label>

                 </div>   
                )}
                 {!showStatic && isOn && currentChannel === 4 && (
                    <div
                        className="absolute flex flex-col items-center justify-center w-full"
                        style={{
                            top: '15%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            maxWidth: '75%',
                            wordBreak: 'break-word',
                            padding: '2%',
                            textAlign: 'center',
                        }}
                    >
                       <button
                        id='post_button'
                        className="font-PoppinsBold flex items-center justify-center p-1 mt-3 mb-3"
                        style={{ fontSize: '1.2em', marginTop: '10%', width: '50%' }}
                        type="submit"
                        >
                        Submit
                        </button>

                 </div>   
                )}

                <div className="absolute flex justify-between items-center px-10 sm:px-12 py-6 bg-gray-900 w-full bottom-[-55px] rounded-b-lg" style={{ height: '55px' }}>
                    <div className="w-12 h-12 flex justify-center items-center cursor-pointer" onClick={() => changeChannel('down')} onMouseEnter={() => setIsHoveredMinus(true)} onMouseLeave={() => setIsHoveredMinus(false)}>
                        <FaMinus className={`text-gray-300 ${isHoveredMinus ? 'text-white' : ''}`} size={32} />
                    </div>

                    <div className="flex items-center justify-center w-16 h-16 cursor-pointer" onClick={togglePower} onMouseEnter={() => setIsHoveredPower(true)} onMouseLeave={() => setIsHoveredPower(false)}>
                        <FaPowerOff className={`text-gray-300 ${isHoveredPower ? 'text-white' : ''}`} size={38} />
                    </div>

                    <div className="w-12 h-12 flex justify-center items-center cursor-pointer" onClick={() => changeChannel('up')} onMouseEnter={() => setIsHoveredPlus(true)} onMouseLeave={() => setIsHoveredPlus(false)}>
                        <FaPlus className={`text-gray-300 ${isHoveredPlus ? 'text-white' : ''}`} size={32} />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Monitor;