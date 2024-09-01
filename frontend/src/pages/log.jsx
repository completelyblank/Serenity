import React, { useState } from 'react';

const DreamAnalysisForm = () => {
  const [dream, setDream] = useState('');
  const [tags, setTags] = useState([]);
  const [emotion, setEmotion] = useState('');
  const [dreamTokens, setDreamTokens] = useState(0);

  const availableTags = [
    'Flying', 'Ghost', 'Water', 'Falling', 'Chase', 'Animals', 'School', 
    'Teeth', 'Death', 'Travel', 'Stranger', 'Celebrities', 'Accident', 
    'Lost', 'Fear', 'Joy', 'Anger', 'Sadness', 'Adventure', 'Fantasy'
  ];

  const emotions = [
    { name: 'Happy', image: 'happy.png' },
    { name: 'Sad', image: 'sad.png' },
    { name: 'Scared', image: 'scared.png' },
    { name: 'Angry', image: 'angry.png' },
    { name: 'Neutral', image: 'neutral.png' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    console.log('Dream:', dream);
    console.log('Tags:', tags);
    console.log('Emotion:', emotion);
    console.log('Timestamp:', timestamp);

    // Increment dream tokens
    setDreamTokens(prevTokens => prevTokens + 1);
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else if (tags.length < 4) {
      setTags([...tags, tag]);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url("dream_analysis.jpg")` }}>
      {/* Scroll image container */}
      <img src="scroll.png" alt="Scroll" className="w-[90vw] h-screen" />

      {/* Form container on the scroll */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-6 text-black animate-pulse">Dream Analysis</h2>
        <div className="w-full max-w-md h-[50vh] overflow-y-auto bg-transparent bg-opacity-50 rounded-lg p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-black font-bold">Your Dream:</label>
              <textarea
                className="w-full p-2 rounded-lg text-black bg-transparent"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-black font-bold">Tags (Select up to 4):</label>
              <div className="flex flex-wrap">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`m-1 px-3 py-2 rounded-lg border ${tags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-transparent text-black'} transition duration-300`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-black font-bold">Emotion:</label>
              <div className="flex justify-around">
                {emotions.map(({ name, image }) => (
                  <img
                    key={name}
                    src={image}
                    alt={name}
                    className={`w-16 h-16 cursor-pointer ${emotion === name ? 'opacity-100' : 'opacity-50'} hover:opacity-100 transition-opacity duration-300`}
                    onClick={() => setEmotion(name)}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-4 text-black bg-transparent font-bold rounded-lg hover:text-white transition duration-300"
            >
              Analyze Dream
            </button>
          </form>
          <div className="mt-6 text-yellow-900 font-bold">
          Dream Tokens: {dreamTokens}
        </div>
        </div>
        </div>
    </div>
  );
};

export default DreamAnalysisForm;
