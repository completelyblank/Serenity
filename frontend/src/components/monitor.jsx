import React, { useState, useEffect, Component } from 'react';
import { FaPowerOff, FaMinus, FaPlus } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CardFlipModal from './CardFlipModal';
import { useUserContext } from '../context/userContext';
import axios from 'axios';

const channelHeadings = ["Assistance Channel", "The Mood Report", "Feelings Forecast", "Vibe Check", "Mood Metrics", "The Submission Station"];

const Monitor = ({ moodTokens, isLogged }) => {
    const [selectedTagIndex, setSelectedTagIndex] = useState([]);
    const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(null);
    const [error, setError] = useState("");
    const { userData } = useUserContext();
    const [isOn, setIsOn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentChannel, setCurrentChannel] = useState(1);
    const totalChannels = 6;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isHoveredMinus, setIsHoveredMinus] = useState(false);
    const [isHoveredPower, setIsHoveredPower] = useState(false);
    const [isHoveredPlus, setIsHoveredPlus] = useState(false);
    const [showStatic, setShowStatic] = useState(false);
    const [showChannel, setShowChannel] = useState(false);
    const [channelTimer, setChannelTimer] = useState(null);
    const [mood, setMood] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [hoveredEmoji, setHoveredEmoji] = useState(null);
    const [hoveredTag, setHoveredTag] = useState(null);

    const emojis = [
        { id: 1, src: "https://em-content.zobj.net/source/apple/391/beaming-face-with-smiling-eyes_1f601.png", name: "Happy" },
        { id: 2, src: "https://em-content.zobj.net/source/apple/391/neutral-face_1f610.png", name: "Neutral" },
        { id: 3, src: "https://em-content.zobj.net/source/apple/391/pouting-face_1f621.png", name: "Angry" },
        { id: 4, src: "https://em-content.zobj.net/source/apple/391/pensive-face_1f614.png", name: "Sad" },
        { id: 5, src: "https://em-content.zobj.net/source/apple/391/smiling-face-with-halo_1f607.png", name: "Blessed" },
        { id: 6, src: "https://em-content.zobj.net/source/apple/391/relieved-face_1f60c.png", name: "Content" },
    ];

    const [selectedTags, setSelectedTags] = useState([]);
    const tags = [
        "Happy", "Sad", "Excited", "Calm", "Angry", "Hopeful",
        "Inspired", "Anxious", "Joyful", "Peaceful", "Motivated",
        "Bored", "Relaxed", "Confused", "Energized",
    ];

    const handleTagClick = (tag) => {
        const tagIndex = tags.indexOf(tag) + 1;
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
            setSelectedTagIndex(selectedTagIndex.filter((index) => index !== tagIndex));
        } else if (selectedTags.length < 10) {
            setSelectedTags([...selectedTags, tag]);
            setSelectedTagIndex([...selectedTagIndex, tagIndex]);
        }
    };


    const handleMoodChange = async () => {
        try {
            if (selectedTags.length == 0 || selectedEmoji == null || mood === '') {
                setError("Kindly Fill All Channels");
            } else {
                setError("");
                try {
                    const response = await axios.post('http://localhost:3000/form', {
                        userID: userData.userID,
                        description: mood,
                        emojiID: selectedEmojiIndex,
                        tags: selectedTagIndex
                    });
                    console.log('Response:', response.data);
                } catch (error) {
                    console.error('Error posting data:', error);
                }
            }
        } catch (error) {
            console.log("error :c");
        }
    };

    const handleEmojiClick = (emoji) => {
        setSelectedEmoji(emoji.name);
        setSelectedEmojiIndex(emoji.id);
    };

    const changeChannel = (direction) => {
        setError("");
        if (isOn) {
            if (direction === 'up' && currentChannel < totalChannels) {
                setCurrentChannel((prev) => prev + 1);
                displayStaticAndChannel();
            } else if (direction === 'down' && currentChannel > 1) {
                setCurrentChannel((prev) => prev - 1);
                displayStaticAndChannel();
            }
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
        if (isOn) {
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
        }
    };

    const togglePower = () => {
        if (isLogged == false) {
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
        }
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
                    {isOn && !isLogged && (
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

                    {isOn && showChannel && !isLogged && (
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
                            {!isLogged && (
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
                            )}
                            {isLogged && (
                                <h2
                                    className="font-BrokenConsole"
                                    style={{
                                        color: '#5a5a5a',
                                        fontSize: '2em',
                                        textAlign: 'center',
                                        left: '20%'
                                    }}
                                >
                                    Mood logged. Check back tomorrow!
                                </h2>
                            )}
                        </div>
                    )}
                </div>

                {!showStatic && isOn && currentChannel === 1 && (
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
                            Let's Get You Started!
                        </label>
                        <p className="block mt-5 font-Poppins text-gray-200" style={{ fontSize: '1.5em' }}>
                            Ready to jump in? No problem! Just click around and share what you feel—no overthinking required. You got this!
                        </p>
                        <div className="flex flex-row items-center justify-center mt-7 space-x-20">
                            <h1 style={{ fontFamily: "PoppinsBold", fontSize: '1.5em', color: 'white' }} className="pulsate">Navigate Left</h1>
                            <FaArrowLeft className="text-black pulsate" size={60} />
                            <FaArrowRight className="text-black pulsate" size={60} />
                            <h1 style={{ fontFamily: "PoppinsBold", fontSize: '1.5em', color: 'white' }} className="pulsate">Navigate Right</h1>
                        </div>
                    </div>

                )}

                {!showStatic && isOn && currentChannel === 2 && (
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
                            className="font-Poppins mt-9 p-4 pl-6 pr-6 rounded-lg bg-gray-900 text-green-300 placeholder:text-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            value={mood}
                            onChange={(e) => {
                                setMood(e.target.value);
                            }}
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
                        <label className="block mb-4 text-4xl font-BrokenConsole text-gray-200">
                            Which Emoji describe you the BEST today?
                        </label>

                        <div className="flex justify-center space-x-9 cursor-pointer mt-2">
                            {emojis && emojis.length > 0 ? (
                                emojis.map((emoji, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <img
                                            key={emoji.name}
                                            src={emoji.src}
                                            alt={emoji.name}
                                            onClick={() => handleEmojiClick(emoji)}
                                            onMouseEnter={() => setHoveredEmoji(emoji.name)}
                                            onMouseLeave={() => setHoveredEmoji(null)}
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                transition: 'transform 0.3s',
                                                cursor: 'pointer',
                                                transform: `${selectedEmoji === emoji.name || hoveredEmoji === emoji.name ? 'scale(1.2)' : 'scale(1)'}`,
                                                filter: selectedEmoji === emoji.name ? 'brightness(0.5)' : 'none'
                                            }}
                                        />
                                        <p
                                            className="mt-2 font-PoppinsBold text-center"
                                            style={{
                                                color: `${selectedEmoji === emoji.name ? '#c0c0c0' : '#000000'}`,
                                                fontSize: '1.1em'
                                            }}
                                        >
                                            {emoji.name}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-lg">No emojis found</p>
                            )}
                        </div>
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
                        <label className="block mb-3 text-4xl font-BrokenConsole text-gray-200">
                            Your Daily Emotion Compass
                        </label>
                        <label className="block mb-3 text-xl font-BrokenConsole text-gray-200">
                            Select Upto 10 Tags
                        </label>
                        <div className="flex justify-center items-center mt-2">
                            <div className="grid grid-cols-5 gap-x-5 gap-y-4 w-full max-w-xxl justify-center">
                                {tags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                        className={`px-4 py-2 rounded-full ${selectedTags.includes(tag)
                                            ? 'bg-teal-600 text-white font-PoppinsBold'
                                            : 'bg-gray-900 text-gray-100 font-Poppins'
                                            } ${hoveredTag === tag ? 'bg-teal-600 text-white' : 'bg-gray-900 text-gray-100'}`}
                                        style={{
                                            width: '100%',
                                            transform: `${hoveredTag === tag ? 'scale(1.05)' : 'scale(1)'}`,
                                            transition: 'transform 0.3s',
                                            textAlign: 'center',
                                        }}
                                        onMouseEnter={() => setHoveredTag(tag)}
                                        onMouseLeave={() => setHoveredTag(null)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                )}
                {!showStatic && isOn && currentChannel === 5 && (
                    <div
                        className="absolute flex flex-col items-center justify-start w-full"
                        style={{
                            top: '15%',
                            padding: '2%',
                        }}
                    >
                        <label className="block mb-4 text-4xl font-BrokenConsole text-gray-200">
                            Your Collected Mood Tokens
                        </label>

                        <div className="flex w-3/4 justify-center items-center">
                            <div className="flex flex-col w-5/6 items-center justify-center">
                                {/* Left section content */}
                                <label className="text-center block mb-4 mt-2 font-PoppinsBold text-gray-200" style={{ fontSize: '1.5em' }}>
                                    Mood Tokens collected from games and mood logging are displayed here
                                </label>
                            </div>
                            <div className="flex flex-col w-5/6 items-center">
                                {/* Right section content */}
                                <img src="Dream Token.png" width="250" height="250" />
                                <label className="block mb-4 mt-2 text-4xl font-BrokenConsole text-gray-200">
                                    Collected: {moodTokens}
                                </label>
                            </div>
                        </div>
                    </div>

                )}
                {!showStatic && isOn && currentChannel === 6 && (
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
                            Ready to Submit Your Mood Data?
                        </label>
                        <p className="block mt-3 font-Poppins text-gray-200" style={{ fontSize: '1.5em' }}>
                            Review your entries and hit submit to send your data. As a thank you, you’ll get to participate in <strong>Test Your Luck</strong>!
                        </p>
                        <button
                            id='post_button'
                            className="font-PoppinsBold flex items-center justify-center p-2 mt-12 w-1/2"
                            type="submit"
                            style={{ fontSize: '1.2em' }}
                            onClick={() => {
                                if (selectedTags.length !== 0 && selectedEmoji !== null && mood !== '') {
                                    setIsPopupOpen(true);
                                }
                                handleMoodChange();
                            }}
                        >
                            Submit
                        </button>
                        {error != "" && (
                            <p className="block mt-2 font-PoppinsBold text-red-900" style={{ fontSize: '1em' }}>
                                {error}
                            </p>
                        )}
                    </div>

                )}

                <div className="absolute flex justify-between items-center px-10 sm:px-12 py-6 bg-gray-900 w-full bottom-[-55px] rounded-b-lg" style={{ height: '55px' }}>
                    <motion.button whileTap={{ scale: 0.85 }} className="w-12 h-12 flex justify-center items-center cursor-pointer" onClick={() => changeChannel('down')} onMouseEnter={() => setIsHoveredMinus(true)} onMouseLeave={() => setIsHoveredMinus(false)}>
                        <FaMinus className={`text-gray-300 ${isHoveredMinus ? 'text-white' : ''}`} size={32} />
                    </motion.button>

                    <motion.button whileTap={{ scale: 0.85 }} className="flex items-center justify-center w-16 h-16 cursor-pointer" onClick={togglePower} onMouseEnter={() => setIsHoveredPower(true)} onMouseLeave={() => setIsHoveredPower(false)}>
                        <FaPowerOff className={`text-gray-300 ${isHoveredPower ? 'text-white' : ''}`} size={38} />
                    </motion.button>

                    <motion.button whileTap={{ scale: 0.85 }} className="w-12 h-12 flex justify-center items-center cursor-pointer" onClick={() => changeChannel('up')} onMouseEnter={() => setIsHoveredPlus(true)} onMouseLeave={() => setIsHoveredPlus(false)}>
                        <FaPlus className={`text-gray-300 ${isHoveredPlus ? 'text-white' : ''}`} size={32} />
                    </motion.button>
                </div>
            </div>
            {isPopupOpen && (
                <div>
                    <CardFlipModal />
                </div>
            )}
        </article>
    );
};

export default Monitor;