import { calculateCombinedStats } from '../services/matrix.service';

describe('Matrix Service - calculateCombinedStats', () => {
  it('calcula correctamente el máximo, mínimo, suma y promedio consolidado', () => {
    const q = [
      [1, 2],
      [3, 4],
    ];
    const r = [
      [5, 6],
      [7, 8],
    ];

    const result = calculateCombinedStats(q, r);

    expect(result.max).toBe(8);
    expect(result.min).toBe(1);
    expect(result.totalSum).toBe(36);
    expect(result.average).toBe(36 / 8); // 4.5
  });

  it('identifica correctamente cuando una matriz es diagonal (identidad)', () => {
    const q = [
      [2, 0],
      [0, 5],
    ]; // Diagonal
    const r = [
      [1, 2],
      [3, 4],
    ]; // No diagonal

    const result = calculateCombinedStats(q, r);

    expect(result.isAnyDiagonal).toBe(true);
    expect(result.details?.qIsDiagonal).toBe(true);
    expect(result.details?.rIsDiagonal).toBe(false);
  });

  it('tolera residuos de punto flotante menores a 1e-9 fuera de la diagonal', () => {
    const q = [
      [1, 1e-15],
      [0, 1],
    ]; // Residuo típico de factorización QR numérica
    const r = [
      [1, 2],
      [3, 4],
    ];

    const result = calculateCombinedStats(q, r);

    expect(result.isAnyDiagonal).toBe(true);
    expect(result.details?.qIsDiagonal).toBe(true);
  });

  it('no marca como diagonal una matriz rectangular (no cuadrada)', () => {
    const q = [
      [1, 0, 0],
      [0, 1, 0],
    ]; // 2x3, no es cuadrada
    const r = [
      [1, 2],
      [3, 4],
    ];

    const result = calculateCombinedStats(q, r);

    expect(result.details?.qIsDiagonal).toBe(false);
  });

  it('maneja matrices vacías sin lanzar excepciones', () => {
    const q: number[][] = [];
    const r: number[][] = [];

    const result = calculateCombinedStats(q, r);

    expect(result.max).toBe(0);
    expect(result.min).toBe(0);
    expect(result.totalSum).toBe(0);
    expect(result.average).toBe(0);
    expect(result.isAnyDiagonal).toBe(false);
  });
});