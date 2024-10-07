import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar.jsx';
import axios from 'axios';
import Spinner from '../components/spinner.jsx';
import bookImg from '/book2.png';

const MoodLoggingForm = () => {
  const [mood, setMood] = useState('');
  const [emotion, setEmotion] = useState('');
  const [moodTokens, setMoodTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Mood textarea, Step 2: Emoji selection, Step 3: Submit
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const emotions = [
    { name: 'Happy', image: 'happy.gif' },
    { name: 'Sad', image: 'sad.gif' },
    { name: 'Anxious', image: 'anxious.gif' },
    { name: 'Angry', image: 'angry.gif' },
    { name: 'Neutral', image: 'neutral.gif' }
  ];

  useEffect(() => {
    let spinnerTimeout;
    const fetchData = async () => {
      try {
        const spinnerTimeout = setTimeout(() => {
          setShowSpinner(false);
        }, 1000);

        const response = await axios.get('http://localhost:3000/form');
        const data = response.data;
        setMoodTokens(data.tokens);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
        clearTimeout(spinnerTimeout);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    console.log('Mood:', mood);
    console.log('Emotion:', emotion);
    console.log('Timestamp:', timestamp);

    const hash = btoa(timestamp + mood + emotion);
    console.log('Hash:', hash);

    setMoodTokens(prevTokens => prevTokens + 1);
  };

  // Show spinner while loading
  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#b2dfdb' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  // Function to navigate between steps
  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <Navbar />
      <div className="fixed top-0 left-0 right-0 bottom-0 p-20 overflow-y-auto"
        style={{
          backgroundImage: 'url("sky.jpg")',
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          overflow: 'hidden'
        }}>
        {/* Mood Logging heading */}
        <h2 className="font-CoolVetica" style={{ color: '#b2dfdb', fontSize: '4em', paddingBottom: '6%' }}>Mood Logging</h2>

        {/* Container for the book image */}
        <div className="relative flex items-center justify-center w-full h-full">
          <img
            src={bookImg}
            alt="Book"
            className="absolute object-cover"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '45rem',  // Adjust the size as needed
              height: '45rem',
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
            }}
          />

          {/* Arrows for navigation */}
          <div className="absolute flex items-center justify-between w-full" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            {/* Left Arrow */}
            {currentStep > 1 && (
              <button
                className="text-7xl font-bold text-[#cba62e] hover:text-[#ffd64e] hover:scale-125 transition-transform duration-300 ease-in-out"
                onClick={handlePreviousStep}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                &#8592;
              </button>
            )}

            {/* Right Arrow */}
            {currentStep < 3 && (
              <button
                className="text-7xl font-bold text-[#cba62e] hover:text-[#ffd64e] hover:scale-125 transition-transform duration-300 ease-in-out"
                onClick={handleNextStep}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                &#8594;
              </button>
            )}
          </div>


          {/* Form container inside the book */}
          <div className="absolute flex items-start justify-between p-6 font-KgTen"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
              fontSize: '1em',
              color: '#004d40',
              fontWeight: 'bolder',
            }}>

            {/* Conditionally Render Based on Current Step */}
            {currentStep === 1 && (
              <div 
              className="flex flex-col items-center justify-center w-full mt-10"
              style={{
                width: '100%',
                top: '10%',
                left: '50%',
                padding: '2%', // Add some padding for better spacing
              }}
            >
              {/* Mood Label */}
              <label className="block mb-4 text-4xl font-DirtyHeadline text-teal-600">Your Mood</label>
              
              {/* Mood Textarea */}
              <textarea
                className="p-4 rounded-lg bg-gray-900 text-green-300 placeholder:text-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="How are you feeling today?"
                style={{
                  fontSize: '1em', // Increased font size for better readability
                  width: '100%',
                  height: '100px', // Set a fixed height for a fuller appearance
                  border: '2px solid #004d40',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                }}
              />
            </div>
            )}

            {currentStep === 2 && (
             <div className="flex flex-col items-center justify-center w-full">
             {/* Heading for Mood Emojis */}
             <h2 className="text-3xl font-bold text-teal-700 mb-4">Mood Emojis</h2>
           
             {/* Dark gray container for emojis */}
             <div
               className="flex space-x-4 p-4 rounded-lg border-4 border-teal-700 bg-gray-950 ml-4"
               style={{
                 boxShadow: '0 0 10px #00FF00', // Neon glow effect
                 transition: 'border-color 0.3s ease',
               }}
             >
               {emotions.map(({ name, image }) => (
                 <img
                   key={name}
                   src={image}
                   alt={name}
                   className={`w-16 h-16 cursor-pointer ${emotion === name ? 'opacity-100' : 'opacity-100'} scale-on-enter`}
                   style={{ transition: 'transform 0.3s ease' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                   onClick={() => setEmotion(name)}
                 />
               ))}
             </div>
           </div>
           
            )}

            {currentStep === 3 && (
             <div className="flex flex-col items-center justify-center w-full" style={{ marginTop: '2rem' }}>
             <div className="text-teal-700 ml-5 mb-8" style={{ color: '#004d40', fontSize: '2rem', fontWeight: 'bold' }}>
               Mood Tokens (MT): {moodTokens}
             </div>
             <img
               src="Dream Token.png"
               alt="Decorative"
               className='mb-10'
               style={{ width: '60%', height: 'auto' }}
             />
             <button
               type="submit"
               className="py-2 px-2 ml-2 rounded-lg transition duration-300 transform hover:scale-110 mb-16"
               style={{
                 marginTop: '5%',
                 backgroundColor: '#1b5e20', // Dark green background for a neon look
                 border: '2px solid #a5d6a7', // Border color for a soft glow
                 color: '#ffffff', // White text for contrast
                 boxShadow: '0 0 10px #a5d6a7, 0 0 20px #a5d6a7', // Neon glow effect
                 textShadow: '0 0 5px #a5d6a7, 0 0 10px #a5d6a7', // Enhance neon effect on text
               }}
               onClick={handleSubmit}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
             >
               Submit Entry
             </button>
           </div>
           
           
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default MoodLoggingForm;
