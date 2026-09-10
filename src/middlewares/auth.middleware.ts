import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_m2m_token_key_123';

export const authenticateM2M = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      error: 'Acceso no autorizado: se requiere cabecera Authorization: Bearer <token>',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Asignamos el payload decodificado a la request
    (req as any).user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({
      status: 'error',
      error: 'Token inválido o expirado',
    });
  }
};