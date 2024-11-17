import React from 'react';
import Modal from 'react-modal';

function ImageModal({ isOpen, onRequestClose, originalImage, originalImageInfo, selectedImage }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Image Comparison"
            className="modal"
            overlayClassName="overlay"
        >
            {selectedImage && (
                <div>
                    <h2>Image Comparison</h2>
                    <div className="comparison">
                        <div>
                            <h3>Original Image</h3>
                            <img src={originalImage} alt="Original" className="modal-image" />
                            <p>Size: {originalImageInfo.size} KB</p>
                        </div>
                        <div>
                            <h3>{selectedImage.method}</h3>
                            <img src={selectedImage.url} alt={selectedImage.method} className="modal-image" />
                            <p>Size: {selectedImage.size} KB</p>
                            <a href={selectedImage.url} download={`compressed-${selectedImage.method}.jpg`}>
                                Download
                            </a>
                        </div>
                    </div>
                    <button onClick={onRequestClose}>Close</button>
                </div>
            )}
        </Modal>
    );
}

export default ImageModal;