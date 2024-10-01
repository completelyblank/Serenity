import React, { useState, useEffect } from 'react';
import Spinner from '../components/spinner';
import Navbar from '../components/navbar';

const Community = () => {
    const [loading, setLoading] = useState(true);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        let spinnerTimeout;
        const fetchData = async () => {
            try {
                spinnerTimeout = setTimeout(() => {
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
            <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#000' }}>
                <Navbar />
                <Spinner />
            </div>
        );
    }

    return (
        <div
            className="h-screen overflow-y-auto relative bg-cover bg-center"
            style={{
                backgroundColor: '#0d0d0d',
                backgroundImage: 'url("chat_dashboard.jpg")', // Use a darker neon-inspired background
                
            }}
        >
            <Navbar />
            <div className="flex justify-center items-center h-screen">
                <a
                    href="/blog"
                    className="w-1/3 h-1/2 p-6 rounded-lg shadow-lg transition duration-300 mx-8 mt-16 flex justify-center items-center glassy-neon"
                >
                    <h2
                        className="font-Neon text-white text-shadow-neon"
                        style={{
                            fontSize: '1.5em'
                        }}
                    >
                        Blog
                    </h2>
                </a>
                <a
                    href="/chatroom"
                    className="w-1/3 h-1/2 p-6 rounded-lg shadow-lg transition duration-300 mx-8 mt-16 flex justify-center items-center glassy-neon"
                >
                    <h2
                        className="font-Neon text-white  text-shadow-neon"
                        style={{
                            fontSize: '1.5em'
                        }}
                    >
                        Chat Room
                    </h2>
                </a>
            </div>
        </div>
    );
};

export default Community;

