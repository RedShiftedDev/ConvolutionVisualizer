export type KernelType = number[][];
export type ImageType = number[][];
export type Position = {
    x: number;
    y: number;
};

export interface Kernels {
    [key: string]: KernelType;
}

export interface ConvolutionResult {
    value: number;
    kernelValues: number[];
    imageValues: number[];
}

export interface VisualizerState {
    isPlaying: boolean;
    speed: number[];
    position: Position;
    isProcessing: boolean;
    showKernelCalculation: boolean;
    autoContrast: boolean;
    currentKernel: string;
    imageSize: {
        width: number;
        height: number;
    };
}
