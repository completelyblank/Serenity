import React, { useState, useEffect } from 'react';
import styles from './Envelope.module.css';
import { useUserContext } from '../../src/context/userContext';
import axios from 'axios';

const Envelope = () => {
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const { userData } = useUserContext();
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

  const toggleFlap = () => {
    setIsFlapOpen(!isFlapOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/profile');
        const data = response.data;
        setQuote(data.QUOTE);
        setAuthor(data.AUTHOR);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch quote. Please try again later.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={`${styles['envelope-wrapper']} ${isFlapOpen ? styles.flap : ''}`}
        onClick={toggleFlap}
      >
        <div className={styles.envelope}>
          <div className={styles.letter}>
            <div className={styles.text}>
              <strong>Dear {userData.firstName}</strong>
              <p>{quote}</p>
            </div>
          </div>
        </div>
        {/* Apply animated class conditionally */}
        <div className={`${styles.heart} ${!isFlapOpen ? styles.animated : ''}`}></div>
      </div>
    </div>
  );
};

export default Envelope;
