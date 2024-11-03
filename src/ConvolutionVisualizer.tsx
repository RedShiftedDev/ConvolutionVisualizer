"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Calculator, Pause, Play, RotateCcw, SkipForward, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import KernelVisualization from './components/KernelVisualization';
import PixelGrid from './components/PixelGrid';
import { KERNELS, MAX_SPEED, MIN_SPEED, SPEED_STEP } from './constants';
import { ConvolutionResult, ImageType, KernelType, Position } from './types';
import { applyAutoContrast, computeConvolution, generateSampleImage, processImageToGrayscale } from './utils';

const ConvolutionVisualizer: React.FC = () => {
    const [image, setImage] = useState<ImageType>(generateSampleImage());
    const [kernel, setKernel] = useState<KernelType>(KERNELS['Edge Detection']);
    const [result, setResult] = useState<ImageType>([[]]);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number[]>([1]);
    const [currentKernel, setCurrentKernel] = useState<string>('Edge Detection');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [showKernelCalculation, setShowKernelCalculation] = useState<boolean>(false);
    const [currentCalculation, setCurrentCalculation] = useState<ConvolutionResult | null>(null);
    const [autoContrast, setAutoContrast] = useState<boolean>(false);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const img = new Image();
                img.onload = async () => {
                    const processedImage = await processImageToGrayscale(img);
                    setImage(processedImage);
                    setPosition({ x: 0, y: 0 });
                    setIsProcessing(false);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing image:', error);
            setIsProcessing(false);
        }
    };

    const computeFullResult = (): void => {
        if (!image || !image[0]) return;

        const newResult: number[][] = [];
        for (let y = 0; y < image.length; y++) {
            const row: number[] = [];
            for (let x = 0; x < image[0].length; x++) {
                const value = computeConvolution(image, kernel, x, y) as number;
                row.push(value);
            }
            newResult.push(row);
        }

        const finalResult = autoContrast ? applyAutoContrast(newResult) : newResult;
        setResult(finalResult);
    };

    useEffect(() => {
        if (image && image[0]) {
            computeFullResult();
        }
    }, [kernel, image, autoContrast]);

    useEffect(() => {
        if (showKernelCalculation && image && image[0]) {
            const calculation = computeConvolution(
                image,
                kernel,
                position.x,
                position.y,
                true
            ) as ConvolutionResult;
            setCurrentCalculation(calculation);
        }
    }, [position, showKernelCalculation, kernel, image]);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isPlaying && image && image[0]) {
            interval = setInterval(() => {
                setPosition(prev => {
                    const newX = prev.x + 1;
                    const newY = newX >= image[0].length ? prev.y + 1 : prev.y;
                    const finalX = newX >= image[0].length ? 0 : newX;
                    const finalY = newY >= image.length ? 0 : newY;

                    if (newY >= image.length) {
                        setIsPlaying(false);
                    }

                    return { x: finalX, y: finalY };
                });
            }, 1000 / (speed[0] * 2));
        }
        return () => clearInterval(interval);
    }, [isPlaying, speed, image]);

    const handleKernelChange = (value: string): void => {
        setCurrentKernel(value);
        setKernel(KERNELS[value]);
        setPosition({ x: 0, y: 0 });
    };

    const handleStep = () => {
        setPosition(prev => {
            const newX = prev.x + 1;
            const newY = newX >= image[0].length ? prev.y + 1 : prev.y;
            return {
                x: newX >= image[0].length ? 0 : newX,
                y: newY >= image.length ? 0 : newY
            };
        });
    };

    const renderCalculationDetails = () => {
        if (!currentCalculation) return null;

        return (
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="text-sm">Calculation Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Image Values</h4>
                                <div className="grid grid-cols-3 gap-1">
                                    {currentCalculation.imageValues.map((value, i) => (
                                        <div
                                            key={i}
                                            className="bg-gray-100 p-1 text-center text-sm"
                                        >
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-2">Kernel Values</h4>
                                <div className="grid grid-cols-3 gap-1">
                                    {currentCalculation.kernelValues.map((value, i) => (
                                        <div
                                            key={i}
                                            className="bg-gray-100 p-1 text-center text-sm"
                                        >
                                            {value.toFixed(2)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">Result</h4>
                            <div className="bg-gray-100 p-2 text-center">
                                {currentCalculation.value}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Convolution Visualizer</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={isProcessing}
                        />
                        <label htmlFor="image-upload">
                            <Button variant="outline" asChild disabled={isProcessing}>
                                <span>
                                    <Upload className="w-4 h-4 mr-2" />
                                    {isProcessing ? 'Processing...' : 'Upload Image'}
                                </span>
                            </Button>
                        </label>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={autoContrast}
                                onCheckedChange={setAutoContrast}
                                id="auto-contrast"
                            />
                            <label htmlFor="auto-contrast" className="text-sm">
                                Auto Contrast
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Input Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Input Image (Grayscale)</CardTitle>
                            </CardHeader>
                            <CardContent className="h-64 overflow-auto flex items-center justify-center">
                                <PixelGrid
                                    data={image}
                                    highlightPos={position}
                                    highlightedValues={
                                        showKernelCalculation
                                            ? currentCalculation?.imageValues.map(
                                                (_, i) => position.y * image[0].length + position.x + i
                                            )
                                            : undefined
                                    }
                                />
                            </CardContent>
                        </Card>

                        {/* Kernel */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Kernel</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select value={currentKernel} onValueChange={handleKernelChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(KERNELS).map(k => (
                                            <SelectItem key={k} value={k}>{k}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <KernelVisualization
                                    kernel={kernel}
                                    highlightedValues={
                                        showKernelCalculation
                                            ? currentCalculation?.kernelValues.map((_, i) => i)
                                            : undefined
                                    }
                                />
                            </CardContent>
                        </Card>

                        {/* Result */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Convolution Result</CardTitle>
                            </CardHeader>
                            <CardContent className="h-64 overflow-auto flex items-center justify-center">
                                <PixelGrid
                                    data={result}
                                    highlightPos={position}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant={isPlaying ? "destructive" : "default"}
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                {isPlaying ? 'Pause' : 'Play'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setPosition({ x: 0, y: 0 })}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleStep}
                            >
                                <SkipForward className="w-4 h-4 mr-2" />
                                Step
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowKernelCalculation(!showKernelCalculation)}
                            >
                                <Calculator className="w-4 h-4 mr-2" />
                                {showKernelCalculation ? 'Hide' : 'Show'} Calculation
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium w-20">Speed:</span>
                            <Slider
                                value={speed}
                                onValueChange={setSpeed}
                                min={MIN_SPEED}
                                max={MAX_SPEED}
                                step={SPEED_STEP}
                                className="w-48"
                            />
                            <span className="text-sm font-medium w-16">{speed[0]}x</span>
                        </div>

                        <div className="text-sm text-gray-500">
                            Current Position: ({position.x}, {position.y})
                        </div>
                    </div>

                    {showKernelCalculation && renderCalculationDetails()}
                </CardContent>
            </Card>
        </div>
    );
};

export default ConvolutionVisualizer;
