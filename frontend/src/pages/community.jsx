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
        <div className="h-screen overflow-y-auto overflow-x-hidden relative" style={{ backgroundColor: '#c1e4e7' }}>
            <Navbar />
            <div className="flex justify-center items-center h-screen">
                <a href="/community/blog" className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 mx-4">
                    <h2 className="text-xl font-semibold">Blog</h2>
                </a>
                <a href="/community/chatroom" className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 mx-4">
                    <h2 className="text-xl font-semibold">Chat Room</h2>
                </a>
            </div>
        </div>
    );
};

export default Community;
