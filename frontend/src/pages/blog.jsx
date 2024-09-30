import React, { useState, useEffect } from 'react';
import { useLocation  , Link } from 'react-router-dom';
import Spinner from '../components/spinner';
import Navbar from '../components/navbar';

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    let spinnerTimeout;
    const fetchData = async () => {
      try {
        const spinnerTimeout = setTimeout(() => {
          setShowSpinner(false);
        }, 1000);
      } finally {
        setLoading(false);
        clearTimeout(spinnerTimeout);
      }
    };

    fetchData();
  }, []);


  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#b2dfdb' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden relative" style={{ backgroundColor: '#c1e4e7' }}>
      <Navbar />
    </div>
  );
};

export default Blog;
