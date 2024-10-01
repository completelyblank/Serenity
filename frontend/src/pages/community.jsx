import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Spinner from '../components/spinner';
import Navbar from '../components/navbar';

const Community = () => {
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
        <div
            className="h-screen overflow-y-auto relative bg-cover bg-center"
            style={{
                backgroundColor: '#c1e4e7',
                backgroundImage: 'url("mountains.jpg")',
            }}
        >
            <Navbar />
            <div className="flex justify-center items-center h-screen">
                <a
                    href="/blog"
                    className="w-1/3 h-1/2 bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 mx-16 mt-16 flex justify-center items-center"
                >
                    <h2 
                        className="font-PoppinsBold"
                        style={{
                            fontSize: '1.5em'
                        }}
                    >
                        Blog
                    </h2>
                </a>
                <a
                    href="/chatroom"
                    className="w-1/3 h-1/2 bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 mx-16 mt-16 flex justify-center items-center"
                >
                    <h2 
                        className="font-PoppinsBold"
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
