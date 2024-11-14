import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [originalImageInfo, setOriginalImageInfo] = useState({ size: 0 });
  const [compressedImages, setCompressedImages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalImageInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2), // Size in KB
        type: file.type,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
        compressUsingLibraries(file);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  // Compression using browser-image-compression library
  const compressWithBrowserImageCompression = async (file) => {
    const options = {
      maxSizeMB: 0.15, // Desired size in MB
      maxWidthOrHeight: 900,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const compressedUrl = URL.createObjectURL(compressedFile);
      return {
        method: 'browser-image-compression',
        url: compressedUrl,
        size: (compressedFile.size / 1024).toFixed(2), // Size in KB
      };
    } catch (error) {
      console.error('Compression failed:', error);
      return null;
    }
  };

  // Compression using Canvas API
  const compressWithCanvas = (file, quality = 0.55, maxWidth = 1024) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedUrl = URL.createObjectURL(blob);
                resolve({
                  method: 'Canvas API',
                  url: compressedUrl,
                  size: (blob.size / 1024).toFixed(2), // Size in KB
                });
              } else {
                reject(new Error('Canvas is empty'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Compression using a custom method
  // This method uses different options for imageCompression library
  const compressWithCustomMethod = async (file) => {
    const options = {
      maxSizeMB: 0.12, // Desired size in MB
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const compressedUrl = URL.createObjectURL(compressedFile);
      return {
        method: 'Custom Method',
        url: compressedUrl,
        size: (compressedFile.size / 1024).toFixed(2), // Size in KB
      };
    } catch (error) {
      console.error('Custom compression failed:', error);
      return null;
    }
  };

  // Compression using an alternative method
  // This method uses different options for imageCompression library
  const compressWithAlternativeMethod = async (file) => {
    const options = {
      maxSizeMB: 0.15, // Desired size in MB
      maxWidthOrHeight: 900,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const compressedUrl = URL.createObjectURL(compressedFile);
      return {
        method: 'Alternative Method',
        url: compressedUrl,
        size: (compressedFile.size / 1024).toFixed(2), // Size in KB
      };
    } catch (error) {
      console.error('Alternative compression failed:', error);
      return null;
    }
  };


  // This function will compress image files with specific focus on preserving
  // text clarity, using advanced options from browser-image-compression library.
  const compressWithAlternativeMethod_advance = async (file) => {
    // Configuration options for compression
    // const options = {
    //   maxSizeMB: 0.03, // Target compressed size in MB
    //   maxWidthOrHeight: 900, // Maximum width or height to resize to maintain aspect ratio
    //   useWebWorker: true, // Enable Web Worker for performance optimization
    //   initialQuality: 0.6, // Start with 70% quality for better initial results
    //   alwaysKeepResolution: true, // Ensure the resolution remains unchanged
    //   signal: null, // Optional: could be used to cancel ongoing processing
    // };

    const options = {
      maxSizeMB: 0.09, // Target compressed size in MB
      maxWidthOrHeight: 950, // Maximum width or height to resize without maintaining aspect ratio
      useWebWorker: true, // Enable Web Worker for performance optimization
      initialQuality: 0.50, // Start with 70% quality for better initial results
      alwaysKeepResolution: true, // Ensure the resolution remains unchanged
      signal: null, // Optional: could be used to cancel ongoing processing
      resizeWidth: 900, // Set specific width for resizing
      resizeHeight: 600, // Set specific height for resizing
    };

    try {
      // Compress the file using imageCompression library with specified options
      const compressedFile = await imageCompression(file, options);

      // Generate a URL for the compressed image for preview or download
      const compressedUrl = URL.createObjectURL(compressedFile);

      return {
        method: 'Advance raw Method',
        url: compressedUrl, // URL to access the compressed image
        size: (compressedFile.size / 1024).toFixed(2), // Convert size to KB for easy reading
      };
    } catch (error) {
      console.error('Alternative compression failed:', error); // Log errors for debugging
      return null; // Return null to indicate compression failure
    }
  };

  // Function to compress using multiple methods and display results
  const compressUsingLibraries = async (file) => {
    const results = [];

    const browserCompressed = await compressWithBrowserImageCompression(file);
    if (browserCompressed) results.push(browserCompressed);

    const canvasCompressed = await compressWithCanvas(file);
    if (canvasCompressed) results.push(canvasCompressed);

    const customCompressed = await compressWithCustomMethod(file);
    if (customCompressed) results.push(customCompressed);

    const alternativeCompressed = await compressWithAlternativeMethod(file);
    if (alternativeCompressed) results.push(alternativeCompressed);

    const alternativeCompressed_advance = await compressWithAlternativeMethod_advance(file);
    if (alternativeCompressed_advance) results.push(alternativeCompressed_advance);

    setCompressedImages(results);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="App">
      <h1>Image Uploader & Compression Comparison</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        aria-label="Upload an image"
      />
      <br />

      {originalImage && (
        <div className="image-panel">
          <h2>Original Image</h2>
          <img src={originalImage} alt="Original" className="uploaded-image" loading="lazy" />
          <p>Size: {originalImageInfo.size} KB</p>
          <p>Type: {originalImageInfo.type}</p>
        </div>
      )}

      {compressedImages.length > 0 && (
        <div className="compressed-images">
          <h2>Compressed Images</h2>
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Image</th>
                <th>Size (KB)</th>
                <th>Reduction (KB)</th>
                <th>Reduction (%)</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {compressedImages.map((image, index) => {
                const originalSize = parseFloat(originalImageInfo.size);
                const compressedSize = parseFloat(image.size);
                const reduction = (originalSize - compressedSize).toFixed(2);
                const reductionPercent = ((reduction / originalSize) * 100).toFixed(2);

                return (
                  <tr key={index}>
                    <td>{image.method}</td>
                    <td>
                      <img
                        src={image.url}
                        alt={image.method}
                        className="compressed-image"
                        loading="lazy"
                        onClick={() => openModal(image)}
                      />
                    </td>
                    <td>{image.size}</td>
                    <td>{reduction}</td>
                    <td>{reductionPercent}%</td>
                    <td>
                      <a href={image.url} download={`compressed-${image.method}.jpg`}>
                        Download
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
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
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;