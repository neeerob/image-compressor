import React, { useState } from 'react';
import Modal from 'react-modal';
import './App.css';
import FileUpload from './helper/fileUpload';
import FileList from './helper/fileList';
import FileModal from './helper/fileModal';
import Loader from './component/loader';
import { compressUsingLibraries } from './helper/fileCompression';

Modal.setAppElement('#root');

function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalFileInfo, setOriginalFileInfo] = useState({ size: 0 });
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setOriginalFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2), // Size in KB
        type: file.type,
      });

      const reader = new FileReader();
      reader.onloadend = async () => {
        setOriginalFile(reader.result);
        setLoading(true);
        const results = await compressUsingLibraries(file);
        setCompressedFiles(results);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image or PDF file.');
    }
  };

  const openModal = (file) => {
    setSelectedFile(file);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="App">
      <h1>File Uploader & Compression Comparison</h1>
      <FileUpload onUpload={handleFileUpload} />
      {loading && <Loader />}
      {originalFile && (
        <div className="file-panel">
          <h2>Original File</h2>
          {originalFileInfo.type.startsWith('image/') ? (
            <img src={originalFile} alt="Original" className="uploaded-file" loading="lazy" />
          ) : (
            <embed src={originalFile} type="application/pdf" className="uploaded-file" />
          )}
          <p>Size: {originalFileInfo.size} KB</p>
          <p>Type: {originalFileInfo.type}</p>
        </div>
      )}
      {compressedFiles.length > 0 && (
        <FileList files={compressedFiles} originalSize={originalFileInfo.size} openModal={openModal} />
      )}
      <FileModal isOpen={modalIsOpen} onRequestClose={closeModal} originalFile={originalFile} originalFileInfo={originalFileInfo} selectedFile={selectedFile} />
    </div>
  );
}

export default App;