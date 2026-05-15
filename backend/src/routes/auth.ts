import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';
import { AuthRequest } from '../middleware/firebaseAuth';

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/signup - Create user account after Firebase auth
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { firebaseUid, name, email, phone, role } = req.body;

    if (!firebaseUid || !name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid },
          { phone },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        firebaseUid,
        name,
        email: email || null,
        phone,
        role: role || 'CUSTOMER',
      },
    });

    res.json({
      success: true,
      data: { id: user.id, role: user.role },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create user',
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get user',
    });
  }
});

export default router;
