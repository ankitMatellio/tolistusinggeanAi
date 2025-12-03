import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/errorHandler';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const xUserId = req.headers['x-user-id'] as string;

    // Fallback to X-User-Id header if JWT is not configured
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
      if (xUserId) {
        req.userId = xUserId;
        logger.warn('Using X-User-Id header for authentication (JWT not configured)');
        return next();
      }
      throw new AppError('Authentication required. Provide X-User-Id header or configure JWT_SECRET.', 401);
    }

    // JWT Authentication
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization header missing or invalid', 401);
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      email: decoded.email || '',
    };

    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError('Invalid or expired token', 401));
  }
};

