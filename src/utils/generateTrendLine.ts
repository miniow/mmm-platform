// src/utils/generateTrendLine.ts

export const generateTrendLine = (
    a: number,
    b: number,
    xMin: number,
    xMax: number,
    points: number = 100
  ): { x: number; y: number }[] => {
    const step = (xMax - xMin) / (points - 1);
    const trendLine = [];
    for (let i = 0; i < points; i++) {
      const x = xMin + step * i;
      const y = a * Math.pow(x, b);
      trendLine.push({ x, y });
    }
    return trendLine;
  };
  