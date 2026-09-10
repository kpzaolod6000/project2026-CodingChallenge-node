export type Matrix = number[][];

export interface StatsRequestBody {
  q: Matrix;
  r: Matrix;
}

export interface StatsResult {
  max: number;
  min: number;
  average: number;
  totalSum: number;
  isAnyDiagonal: boolean;
  details?: {
    qIsDiagonal: boolean;
    rIsDiagonal: boolean;
  };
}

export interface ApiResponse<T> {
  status: 'ok' | 'error';
  data?: T;
  error?: string;
}