import React from 'react';

function FileUpload({ onUpload }) {
    const handleChange = (event) => {
        const file = event.target.files[0];
        onUpload(file);
    };

    return (
        <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleChange}
            aria-label="Upload an image or PDF"
        />
    );
}

export default FileUpload;