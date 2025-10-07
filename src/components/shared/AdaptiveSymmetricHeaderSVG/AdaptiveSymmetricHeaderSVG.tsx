import React from "react";

interface AdaptiveSymmetricHeaderSVGProps {
  width: number;
  className?: string;
}

const calculateSquareSize = (containerWidth: number) => {
  const baseSquareSize = 20;
  const minWidthForFullSize = 768;

  let squareSize: number;

  if (containerWidth >= minWidthForFullSize) {
    squareSize = baseSquareSize;
  } else {
    const scaleFactor = containerWidth / minWidthForFullSize;
    squareSize = Math.max(8, Math.floor(baseSquareSize * scaleFactor));
  }

  return squareSize;
};

const AdaptiveSymmetricHeaderSVG: React.FC<AdaptiveSymmetricHeaderSVGProps> = ({
  width,
  className,
}) => {
  const squareSize = calculateSquareSize(width);

  const availableWidth = width * 0.6;

  const minSquares = 8;
  const maxSquares = Math.floor((availableWidth - squareSize * 6) / squareSize);
  const lineSquares = Math.max(minSquares, maxSquares);
  const lineWidth = lineSquares * squareSize;

  const svgHeight = squareSize * 2;
  const totalWidth = lineWidth + squareSize * 6;

  const overlap = 0.5;
  const color = "#CFB293";

  return (
    <svg
      width={totalWidth}
      height={svgHeight}
      viewBox={`0 0 ${totalWidth} ${svgHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
      }}
    >
      <rect
        x={0}
        y={0}
        width={squareSize + overlap}
        height={squareSize + overlap}
        fill={color}
      />

      <rect
        x={squareSize - overlap}
        y={squareSize}
        width={squareSize + 2 * overlap}
        height={squareSize + overlap}
        fill={color}
      />

      <rect
        x={squareSize * 2 - overlap}
        y={squareSize}
        width={squareSize + overlap}
        height={squareSize + overlap}
        fill={color}
      />

      {Array.from({ length: lineSquares }, (_, i) => (
        <rect
          key={`line-${i}`}
          x={squareSize * 3 + i * squareSize - (i > 0 ? overlap : 0)}
          y={squareSize}
          width={
            squareSize +
            (i > 0 ? overlap : 0) +
            (i < lineSquares - 1 ? overlap : 0)
          }
          height={squareSize}
          fill={color}
        />
      ))}

      <rect
        x={totalWidth - squareSize * 3}
        y={squareSize}
        width={squareSize + overlap}
        height={squareSize + overlap}
        fill={color}
      />

      <rect
        x={totalWidth - squareSize * 2 + overlap}
        y={squareSize}
        width={squareSize + 2 * overlap}
        height={squareSize + overlap}
        fill={color}
      />

      <rect
        x={totalWidth - squareSize + overlap}
        y={0}
        width={squareSize + overlap}
        height={squareSize + overlap}
        fill={color}
      />
    </svg>
  );
};

export default AdaptiveSymmetricHeaderSVG;
