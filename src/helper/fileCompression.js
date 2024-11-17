import imageCompression from 'browser-image-compression';
// import { PDFDocument, PDFImage } from 'pdf-lib'; // Example PDF compression library
import { PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';


export const compressWithBrowserImageCompression = async (file) => {
    const options = {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 900,
        useWebWorker: true,
    };
    try {
        const compressedFile = await imageCompression(file, options);
        const compressedUrl = URL.createObjectURL(compressedFile);
        return {
            method: 'browser-image-compression',
            url: compressedUrl,
            size: (compressedFile.size / 1024).toFixed(2),
        };
    } catch (error) {
        console.error('Compression failed:', error);
        return null;
    }
};

export const compressWithCanvas = (file, quality = 0.55, maxWidth = 1024) => {
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
                                size: (blob.size / 1024).toFixed(2),
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

export const compressWithCustomMethod = async (file) => {
    const options = {
        maxSizeMB: 0.12,
        maxWidthOrHeight: 800,
        useWebWorker: true,
    };
    try {
        const compressedFile = await imageCompression(file, options);
        const compressedUrl = URL.createObjectURL(compressedFile);
        return {
            method: 'Custom Method',
            url: compressedUrl,
            size: (compressedFile.size / 1024).toFixed(2),
        };
    } catch (error) {
        console.error('Custom compression failed:', error);
        return null;
    }
};

export const compressWithAlternativeMethod = async (file) => {
    const options = {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 900,
        useWebWorker: true,
    };
    try {
        const compressedFile = await imageCompression(file, options);
        const compressedUrl = URL.createObjectURL(compressedFile);
        return {
            method: 'Alternative Method',
            url: compressedUrl,
            size: (compressedFile.size / 1024).toFixed(2),
        };
    } catch (error) {
        console.error('Alternative compression failed:', error);
        return null;
    }
};

export const compressWithAlternativeMethod_advance = async (file) => {
    const options = {
        maxSizeMB: 0.09,
        maxWidthOrHeight: 950,
        useWebWorker: true,
        initialQuality: 0.50,
        alwaysKeepResolution: true,
        resizeWidth: 900,
        resizeHeight: 600,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        const compressedUrl = URL.createObjectURL(compressedFile);
        return {
            method: 'Advance raw Method',
            url: compressedUrl,
            size: (compressedFile.size / 1024).toFixed(2),
        };
    } catch (error) {
        console.error('Alternative compression failed:', error);
        return null;
    }
};

// export const compressWithPdfLib = async (file) => {
//     try {
//         const pdfDoc = await PDFDocument.load(await file.arrayBuffer());

//         // Compress images within the PDF
//         const pages = pdfDoc.getPages();
//         for (const page of pages) {
//             const { width, height } = page.getSize();
//             const images = page.node.Resources().XObject();

//             for (const key in images) {
//                 const image = images[key];
//                 if (image instanceof PDFImage) {
//                     const compressedImage = await image.compress({
//                         quality: 0.5, // Adjust quality as needed
//                     });
//                     page.node.Resources().XObject()[key] = compressedImage;
//                 }
//             }

//             page.setSize(width, height); // Keep original size
//         }

//         const compressedPdfBytes = await pdfDoc.save();
//         const compressedFile = new Blob([compressedPdfBytes], { type: 'application/pdf' });
//         const compressedUrl = URL.createObjectURL(compressedFile);
//         console.log('compressedFile', compressedFile);
//         return {
//             method: 'pdf-lib',
//             url: compressedUrl,
//             size: (compressedFile.size / 1024).toFixed(2),
//         };
//     } catch (error) {
//         console.error('PDF compression failed:', error);
//         return null;
//     }
// };


export const compressWithPdfLib = async (file) => {
    try {
        // Capture original file properties
        const originalName = file.name;
        const originalSize = file.size;
        const lastModified = file.lastModified;
        const lastModifiedDate = file.lastModifiedDate;

        console.log('Original File:', {
            name: originalName,
            size: originalSize,
            lastModified,
            lastModifiedDate,
        });

        const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
        const pages = pdfDoc.getPages();

        for (const page of pages) {
            const { width, height } = page.getSize();
            const images = page.node.Resources().lookup(PDFName.of('XObject'));

            if (images) {
                const keys = images.keys();

                for (const key of keys) {
                    const imageRef = images.get(key);
                    if (imageRef && imageRef.lookup) {
                        const image = imageRef.lookup();

                        // Check if the image is a valid object
                        if (image && image instanceof PDFRawStream) {
                            const imageBytes = image.getBytes();
                            const compressedImageBytes = await imageCompression(new Blob([imageBytes]), {
                                maxSizeMB: 0.15,
                                maxWidthOrHeight: 900,
                                useWebWorker: true,
                            });

                            // Embed the compressed image
                            const compressedImage = await pdfDoc.embedJpg(await compressedImageBytes.arrayBuffer());
                            page.drawImage(compressedImage, {
                                x: 0,
                                y: 0,
                                width: width,
                                height: height,
                            });
                        }
                    }
                }
            }

            page.setSize(width, height); // Retain original size
        }

        const compressedPdfBytes = await pdfDoc.save();
        const compressedFile = new Blob([compressedPdfBytes], { type: 'application/pdf' });
        const compressedUrl = URL.createObjectURL(compressedFile);

        console.log('Compressed File:', {
            method: 'pdf-lib',
            url: compressedUrl,
            size: (compressedFile.size / 1024).toFixed(2) + ' KB',
        });

        return {
            method: 'pdf-lib',
            name: originalName, // Keep the original name for reference
            originalSize: (originalSize / 1024).toFixed(2) + ' KB', // Log original size
            compressedSize: (compressedFile.size / 1024).toFixed(2) + ' KB', // Compressed size
            lastModified,
            lastModifiedDate,
            url: compressedUrl,
        };
    } catch (error) {
        console.error('PDF compression failed:', error);
        return null;
    }
};



// Add more PDF compression methods here...

export const compressUsingLibraries = async (file) => {
    const results = [];

    if (file.type.startsWith('image/')) {
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
    } else if (file.type === 'application/pdf') {
        console.log('file', file);
        const pdfLibCompressed = await compressWithPdfLib(file);
        console.log('pdfLibCompressed', pdfLibCompressed);
        if (pdfLibCompressed) results.push(pdfLibCompressed);

        // Add more PDF compression methods here...
    }

    return results;
};