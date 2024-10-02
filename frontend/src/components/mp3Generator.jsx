import React, { useState } from 'react';
import axios from 'axios';
import ReactiveButton from 'reactive-button';

const GenerateMP3 = () => {
  const [tagPercentages, setTagPercentages] = useState([10, 10, 10, 10, 30, 10, 20]);
  const [state, setState] = useState('idle');

  const onClickHandler = () => {
    setState('loading');
    handleGenerateMP3();
  };

  const handleGenerateMP3 = async () => {
    try {
      const response = await axios.post('http://localhost:3000/generate-mp3', { tagPercentages }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'final_mix.mp3');
      document.body.appendChild(link);
      link.click();

      // Set success state once the download is initiated
      setState('success');
    } catch (error) {
      console.error('Error generating MP3:', error);

      // Set error state if something goes wrong
      setState('error');
    }
  };

  return (
    <div className='flex justify-center items-center' style={{marginRight: '25%'}}>
      <ReactiveButton
        className="bg-gradient-to-r from-black via-gray-600 to-gray-400 text-white rounded-lg shadow-lg hover:scale-105 hover:from-gray-500 hover:to-black transition-all duration-300"
        style={{ fontFamily: 'Poppins', borderRadius: '10px', width: '200%', height: '120%', fontSize: '1.1em' }}
        buttonState={state}
        idleText="Generate MP3"
        loadingText="Generating..."
        successText="Done"
        errorText="Failed"
        onClick={onClickHandler}
      />
    </div>
  );
};

export default GenerateMP3;
