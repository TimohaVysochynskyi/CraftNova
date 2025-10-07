import React from "react";

interface AdaptiveSVGBackgroundProps {
  width: number;
  height: number;
  className?: string;
}

// Функція для розрахунку оптимальних розмірів
const calculateDimensions = (
  containerWidth: number,
  containerHeight: number
) => {
  // Базовий розмір квадратика - 20px (як в оригіналі)
  const baseSquareSize = 20;

  // Мінімальна ширина для повного розміру квадратиків
  const minWidthForFullSize = 768;

  let squareSize: number;

  if (containerWidth >= minWidthForFullSize) {
    // На великих екранах завжди 20px
    squareSize = baseSquareSize;
  } else {
    // На маленьких екранах масштабуємо пропорційно
    const scaleFactor = containerWidth / minWidthForFullSize;
    // Мінімальний розмір 8px для читабельності
    squareSize = Math.max(8, Math.floor(baseSquareSize * scaleFactor));
  }

  // Розраховуємо кількість квадратиків для повного покриття
  const squaresWidth = Math.ceil(containerWidth / squareSize);
  const squaresHeight = Math.ceil(containerHeight / squareSize);

  // Точний розмір SVG для покриття всього контейнера
  const svgWidth = squaresWidth * squareSize;
  const svgHeight = squaresHeight * squareSize;

  return {
    squareSize,
    squaresWidth,
    squaresHeight,
    svgWidth,
    svgHeight,
  };
};

// Функція для генерації рамки з квадратиків
const generateBorder = (
  squareSize: number,
  squaresWidth: number,
  squaresHeight: number
): React.ReactElement[] => {
  const elements: React.ReactElement[] = [];
  const color = "#CFB293";

  // Невеликий overlap для усунення тонких ліній
  const overlap = 0.5;

  // Верхня лінія
  for (let i = 0; i < squaresWidth; i++) {
    elements.push(
      <rect
        key={`top-${i}`}
        x={i * squareSize - (i > 0 ? overlap : 0)}
        y={0}
        width={
          squareSize +
          (i > 0 ? overlap : 0) +
          (i < squaresWidth - 1 ? overlap : 0)
        }
        height={squareSize + overlap}
        fill={color}
      />
    );
  }

  // Нижня лінія
  for (let i = 0; i < squaresWidth; i++) {
    elements.push(
      <rect
        key={`bottom-${i}`}
        x={i * squareSize - (i > 0 ? overlap : 0)}
        y={(squaresHeight - 1) * squareSize - overlap}
        width={
          squareSize +
          (i > 0 ? overlap : 0) +
          (i < squaresWidth - 1 ? overlap : 0)
        }
        height={squareSize + overlap}
        fill={color}
      />
    );
  }

  // Ліва лінія (без кутів, щоб не дублювати)
  for (let i = 1; i < squaresHeight - 1; i++) {
    elements.push(
      <rect
        key={`left-${i}`}
        x={0}
        y={i * squareSize - overlap}
        width={squareSize + overlap}
        height={squareSize + 2 * overlap}
        fill={color}
      />
    );
  }

  // Права лінія (без кутів)
  for (let i = 1; i < squaresHeight - 1; i++) {
    elements.push(
      <rect
        key={`right-${i}`}
        x={(squaresWidth - 1) * squareSize - overlap}
        y={i * squareSize - overlap}
        width={squareSize + overlap}
        height={squareSize + 2 * overlap}
        fill={color}
      />
    );
  }

  return elements;
};

// Функція для генерації кутових квадратиків за межами рамки
const generateCornerSquares = (
  squareSize: number,
  squaresWidth: number,
  squaresHeight: number
): React.ReactElement[] => {
  const elements: React.ReactElement[] = [];
  const color = "#CFB293";

  // Невеликий overlap для усунення тонких ліній
  const overlap = 0.5;

  // Кутові квадратики за межами рамки (діагонально від кутів)
  const corners = [
    // Верхній лівий кут (зсув (-1, -1) від кута рамки)
    { x: -1, y: -1, key: "corner-top-left" },
    // Верхній правий кут (зсув (+1, -1) від кута рамки)
    { x: squaresWidth, y: -1, key: "corner-top-right" },
    // Нижній лівий кут (зсув (-1, +1) від кута рамки)
    { x: -1, y: squaresHeight, key: "corner-bottom-left" },
    // Нижній правий кут (зсув (+1, +1) від кута рамки)
    { x: squaresWidth, y: squaresHeight, key: "corner-bottom-right" },
  ];

  corners.forEach(({ x, y, key }) => {
    elements.push(
      <rect
        key={key}
        x={x * squareSize - overlap}
        y={y * squareSize - overlap}
        width={squareSize + 2 * overlap}
        height={squareSize + 2 * overlap}
        fill={color}
      />
    );
  });

  return elements;
};

