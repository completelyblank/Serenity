import React, { useState } from 'react';
import './CardFlip.css';

const FlipCard = ({ title, content }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h4>{title}</h4>
                </div>
                <div className="flip-card-back">
                    <p>{content}</p>
                </div>
            </div>
        </div>
    );
};

export default FlipCard;
