import React from 'react';
import { KernelType } from '../types';

interface KernelVisualizationProps {
    kernel: KernelType;
    highlightedValues?: number[];
}

const KernelVisualization: React.FC<KernelVisualizationProps> = ({ kernel, highlightedValues }) => {
    return (
        <div className="mt-4 grid gap-px bg-gray-200"
            style={{ gridTemplateColumns: `repeat(${kernel[0].length}, minmax(0, 1fr))` }}>
            {kernel.map((row, i) =>
                row.map((value, j) => {
                    const index = i * kernel[0].length + j;
                    const isHighlighted = highlightedValues?.includes(index);

                    return (
                        <div
                            key={`${i}-${j}`}
                            className={`
                                aspect-square flex items-center justify-center text-xs font-mono bg-white
                                ${isHighlighted ? 'ring-2 ring-blue-500' : ''}
                            `}
                        >
                            {value.toFixed(2)}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default KernelVisualization;
