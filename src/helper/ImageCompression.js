import imageCompression from 'browser-image-compression';

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

export const compressUsingLibraries = async (file) => {
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

    return results;
};