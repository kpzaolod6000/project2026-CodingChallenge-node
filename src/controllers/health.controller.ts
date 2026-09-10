import { Request, Response } from 'express';

export const getHealth = (_req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    service: 'node-api',
    timestamp: new Date().toISOString(),
  });
};