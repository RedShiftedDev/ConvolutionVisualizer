# Convolution Visualizer

An interactive tool for visualizing convolution operations commonly used in image processing.

## Overview

This application provides a visual and interactive way to understand how convolution operations work on images. You can apply different kernel filters to grayscale images and see the step-by-step calculations behind each pixel transformation.

## Features

- **Interactive Convolution Process**: Watch the convolution process in action with step-by-step visualization
- **Multiple Kernel Filters**: Choose from a variety of predefined kernels:
  - Edge Detection
  - Gaussian Blur
  - Sharpen
  - Emboss
  - Identity
  - Sobel X
  - Sobel Y
  - Box Blur
  - Laplacian
- **Image Upload**: Upload and process your own images
- **Calculation Details**: View the actual computation for each pixel
- **Auto Contrast**: Enhance the visibility of the output with automatic contrast adjustment
- **Playback Controls**: Play, pause, step and adjust the visualization speed

## Usage

1. **Select an Image**: Use the default generated image or upload your own via the "Upload Image" button
2. **Choose a Kernel**: Select from the dropdown list of available convolution kernels
3. **Control Visualization**:
   - Use the Play/Pause button to start/stop the animation
   - Step through the process one pixel at a time
   - Reset the visualization to start from the beginning
   - Adjust the speed using the slider
4. **View Calculations**: Toggle the "Show Calculation" button to see the detailed computation for the current pixel

## Technical Implementation

The application is built with React and TypeScript, using the following structure:

- `ConvolutionVisualizer.tsx`: Main component that orchestrates the visualization
- `KernelVisualization.tsx`: Component for displaying the kernel matrix
- `PixelGrid.tsx`: Component for rendering the image grids (not shown in provided files)
- `constants.ts`: Defines available kernels and other constants
- `types.ts`: TypeScript interfaces and type definitions
- `utils.ts`: Utility functions for image processing and convolution calculations

## Key Operations

### Convolution

The core convolution operation is implemented in the `computeConvolution` function, which:

1. For each pixel position (x, y), applies the kernel matrix centered at that position
2. Multiplies each kernel value with the corresponding image pixel value
3. Sums the products to get the new pixel value
4. Clamps the result to the valid pixel range (0-255)

### Auto Contrast

The `applyAutoContrast` function enhances the visibility of the output by:

1. Finding the minimum and maximum pixel values in the result
2. Stretching the range to fully utilize the 0-255 spectrum

## Dependencies

This project uses:

- React and React Hooks for UI components and state management
- Tailwind CSS and shadcn/ui for styling
- Lucide for icons

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the application.
