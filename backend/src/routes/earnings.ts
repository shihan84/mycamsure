import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateUser, requireRole } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// GET /api/earnings - View earnings
router.get('/', authenticateUser, requireRole(['TECHNICIAN']), async (req: AuthRequest, res: Response) => {
  try {
    const technicianId = req.user!.id;
    const { status } = req.query;

    const where: any = {
      technicianId: technicianId,
    };

    if (status) {
      where.status = status;
    }

    const earnings = await prisma.earnings.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate totals
    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
    const pendingEarnings = earnings
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0);
    const withdrawnEarnings = earnings
      .filter(e => e.status === 'withdrawn')
      .reduce((sum, e) => sum + e.amount, 0);

    return res.json({
      success: true,
      data: {
        earnings,
        summary: {
          total: totalEarnings,
          pending: pendingEarnings,
          withdrawn: withdrawnEarnings,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

// POST /api/earnings/withdraw - Request withdrawal
router.post('/withdraw', authenticateUser, requireRole(['TECHNICIAN']), async (req: AuthRequest, res: Response) => {
  try {
    const technicianId = req.user!.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    // Check available balance
    const pendingEarnings = await prisma.earnings.findMany({
      where: {
        technicianId,
        status: 'pending',
      },
    });

    const availableBalance = pendingEarnings.reduce((sum, e) => sum + e.amount, 0);

    if (amount > availableBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Mark earnings as withdrawn (simplified - in production would create transaction)
    let remainingAmount = amount;
    const earningsToUpdate: string[] = [];

    for (const earning of pendingEarnings) {
      if (remainingAmount <= 0) break;
      
      if (earning.amount <= remainingAmount) {
        earningsToUpdate.push(earning.id);
        remainingAmount -= earning.amount;
      }
    }

    await prisma.earnings.updateMany({
      where: {
        id: { in: earningsToUpdate },
      },
      data: {
        status: 'withdrawn',
        withdrawnAt: new Date(),
      },
    });

    return res.json({
      success: true,
      message: 'Withdrawal request processed successfully',
      data: {
        amount,
        remaining: availableBalance - amount,
      },
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

export default router;
