// src/utils/computePowerTrend.ts

export interface PowerTrendResult {
    a: number;
    b: number;
    rSquared: number;
  }
  
  export const computePowerTrend = (x: number[], y: number[]): PowerTrendResult | null => {
    const n = x.length;
    if (n !== y.length || n === 0) return null;
  
    // Ensure all x and y are positive for log transformation
    for (let i = 0; i < n; i++) {
      if (x[i] <= 0 || y[i] <= 0) return null;
    }
  
    const logX = x.map((val) => Math.log(val));
    const logY = y.map((val) => Math.log(val));
  
    const sumX = logX.reduce((acc, val) => acc + val, 0);
    const sumY = logY.reduce((acc, val) => acc + val, 0);
    const sumXY = logX.reduce((acc, val, idx) => acc + val * logY[idx], 0);
    const sumXX = logX.reduce((acc, val) => acc + val * val, 0);
  
    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) return null;
  
    const b = (n * sumXY - sumX * sumY) / denominator;
    const logA = (sumY - b * sumX) / n;
    const a = Math.exp(logA);
  
    // Calculate R²
    const meanLogY = sumY / n;
    const ssTot = logY.reduce((acc, val) => acc + Math.pow(val - meanLogY, 2), 0);
    const ssRes = logY.reduce(
      (acc, val, idx) => acc + Math.pow(val - (b * logX[idx] + Math.log(a)), 2),
      0
    );
    const rSquared = 1 - ssRes / ssTot;
  
    return { a, b, rSquared };
  };
  