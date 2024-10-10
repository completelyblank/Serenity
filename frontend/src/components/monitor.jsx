import React, { useState, useEffect } from 'react';
import { FaPowerOff, FaMinus, FaPlus } from "react-icons/fa";
import { motion } from 'framer-motion';

const channelHeadings = ["The Mood Report", "Feelings Forecast"];

const Monitor = () => {
    const [isOn, setIsOn] = useState(false);
    const [currentChannel, setCurrentChannel] = useState(1);
    const totalChannels = 6;
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
        { src: "https://em-content.zobj.net/source/apple/391/face-holding-back-tears_1f979.png", name: "OverWhelmed" }
    ];

    const handleEmojiClick = (emoji) => {
        setSelectedEmoji(emoji);
    };

    // Function to handle channel change
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


    // Function to display static and channel info
    const displayStaticAndChannel = () => {
        setShowStatic(true);
        setShowChannel(true);

        // Clear previous timer if it exists
        if (channelTimer) {
            clearTimeout(channelTimer);
        }

        // Hide the channel number after 1 second
        const timer = setTimeout(() => {
            setShowChannel(false);
        }, 1000); // Hide channel number after 1 second

        // Set the new timer
        setChannelTimer(timer);

        // Hide the static after 0.4 seconds
        setTimeout(() => {
            setShowStatic(false);
        }, 400);
    };

    // Function to toggle power
    const togglePower = () => {
        setIsOn(prev => {
            if (!prev) {
                // When turning on, reset the channel visibility timer
                setShowChannel(true);
                // Clear previous timer if it exists
                if (channelTimer) {
                    clearTimeout(channelTimer);
                }
                // Set a new timer to hide the channel number after 1 second
                const timer = setTimeout(() => {
                    setShowChannel(false);
                }, 1000);
                setChannelTimer(timer);
            }
            return !prev;
        });
    };

    // Calculate progress percentage
    const progressPercentage = ((currentChannel - 1) / (totalChannels - 1)) * 100;

    return (
        <article className="flex justify-center items-center h-screen p-16">
            <div className="relative">
                <div
                    className="relative"
                    style={{
                        width: '80vw',
                        maxWidth: '1000px',
                        height: '32vw',
                        maxHeight: '410px',
                        border: '15px solid #2a292e',
                        borderBottom: '55px solid #2a292e',
                        borderRadius: '10px',
                        backgroundSize: 'cover',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7), inset 0 0 30px rgba(0, 0, 0, 0.5)',
                        backgroundColor: isOn ? '#3e5577' : '#1a1414',
                        
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
                                        backgroundColor: '#031553',
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Channel Number Bar */}
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

                {!showStatic && isOn && currentChannel == 1 && (
                    <div
                        className="absolute flex flex-col items-center justify-start w-full"
                        style={{
                            top: '15%',
                            padding: '2%',
                        }}
                    >
                        {/* Mood Label */}
                        <label className="block mb-4 text-4xl font-BrokenConsole text-black">
                            How's your mood today?
                        </label>

                        {/* Mood Textarea */}
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

                {!showStatic && isOn && currentChannel == 2 && (
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
                        {/* Mood Label */}
                        <label className="block mb-4 text-4xl font-BrokenConsole text-black">
                            Which Emoji describe you the BEST today?
                        </label>

                        {/* Emoji Line */}
                        <div className="flex justify-center space-x-9 cursor-pointer mt-2">
                            {emojis && emojis.length > 0 ? (
                                emojis.map((emoji, index) => (
                                    <div key={index} className="text-center">
                                        <img
                                            src={emoji.src}
                                            alt={"Loading"}
                                            className="w-20 h-20 transition-transform duration-300 ease-in-out transform hover:filter hover:brightness-75"
                                            onClick={() => handleEmojiClick(emoji)}
                                            style={{
                                                transform: selectedEmoji && selectedEmoji.src === emoji.src ? 'scale(1.2)' : 'scale(1)', // Enlarge if selected
                                                transition: 'transform 0.3s ease',
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="font-BrokenConsole mt-7 text-xl">No emojis available</p> // Fallback message when no emojis
                            )}
                        </div>
                        <p className="font-BrokenConsole mt-7 text-xl" style={{fontSize: "1.5em"}}>
                            {selectedEmoji ? selectedEmoji.name : 'No emoji selected'}
                        </p>

                    </div>
                )}


                <div className="absolute" style={{ width: '12vw', height: '4vw', maxWidth: '180px', maxHeight: '50px', top: 'calc(32vw - 2vw)', left: '50%', transform: 'translateX(-50%)', background: '#2a292e', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.6)' }} />
                <div className="absolute rounded-t-lg" style={{ width: '30vw', height: '2vw', maxWidth: '450px', maxHeight: '50px', top: 'calc(32vw + 1.5vw)', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(145deg, #3d3b41, #2a292e)', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.6)' }} />
                <div className="absolute" style={{ width: '48vw', height: '8vw', maxWidth: '600px', maxHeight: '50px', top: 'calc(32vw + 8vw)', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 80%)', borderRadius: '50%', zIndex: -1 }} />

                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onMouseEnter={() => setIsHoveredMinus(true)}
                    onMouseLeave={() => setIsHoveredMinus(false)}
                    className="absolute font-PoppinsBold flex justify-center items-center"
                    style={{ width: '50px', height: '40px', borderRadius: '50%', background: isHoveredMinus ? '#4a4a4a' : '#585757', top: 'calc(26.5vw)', left: '37%', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', border: 'none', cursor: 'pointer', transition: 'background 0.3s ease' }}
                    onClick={() => isOn && changeChannel('down')}
                >
                    <FaMinus style={{ color: '#bebebe', fontSize: '1.8em' }} />
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onMouseEnter={() => setIsHoveredPower(true)}
                    onMouseLeave={() => setIsHoveredPower(false)}
                    className="absolute font-PoppinsBold flex justify-center items-center"
                    style={{ width: '50px', height: '40px', borderRadius: '50%', background: isHoveredPower ? '#4a4a4a' : '#585757', top: 'calc(26.5vw)', left: '47.5%', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', border: 'none', cursor: 'pointer', transition: 'background 0.3s ease' }}
                    onClick={togglePower}
                >
                    <FaPowerOff style={{ color: '#bebebe', fontSize: '1.8em' }} />
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onMouseEnter={() => setIsHoveredPlus(true)}
                    onMouseLeave={() => setIsHoveredPlus(false)}
                    className="absolute font-PoppinsBold flex justify-center items-center"
                    style={{
                        width: '50px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isHoveredPlus ? '#4a4a4a' : '#585757',
                        top: 'calc(26.5vw)',
                        left: '58%',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease',
                    }}
                    onClick={() => isOn && changeChannel('up')}
                >
                    <FaPlus style={{ color: '#bebebe', fontSize: '1.8em' }} />
                </motion.button>
            </div>
        </article>
    );
};

export default Monitor;
