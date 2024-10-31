import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import AnimateSection from '../components/animate';
import GraphSection from '../components/graphs';
import Spinner from '../components/spinner'; // Assuming you have a Spinner component

function Analysis() {
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    let spinnerTimeout;
    const fetchData = async () => {
      try {
        const spinnerTimeout = setTimeout(() => {
          setShowSpinner(false);
        }, 1000);

        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        clearTimeout(spinnerTimeout);
      }
    };

    fetchData();
  }, []);

  // Show spinner while loading
  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#b2dfdb' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-fixed text-white" style={{ backgroundImage: `url("dream_analysis.jpg")` }}>
      <Navbar />
      <div className="flex-1 p-4">
        <div
          className="text-xl text-center mb-4"
          style={{
            fontSize: '3em',
            fontFamily: 'Poppins',
            color: '#C6E2FF', // Soft pastel blue
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)', // Soft shadow for a calming effect
          }}
        >
          Analysis
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner /> {/* Spinner component displayed while loading */}
          </div>
        ) : (
          <>
            <AnimateSection />
            <GraphSection />
          </>
        )}
      </div>
    </div>
  );
}

export default Analysis;