// Функція для генерації декоративних візерунків
const generateDecorations = (
  squareSize: number,
  squaresWidth: number,
  squaresHeight: number,
  containerWidth: number
): React.ReactElement[] => {
  const elements: React.ReactElement[] = [];
  const color = "#CFB293";

  const overlap = 0.5;

  const minWidthForDecorations = 16;
  const minHeightForDecorations = 15;

  if (
    squaresWidth < minWidthForDecorations ||
    squaresHeight < minHeightForDecorations
  ) {
    return elements;
  }

  const basePattern = [
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 2 },
    { x: 3, y: 2 },
    { x: 0, y: 3 },
    { x: 3, y: 3 },
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 2, y: 1 },
    { x: 5, y: 1 },
    { x: 2, y: 7 },
  ];

  const patternWidth = 6;
  const patternHeight = 8;

  if (containerWidth > 900) {
    basePattern.forEach(({ x, y }, index) => {
      const actualX = x + 1 + 1;
      const actualY = y + 1;

      if (actualX < squaresWidth && actualY < squaresHeight) {
        elements.push(
          <rect
            key={`decoration-tl-${index}`}
            x={actualX * squareSize - overlap}
            y={actualY * squareSize - overlap}
            width={squareSize + 2 * overlap}
            height={squareSize + 2 * overlap}
            fill={color}
          />
        );
      }
    });

    basePattern.forEach(({ x, y }, index) => {
      const mirroredX = patternWidth - 4 + x;
      const actualX = squaresWidth - 1 - mirroredX;
      const actualY = y + 1;

      if (actualX >= 0 && actualX < squaresWidth && actualY < squaresHeight) {
        elements.push(
          <rect
            key={`decoration-tr-${index}`}
            x={actualX * squareSize - overlap}
            y={actualY * squareSize - overlap}
            width={squareSize + 2 * overlap}
            height={squareSize + 2 * overlap}
            fill={color}
          />
        );
      }
    });

    basePattern.forEach(({ x, y }, index) => {
      const actualX = x + 1 + 1;
      const mirroredY = patternHeight - 9 + y;
      const actualY = squaresHeight - 1 - mirroredY - 2;

      if (actualX < squaresWidth && actualY >= 0 && actualY < squaresHeight) {
        elements.push(
          <rect
            key={`decoration-bl-${index}`}
            x={actualX * squareSize - overlap}
            y={actualY * squareSize - overlap}
            width={squareSize + 2 * overlap}
            height={squareSize + 2 * overlap}
            fill={color}
          />
        );
      }
    });

    basePattern.forEach(({ x, y }, index) => {
      const mirroredX = patternWidth - 4 + x;
      const actualX = squaresWidth - 1 - mirroredX;
      const mirroredY = patternHeight - 9 + y;
      const actualY = squaresHeight - 1 - mirroredY - 2;

      if (
        actualX >= 0 &&
        actualX < squaresWidth &&
        actualY >= 0 &&
        actualY < squaresHeight
      ) {
        elements.push(
          <rect
            key={`decoration-br-${index}`}
            x={actualX * squareSize - overlap}
            y={actualY * squareSize - overlap}
            width={squareSize + 2 * overlap}
            height={squareSize + 2 * overlap}
            fill={color}
          />
        );
      }
    });
  }

  if (containerWidth > 768 && squaresWidth > 20 && squaresHeight > 15) {
    const crossPattern = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
      { x: 1, y: 4 },
    ];

    crossPattern.forEach(({ x, y }, index) => {
      const actualX = x + 3;
      const actualY = Math.floor(squaresHeight / 2) - 5 + y;

      if (
        actualX >= 0 &&
        actualX < squaresWidth &&
        actualY >= 1 &&
        actualY < squaresHeight - 1
      ) {
        elements.push(
          <rect
            key={`decoration-cross-left-${index}`}
            x={actualX * squareSize - overlap}
            y={actualY * squareSize - overlap}
            width={squareSize + 2 * overlap}
            height={squareSize + 2 * overlap}
            fill={color}
          />
        );
      }
    });

    crossPattern.forEach(({ x, y }, index) => {
      const actualX = squaresWidth - 6 - x + 2;
      const actualY = Math.floor(squaresHeight / 2) + y;

      if (
        actualX >= 0 &&
        actualX < squaresWidth &&
        actualY >= 1 &&
        actualY < squaresHeight - 1
      ) {
        elements.push(
          <rect
            key={`decoration-cross-right-${index}`}
            x={actualX * squareSize - overlap}
            y={actualY * squareSize - overlap}
            width={squareSize + 2 * overlap}
            height={squareSize + 2 * overlap}
            fill={color}
          />
        );
      }
    });
  }

  return elements;
};

const AdaptiveSVGBackground: React.FC<AdaptiveSVGBackgroundProps> = ({
  width,
  height,
  className,
}) => {
  const dimensions = calculateDimensions(width, height);
  const { squareSize, squaresWidth, squaresHeight, svgWidth, svgHeight } =
    dimensions;

  const borderElements = generateBorder(
    squareSize,
    squaresWidth,
    squaresHeight
  );
  const decorationElements = generateDecorations(
    squareSize,
    squaresWidth,
    squaresHeight,
    width
  );
  const cornerElements = generateCornerSquares(
    squareSize,
    squaresWidth,
    squaresHeight
  );

  // Розширюємо SVG для врахування кутових квадратиків
  const extendedSvgWidth = svgWidth + 2 * squareSize; // додаємо по одному квадратику з кожного боку
  const extendedSvgHeight = svgHeight + 2 * squareSize; // додаємо по одному квадратику зверху і знизу

  return (
    <svg
      width={extendedSvgWidth}
      height={extendedSvgHeight}
      viewBox={`${-squareSize} ${-squareSize} ${extendedSvgWidth} ${extendedSvgHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
      }}
    >
      {/* Фонова заливка */}
      <rect
        x={squareSize}
        y={squareSize}
        width={svgWidth - 2 * squareSize}
        height={svgHeight - 2 * squareSize}
        fill="#4D3E2B"
        fillOpacity="0.6"
      />

      {/* Кутові квадратики за межами рамки */}
      {cornerElements}

      {/* Рамка з квадратиків */}
      {borderElements}

      {/* Декоративні елементи */}
      {decorationElements}
    </svg>
  );
};

export default AdaptiveSVGBackground;
