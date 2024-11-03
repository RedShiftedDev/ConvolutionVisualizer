import { Kernels } from './types';

export const DEFAULT_IMAGE_SIZE = 32;
export const MIN_SPEED = 0.5;
export const MAX_SPEED = 5;
export const SPEED_STEP = 0.5;

export const KERNELS: Kernels = {
    'Edge Detection': [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1]
    ],
    'Gaussian Blur': [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]
    ].map(row => row.map(x => x / 16)),
    'Sharpen': [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ],
    'Emboss': [
        [-2, -1, 0],
        [-1, 1, 1],
        [0, 1, 2]
    ],
    'Identity': [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ],
    'Sobel X': [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ],
    'Sobel Y': [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ],
    'Box Blur': [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ].map(row => row.map(x => x / 9)),
    'Laplacian': [
        [0, 1, 0],
        [1, -4, 1],
        [0, 1, 0]
    ]
};
