import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateUser, requireRole } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// GET /api/franchise/earnings - Franchisee dashboard earnings
router.get('/earnings', authenticateUser, requireRole(['FRANCHISEE']), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get franchise
    const franchise = await prisma.franchise.findUnique({
      where: { ownerId: userId },
    });

    if (!franchise) {
      return res.status(404).json({ error: 'Franchise not found' });
    }

    // Get all service requests for this franchise
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: { franchiseId: franchise.id },
      include: {
        paymentTransaction: true,
      },
    });

    // Calculate earnings
    const totalRevenue = serviceRequests.reduce((sum, sr) => sum + sr.totalAmount, 0);
    const totalCommission = serviceRequests.reduce((sum, sr) => sum + (sr.commissionAmount || 0), 0);
    const completedJobs = serviceRequests.filter(sr => sr.status === 'COMPLETED').length;
    const pendingJobs = serviceRequests.filter(sr => sr.status === 'PENDING').length;

    // Get this month's earnings
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonthRequests = serviceRequests.filter(sr => sr.createdAt >= startOfMonth);
    const thisMonthRevenue = thisMonthRequests.reduce((sum, sr) => sum + sr.totalAmount, 0);
    const thisMonthCommission = thisMonthRequests.reduce((sum, sr) => sum + (sr.commissionAmount || 0), 0);

    return res.json({
      success: true,
      data: {
        franchise: {
          id: franchise.id,
          name: franchise.name,
          commissionRate: franchise.commissionRate,
        },
        earnings: {
          totalRevenue,
          totalCommission,
          thisMonthRevenue,
          thisMonthCommission,
        },
        jobs: {
          total: serviceRequests.length,
          completed: completedJobs,
          pending: pendingJobs,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching franchise earnings:', error);
    return res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

// GET /api/franchise/technicians - Manage technicians
router.get('/technicians', authenticateUser, requireRole(['FRANCHISEE']), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const franchise = await prisma.franchise.findUnique({
      where: { ownerId: userId },
    });

    if (!franchise) {
      return res.status(404).json({ error: 'Franchise not found' });
    }

    const technicians = await prisma.technician.findMany({
      where: { franchiseId: franchise.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      data: technicians,
    });
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return res.status(500).json({ error: 'Failed to fetch technicians' });
  }
});

// POST /api/franchise/technicians/:id/approve - Approve technician
router.post('/technicians/:id/approve', authenticateUser, requireRole(['FRANCHISEE']), async (req: AuthRequest, res: Response) => {
  try {
    const technicianId = req.params.id;
    const userId = req.user!.id;
    
    const franchise = await prisma.franchise.findUnique({
      where: { ownerId: userId },
    });

    if (!franchise) {
      return res.status(404).json({ error: 'Franchise not found' });
    }

    const technician = await prisma.technician.findUnique({
      where: { id: technicianId },
    });

    if (!technician || technician.franchiseId !== franchise.id) {
      return res.status(404).json({ error: 'Technician not found or not under your franchise' });
    }

    const updated = await prisma.technician.update({
      where: { id: technicianId },
      data: { isVerified: 'VERIFIED' },
    });

    return res.json({
      success: true,
      message: 'Technician approved successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error approving technician:', error);
    return res.status(500).json({ error: 'Failed to approve technician' });
  }
});

// POST /api/franchise/technicians/:id/suspend - Suspend technician
router.post('/technicians/:id/suspend', authenticateUser, requireRole(['FRANCHISEE']), async (req: AuthRequest, res: Response) => {
  try {
    const technicianId = req.params.id;
    const userId = req.user!.id;
    
    const franchise = await prisma.franchise.findUnique({
      where: { ownerId: userId },
    });

    if (!franchise) {
      return res.status(404).json({ error: 'Franchise not found' });
    }

    const technician = await prisma.technician.findUnique({
      where: { id: technicianId },
    });

    if (!technician || technician.franchiseId !== franchise.id) {
      return res.status(404).json({ error: 'Technician not found or not under your franchise' });
    }

    const updated = await prisma.technician.update({
      where: { id: technicianId },
      data: { available: false },
    });

    return res.json({
      success: true,
      message: 'Technician suspended successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error suspending technician:', error);
    return res.status(500).json({ error: 'Failed to suspend technician' });
  }
});

// GET /api/franchise/complaints - View customer complaints
router.get('/complaints', authenticateUser, requireRole(['FRANCHISEE']), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const franchise = await prisma.franchise.findUnique({
      where: { ownerId: userId },
    });

    if (!franchise) {
      return res.status(404).json({ error: 'Franchise not found' });
    }

    // Get reviews with low ratings (complaints)
    const complaints = await prisma.review.findMany({
      where: {
        rating: { lt: 3 },
        serviceRequest: {
          franchiseId: franchise.id,
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
        serviceRequest: {
          select: {
            id: true,
            type: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

export default router;
