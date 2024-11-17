import React from 'react';

function ImageList({ images, originalSize, openModal }) {
    return (
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
                    {images.map((image, index) => {
                        const originalSizeFloat = parseFloat(originalSize);
                        const compressedSize = parseFloat(image.size);
                        const reduction = (originalSizeFloat - compressedSize).toFixed(2);
                        const reductionPercent = ((reduction / originalSizeFloat) * 100).toFixed(2);

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
    );
}

export default ImageList;