import React, { useState } from 'react';
import axios from 'axios';

const GenerateMP3 = () => {
  const [tagPercentages, setTagPercentages] = useState([10, 10, 10, 10, 30, 10, 20]);

  const handleGenerateMP3 = async () => {
    try {
      const response = await axios.post('http://localhost:3000/generate-mp3', { tagPercentages }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'final_mix.mp3');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating MP3:', error);
    }
  };

  return (
    <div>
    <button 
      onClick={handleGenerateMP3}
      className="bg-gradient-to-r from-black via-gray-700 to-gray-500 text-white py-2 px-4 rounded-lg shadow-lg hover:scale-105 hover:from-gray-500 hover:to-black transition-all duration-300"
    >
      Generate MP3
    </button>
  </div>
  
  );
};

export default GenerateMP3;
