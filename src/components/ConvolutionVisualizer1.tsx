// "use client";

// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Slider } from '@/components/ui/slider';
// import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
// import React, { useEffect, useState } from 'react';

// type KernelType = number[][];
// type ImageType = number[][];
// type Position = {
//     x: number;
//     y: number;
// };

// interface Kernels {
//     [key: string]: KernelType;
// }

// const kernels: Kernels = {
//     'Edge Detection': [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
//     'Gaussian Blur': [[1, 2, 1], [2, 4, 2], [1, 2, 1]].map(row => row.map(x => x / 16)),
//     'Sharpen': [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
//     'Emboss': [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]],
//     'Identity': [[0, 0, 0], [0, 1, 0], [0, 0, 0]]
// };

// const generateSampleImage = (size: number = 10): ImageType => {
//     const image: number[][] = [];
//     for (let i = 0; i < size; i++) {
//         const row: number[] = [];
//         for (let j = 0; j < size; j++) {
//             row.push(128 + 127 * (Math.sin(i / 2) + Math.cos(j / 2)));
//         }
//         image.push(row);
//     }
//     return image;
// };

// const ConvolutionVisualizer: React.FC = () => {
//     const [image] = useState<ImageType>(generateSampleImage());
//     const [kernel, setKernel] = useState<KernelType>(kernels['Edge Detection']);
//     const [result, setResult] = useState<ImageType>([[]]);  // Initialize with empty grid
//     const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
//     const [isPlaying, setIsPlaying] = useState<boolean>(false);
//     const [speed, setSpeed] = useState<number[]>([1]);
//     const [currentKernel, setCurrentKernel] = useState<string>('Edge Detection');

//     const computeConvolution = (x: number, y: number): number => {
//         let sum = 0;
//         for (let i = 0; i < kernel.length; i++) {
//             for (let j = 0; j < kernel[0].length; j++) {
//                 const imgX = x + j - Math.floor(kernel[0].length / 2);
//                 const imgY = y + i - Math.floor(kernel.length / 2);
//                 if (imgX >= 0 && imgX < image[0].length && imgY >= 0 && imgY < image.length) {
//                     sum += image[imgY][imgX] * kernel[i][j];
//                 }
//             }
//         }
//         return sum;
//     };

//     const computeFullResult = (): void => {
//         const newResult: number[][] = [];
//         for (let y = 0; y < image.length; y++) {
//             const row: number[] = [];
//             for (let x = 0; x < image[0].length; x++) {
//                 row.push(computeConvolution(x, y));
//             }
//             newResult.push(row);
//         }
//         setResult(newResult);
//     };

//     useEffect(() => {
//         computeFullResult();
//     }, [kernel]);

//     useEffect(() => {
//         let interval: NodeJS.Timeout | undefined;
//         if (isPlaying) {
//             interval = setInterval(() => {
//                 setPosition(prev => {
//                     const newX = prev.x + 1;
//                     const newY = newX >= image[0].length ? prev.y + 1 : prev.y;
//                     const finalX = newX >= image[0].length ? 0 : newX;
//                     const finalY = newY >= image.length ? 0 : newY;

//                     if (newY >= image.length) {
//                         setIsPlaying(false);
//                     }

//                     return { x: finalX, y: finalY };
//                 });
//             }, 1000 / (speed[0] * 2));
//         }
//         return () => clearInterval(interval);
//     }, [isPlaying, speed, image]);

//     const handleKernelChange = (value: string): void => {
//         setCurrentKernel(value);
//         setKernel(kernels[value]);
//     };

//     const getColor = (value: number): string => {
//         const normalized = (value + 255) / 510;
//         return `rgb(${Math.floor(255 * (1 - normalized))},${Math.floor(255 * (1 - normalized))},255)`;
//     };

//     const renderGrid = (data: ImageType, highlightPos: boolean = false) => {
//         if (!data || !data[0]) {
//             return <div className="text-center p-4">No data available</div>;
//         }

//         return (
//             <div className="grid gap-px bg-gray-200"
//                 style={{ gridTemplateColumns: `repeat(${data[0].length}, minmax(0, 1fr))` }}>
//                 {data.map((row, y) =>
//                     row.map((value, x) => (
//                         <div
//                             key={`${y}-${x}`}
//                             className={`aspect-square flex items-center justify-center text-xs font-mono
//                           ${highlightPos && x === position.x && y === position.y ? 'ring-2 ring-red-500' : ''}`}
//                             style={{ backgroundColor: getColor(value) }}
//                         >
//                             {value.toFixed(0)}
//                         </div>
//                     ))
//                 )}
//             </div>
//         );
//     };

//     return (
//         <div className="p-6 max-w-7xl mx-auto space-y-6">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Convolution Visualizer</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {/* Input Image */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="text-sm">Input Image</CardTitle>
//                             </CardHeader>
//                             <CardContent className="h-64 overflow-auto">
//                                 {renderGrid(image, true)}
//                             </CardContent>
//                         </Card>

//                         {/* Kernel */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="text-sm">Kernel</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <Select value={currentKernel} onValueChange={handleKernelChange}>
//                                     <SelectTrigger>
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {Object.keys(kernels).map(k => (
//                                             <SelectItem key={k} value={k}>{k}</SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                                 <div className="mt-4 grid gap-px bg-gray-200"
//                                     style={{ gridTemplateColumns: `repeat(${kernel[0].length}, minmax(0, 1fr))` }}>
//                                     {kernel.map((row, i) =>
//                                         row.map((value, j) => (
//                                             <div
//                                                 key={`${i}-${j}`}
//                                                 className="aspect-square flex items-center justify-center text-xs font-mono bg-white"
//                                             >
//                                                 {value.toFixed(2)}
//                                             </div>
//                                         ))
//                                     )}
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {/* Result */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="text-sm">Result</CardTitle>
//                             </CardHeader>
//                             <CardContent className="h-64 overflow-auto">
//                                 {renderGrid(result, true)}
//                             </CardContent>
//                         </Card>
//                     </div>

//                     <div className="mt-6 space-y-4">
//                         <div className="flex items-center gap-4">
//                             <Button
//                                 variant={isPlaying ? "destructive" : "default"}
//                                 onClick={() => setIsPlaying(!isPlaying)}
//                             >
//                                 {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
//                                 {isPlaying ? 'Pause' : 'Play'}
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 onClick={() => setPosition({ x: 0, y: 0 })}
//                             >
//                                 <RotateCcw className="w-4 h-4 mr-2" />
//                                 Reset
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 onClick={() => {
//                                     setPosition(prev => {
//                                         const newX = prev.x + 1;
//                                         const newY = newX >= image[0].length ? prev.y + 1 : prev.y;
//                                         return {
//                                             x: newX >= image[0].length ? 0 : newX,
//                                             y: newY >= image.length ? 0 : newY
//                                         };
//                                     });
//                                 }}
//                             >
//                                 <SkipForward className="w-4 h-4 mr-2" />
//                                 Step
//                             </Button>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             <span className="text-sm font-medium">Speed:</span>
//                             <div className="flex-1">
//                                 <Slider
//                                     value={speed}
//                                     onValueChange={setSpeed}
//                                     min={0.1}
//                                     max={5}
//                                     step={0.1}
//                                 />
//                             </div>
//                             <span className="text-sm font-medium w-12">{speed[0]}x</span>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default ConvolutionVisualizer;
