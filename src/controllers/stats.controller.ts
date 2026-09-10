import { Request, Response } from 'express';
import { StatsRequestBody, ApiResponse, StatsResult } from '../types/matrix';
import { calculateCombinedStats } from '../services/matrix.service';

const isValidMatrix = (m: unknown): boolean => {
  if (!Array.isArray(m) || m.length === 0) return false;
  return m.every(row => Array.isArray(row) && row.length > 0 && row.every(val => typeof val === 'number'));
};

export const computeStatsHandler = (
  req: Request<unknown, unknown, StatsRequestBody>,
  res: Response<ApiResponse<StatsResult>>
) => {
  const { q, r } = req.body;

  if (!isValidMatrix(q) || !isValidMatrix(r)) {
    return res.status(400).json({
      status: 'error',
      error: 'Se requiere un body JSON con { q: number[][], r: number[][] } válidos.',
    });
  }

  const result = calculateCombinedStats(q, r);

  return res.status(200).json({
    status: 'ok',
    data: result,
  });
};

export const getStats = computeStatsHandler;