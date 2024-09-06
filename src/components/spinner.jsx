import React from "react";

const Spinner = () => {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <img src="https://cdn.pixabay.com/animation/2024/04/07/03/34/03-34-40-457_256.gif" className="rounded-full" alt="Loading Spinner" style={{width: 250, height: 200, zIndex: 10}}/>
        </div>
    );
}

export default Spinner;
