import { ImageType, KernelType, ConvolutionResult } from './types';

export const generateSampleImage = (size: number = 10): ImageType => {
    const image: number[][] = [];
    for (let i = 0; i < size; i++) {
        const row: number[] = [];
        for (let j = 0; j < size; j++) {
            row.push(128 + 127 * (Math.sin(i / 2) + Math.cos(j / 2)));
        }
        image.push(row);
    }
    return image;
};

export const computeConvolution = (
    image: ImageType,
    kernel: KernelType,
    x: number,
    y: number,
    includeDetails: boolean = false
): ConvolutionResult | number => {
    let sum = 0;
    const kernelValues: number[] = [];
    const imageValues: number[] = [];

    for (let i = 0; i < kernel.length; i++) {
        for (let j = 0; j < kernel[0].length; j++) {
            const imgX = x + j - Math.floor(kernel[0].length / 2);
            const imgY = y + i - Math.floor(kernel.length / 2);

            const kernelValue = kernel[i][j];
            const imageValue = imgX >= 0 && imgX < image[0].length && imgY >= 0 && imgY < image.length
                ? image[imgY][imgX]
                : 0;

            sum += imageValue * kernelValue;

            if (includeDetails) {
                kernelValues.push(kernelValue);
                imageValues.push(imageValue);
            }
        }
    }

    const normalizedSum = Math.max(0, Math.min(255, Math.round(sum)));

    return includeDetails
        ? { value: normalizedSum, kernelValues, imageValues }
        : normalizedSum;
};

export const applyAutoContrast = (image: ImageType): ImageType => {
    // Find min and max values
    let min = 255;
    let max = 0;

    for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[0].length; x++) {
            min = Math.min(min, image[y][x]);
            max = Math.max(max, image[y][x]);
        }
    }

    // Apply contrast stretching
    const range = max - min;
    if (range === 0) return image;

    return image.map(row =>
        row.map(pixel => Math.round(((pixel - min) / range) * 255))
    );
};

export const processImageToGrayscale = async (
    imageElement: HTMLImageElement,
    maxSize: number = 32
): Promise<ImageType> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Calculate new dimensions
    let width = imageElement.width;
    let height = imageElement.height;

    if (width > height) {
        if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
        }
    } else {
        if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
        }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageElement, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const grayScaleMatrix: number[][] = [];

    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const gray = Math.round(
                imageData.data[i] * 0.299 +
                imageData.data[i + 1] * 0.587 +
                imageData.data[i + 2] * 0.114
            );
            row.push(gray);
        }
        grayScaleMatrix.push(row);
    }

    return grayScaleMatrix;
};

export const getColor = (value: number): string => {
    const clampedValue = Math.max(0, Math.min(255, Math.round(value)));
    return `rgb(${clampedValue},${clampedValue},${clampedValue})`;
};
