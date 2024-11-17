import React from 'react';
import Modal from 'react-modal';

function FileModal({ isOpen, onRequestClose, originalFile, originalFileInfo, selectedFile }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="File Comparison"
            className="modal"
            overlayClassName="overlay"
        >
            {selectedFile && (
                <div>
                    <h2>File Comparison</h2>
                    <div className="comparison">
                        <div>
                            <h3>Original File</h3>
                            {originalFileInfo.type.startsWith('image/') ? (
                                <img src={originalFile} alt="Original" className="modal-file" />
                            ) : (
                                <embed src={originalFile} type="application/pdf" className="modal-file" />
                            )}
                            <p>Size: {originalFileInfo.size} KB</p>
                        </div>
                        <div>
                            <h3>{selectedFile.method}</h3>
                            {selectedFile.url.endsWith('.pdf') ? (
                                <embed src={selectedFile.url} type="application/pdf" className="modal-file" />
                            ) : (
                                <img src={selectedFile.url} alt={selectedFile.method} className="modal-file" />
                            )}
                            <p>Size: {selectedFile.size} KB</p>
                            <a href={selectedFile.url} download={`compressed-${selectedFile.method}.${selectedFile.url.endsWith('.pdf') ? 'pdf' : 'jpg'}`}>
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

export default FileModal;