import React from 'react';

function FileList({ files, originalSize, openModal }) {
    return (
        <div className="compressed-files">
            <h2>Compressed Files</h2>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>File</th>
                        <th>Size (KB)</th>
                        <th>Reduction (KB)</th>
                        <th>Reduction (%)</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) => {
                        const originalSizeFloat = parseFloat(originalSize);
                        const compressedSize = parseFloat(file.size);
                        const reduction = (originalSizeFloat - compressedSize).toFixed(2);
                        const reductionPercent = ((reduction / originalSizeFloat) * 100).toFixed(2);

                        return (
                            <tr key={index}>
                                <td>{file.method}</td>
                                <td>
                                    {file.url.endsWith('.pdf') ? (
                                        <embed src={file.url} type="application/pdf" className="compressed-file" onClick={() => openModal(file)} />
                                    ) : (
                                        <img
                                            src={file.url}
                                            alt={file.method}
                                            className="compressed-file"
                                            loading="lazy"
                                            onClick={() => openModal(file)}
                                        />
                                    )}
                                </td>
                                <td>{file.size}</td>
                                <td>{reduction}</td>
                                <td>{reductionPercent}%</td>
                                <td>
                                    <a href={file.url} download={`compressed-${file.method}.${file.url.endsWith('.pdf') ? 'pdf' : 'jpg'}`}>
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

export default FileList;