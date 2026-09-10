import { Request, Response } from 'express';
import { computeStatsHandler } from '../controllers/stats.controller';

describe('Stats Controller - computeStatsHandler', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('retorna 400 cuando el cuerpo no contiene matrices q o r válidas', () => {
    const mockRequest = {
      body: { q: 'invalid', r: [] },
    } as unknown as Request;

    computeStatsHandler(mockRequest, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error' })
    );
  });

  it('retorna 200 y las estadísticas calculadas para matrices válidas', () => {
    const mockRequest = {
      body: {
        q: [
          [1, 0],
          [0, 1],
        ],
        r: [
          [2, 0],
          [0, 3],
        ],
      },
    } as unknown as Request;

    computeStatsHandler(mockRequest, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        data: expect.objectContaining({
          max: 3,
          min: 0,
          isAnyDiagonal: true,
        }),
      })
    );
  });
});
