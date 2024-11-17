import React from 'react';
import './loader.css';

function Loader() {
    return (
        <div className="loader">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
}

export default Loader;