import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar.jsx'; 
import axios from 'axios';
import Spinner from '../components/spinner.jsx';
import bookImg from '/book2.png'

const MoodLoggingForm = () => {
  const [mood, setMood] = useState('');
  const [emotion, setEmotion] = useState('');
  const [moodTokens, setMoodTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const emotions = [
    { name: 'Happy', image: 'happy.gif' },
    { name: 'Sad', image: 'sad.gif' },
    { name: 'Anxious', image: 'anxious.gif' },
    { name: 'Angry', image: 'angry.gif' },
    { name: 'Neutral', image: 'neutral.gif' }
  ];

  const imagesToLoad = [
    'sky.jpg', // Background image
    'book.png',  // Book image
    'Dream Token.png', // Token image
    ...emotions.map(emotion => emotion.image) // Emotions images
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

  useEffect(() => {
    let loadedImages = 0;
    
    // Preload all images
    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages += 1;
        if (loadedImages === imagesToLoad.length) {
          setAllImagesLoaded(true); // All images are loaded
        }
      };
    });

    // Simulate loading time, for example, fetching data or processing something.
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setShowSpinner(false); // Hide spinner once loading is done
    }, 5000); // Adjust the timeout as needed

    return () => clearTimeout(timeoutId); // Cleanup
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    console.log('Mood:', mood);
    console.log('Emotion:', emotion);
    console.log('Timestamp:', timestamp);

    // Hashing the mood entry (For integrity, just a placeholder)
    const hash = btoa(timestamp + mood + emotion);
    console.log('Hash:', hash);

    // Increment mood tokens
    setMoodTokens(prevTokens => prevTokens + 1);
  };

  // Show spinner while loading
  if (loading || showSpinner || !allImagesLoaded) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#b2dfdb' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="fixed top-0 left-0 right-0 bottom-0 p-20 overflow-y-auto"
        style={{
          backgroundImage: 'url("aurora.jpg")',
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
              width: '100%',  // Increase width to stretch horizontally
              height: 'auto' // Maintain aspect ratio
            }}
          />

          {/* Form container with flex layout */}
          <div className="absolute flex items-start justify-between p-6 font-KgTen"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%', // Adjust width to fit within the book boundary
              fontSize: '1.5em',
              color: '#004d40',
              fontWeight: 'bolder',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            
            {/* Left side: Mood and Emotion */}
            <div className="flex flex-col items-start" style={{ width: '45%' }}>
              <form onSubmit={handleSubmit}>
                <label className="block mb-2">Your Mood</label>
                <textarea
                  className="p-3 rounded-lg bg-transparent"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="How are you feeling today?"
                  style={{ fontSize: '0.7em', width: '100%', border: '2px solid #004d40' }}
                />
                <br /><br />
                <label className="block mb-2 text-gray-800" style={{color: '#004d40'}}>Emotion</label>
                <div className="ml-5 flex space-x-4">
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
              </form>
            </div>

            {/* Right side: Log Mood button and Mood Tokens */}
            <div className="flex flex-col items-center justify-center" style={{ width: '45%' }}>
              <div className="text-gray-900 ml-5" style={{color: '#004d40'}}>
                Mood Tokens (MT): {moodTokens}
              </div>
              <img
                src="Dream Token.png" // Replace with the path to your image
                alt="Decorative"
                className="" // Margin for spacing between elements
                style={{ width: '60%', height: 'auto' }} // Adjust size as needed
              />
              <button
                type="submit"
                className="py-3 p-5 ml-2 text-gray-800 bg-transparent rounded-lg hover:bg-transparent hover: transition duration-300"
                style={{marginTop: '5%', color: '#004d40', border: '2px solid #004d40', backgroundColor: '#b2dfdb'}}
                onClick={handleSubmit}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Submit Entry
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default MoodLoggingForm;
