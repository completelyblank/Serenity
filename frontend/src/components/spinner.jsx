import React from "react";
import spinnerGIF from '../assets/yapper.gif'

const Spinner = () => {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <img src={spinnerGIF} alt="Loading Spinner" style={{width: 250, height: 150, zIndex: 10}}/>
        </div>
    );
}

export default Spinner;
