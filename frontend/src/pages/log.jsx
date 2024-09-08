import React, { useState } from 'react';
import Navbar from '../components/navbar.jsx'; // Adjust the path as needed

const MoodLoggingForm = () => {
  const [mood, setMood] = useState('');
  const [emotion, setEmotion] = useState('');
  const [moodTokens, setMoodTokens] = useState(0);

  const emotions = [
    { name: 'Happy', image: 'happy.png' },
    { name: 'Sad', image: 'sad.png' },
    { name: 'Anxious', image: 'anxious.png' },
    { name: 'Angry', image: 'angry.png' },
    { name: 'Neutral', image: 'neutral.png' }
  ];

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

  return (
    <>
    <Navbar />
      <div className="flex items-center justify-center h-screen bg-cover overflow-auto" style={{ backgroundImage: `url("serenity_bg.png")` }}>
        {/* Parchment image container */}
        <img src="parchment.png" alt="Parchment" className="mr-20 w-[100vw] h-screen object-cover" />
        {/* Form container on the journal */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 ml-20 mt-20">
          <h2 className="text-4xl font-CoolVetica mb-2 text-gray-800 ">Mood Logging</h2>
          <div className="bg-transparent rounded-lg p-4 shadow-lg mr-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block mb-2 text-gray-800 font-CoolVetica">Your Mood:</label>
                <textarea
                  className="w-full p-2 rounded-lg bg-transparent border font-CoolVetica border-transparent"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="..."
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-gray-800 font-CoolVetica">Emotion:</label>
                <div className="flex justify-around">
                  {emotions.map(({ name, image }) => (
                    <img
                      key={name}
                      src={image}
                      alt={name}
                      className={`w-16 h-16 cursor-pointer ${emotion === name ? 'opacity-100' : 'opacity-60'} hover:opacity-100 transition-opacity duration-300`}
                      onClick={() => setEmotion(name)}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full font-CoolVetica py-3 mt-4 text-gray-800 bg-transparent font-bold rounded-lg border border-transparent hover:bg-transparent hover:text-white transition duration-300"
              >
                Log Mood
              </button>
            </form>
            <div className="mt-6 text-gray-900 font-CoolVetica">
              Mood Tokens (MT): {moodTokens}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodLoggingForm;