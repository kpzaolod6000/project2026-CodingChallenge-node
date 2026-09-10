import { Matrix, StatsResult } from '../types/matrix';

const EPSILON = 1e-9;

const isMatrixDiagonal = (m: Matrix): boolean => {
  if (!Array.isArray(m) || m.length === 0) return false;
  const rows = m.length;
  const cols = m[0].length;

  // Una matriz diagonal debe ser cuadrada
  if (rows !== cols) return false;

  for (let i = 0; i < rows; i++) {
    if (!Array.isArray(m[i]) || m[i].length !== cols) return false;
    for (let j = 0; j < cols; j++) {
      if (i !== j && Math.abs(m[i][j]) > EPSILON) {
        return false;
      }
    }
  }
  return true;
};

export const calculateCombinedStats = (q: Matrix, r: Matrix): StatsResult => {
  let max = -Infinity;
  let min = Infinity;
  let totalSum = 0;
  let count = 0;

  const processMatrix = (matrix: Matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const val = matrix[i][j];
        if (typeof val === 'number' && !Number.isNaN(val)) {
          if (val > max) max = val;
          if (val < min) min = val;
          totalSum += val;
          count++;
        }
      }
    }
  };

  processMatrix(q);
  processMatrix(r);

  const qIsDiag = isMatrixDiagonal(q);
  const rIsDiag = isMatrixDiagonal(r);

  return {
    max: count > 0 ? max : 0,
    min: count > 0 ? min : 0,
    average: count > 0 ? totalSum / count : 0,
    totalSum,
    isAnyDiagonal: qIsDiag || rIsDiag,
    details: {
      qIsDiagonal: qIsDiag,
      rIsDiagonal: rIsDiag,
    },
  };
};