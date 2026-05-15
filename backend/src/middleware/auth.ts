import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser as firebaseAuth, AuthRequest } from './firebaseAuth';

const prisma = new PrismaClient();

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  return firebaseAuth(req, res, next);
};

export const requireRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { role: true },
      });

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
        });
      }

      next();
    } catch (error: any) {
      console.error('Role check error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to verify role',
      });
    }
  };
};
