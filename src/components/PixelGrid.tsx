import React from 'react';
import { ImageType, Position } from '../types';
import { getColor } from '../utils';

interface PixelGridProps {
    data: ImageType;
    highlightPos?: Position;
    highlightedValues?: number[];
    cellSize?: number;
}

const PixelGrid: React.FC<PixelGridProps> = ({
    data,
    highlightPos,
    highlightedValues,
    cellSize: initialCellSize
}) => {
    if (!data || !data[0]) {
        return <div className="text-center p-4">No data available</div>;
    }

    const cellSize = initialCellSize || Math.min(12, 320 / data[0].length);

    return (
        <div
            className="grid gap-0"
            style={{
                gridTemplateColumns: `repeat(${data[0].length}, ${cellSize}px)`,
                width: 'fit-content'
            }}
        >
            {data.map((row, y) =>
                row.map((value, x) => {
                    const index = y * data[0].length + x;
                    const isHighlighted = highlightedValues?.includes(index);
                    const isCurrentPos = highlightPos && x === highlightPos.x && y === highlightPos.y;

                    return (
                        <div
                            key={`${y}-${x}`}
                            className={`
                                relative
                                ${isCurrentPos ? 'ring-1 ring-red-500' : ''}
                                ${isHighlighted ? 'ring-1 ring-blue-500' : ''}
                            `}
                            style={{
                                backgroundColor: getColor(value),
                                width: `${cellSize}px`,
                                height: `${cellSize}px`
                            }}
                        >
                            {isCurrentPos && (
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-1 rounded">
                                    {value}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default PixelGrid;
