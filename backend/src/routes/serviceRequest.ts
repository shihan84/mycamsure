import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

// Validation schema using Zod
const createServiceRequestSchema = z.object({
  type: z.enum(['INSTALLATION', 'REPAIR', 'MAINTENANCE', 'AMC_VISIT']),
  scheduledAt: z.string().datetime(),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  description: z.string().max(500).optional(),
  photos: z.array(z.string().url()).optional(),
  estimatedDuration: z.number().int().min(15).max(480).optional(), // 15min to 8hrs
  amcContractId: z.string().uuid().optional(),
});

// POST /api/service-request
router.post('/', async (req: Request, res: Response) => {
  try {
    // Get user from auth middleware (assumed to be attached to req.user)
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate request body
    const validationResult = createServiceRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const data = validationResult.data;

    // Calculate pricing based on service type
    let totalAmount = 0;
    switch (data.type) {
      case 'INSTALLATION':
        totalAmount = 1500; // Base price for installation
        break;
      case 'REPAIR':
        totalAmount = 500; // Base price for repair
        break;
      case 'MAINTENANCE':
        totalAmount = 300; // Base price for maintenance
        break;
      case 'AMC_VISIT':
        totalAmount = 0; // Covered under AMC
        break;
    }

    // Find user's franchise (if assigned)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { franchise: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine franchise (use user's franchise or assign based on location)
    let franchiseId = user.franchise?.id;
    if (!franchiseId && data.latitude && data.longitude) {
      // Find nearest franchise based on location (simplified logic)
      const nearestFranchise = await prisma.franchise.findFirst({
        where: {
          status: 'APPROVED',
        },
      });
      franchiseId = nearestFranchise?.id;
    }

    // Calculate commission amounts
    const commissionRate = franchiseId ? 15 : 20; // 15% if franchise, 20% if direct
    const commissionAmount = (totalAmount * commissionRate) / 100;
    const technicianAmount = totalAmount - commissionAmount;

    // Create service request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        customerId: userId,
        franchiseId: franchiseId,
        type: data.type,
        scheduledAt: new Date(data.scheduledAt),
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        photos: data.photos,
        totalAmount,
        commissionAmount,
        technicianAmount,
        estimatedDuration: data.estimatedDuration,
        amcContractId: data.amcContractId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        franchise: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Notify nearby technicians (console log for now, will use Socket.io later)
    console.log('🔔 Notifying nearby technicians about new service request:', {
      serviceRequestId: serviceRequest.id,
      type: serviceRequest.type,
      location: {
        latitude: serviceRequest.latitude,
        longitude: serviceRequest.longitude,
      },
      scheduledAt: serviceRequest.scheduledAt,
    });

    // In production, this would:
    // 1. Use Socket.io to emit to technicians in the area
    // 2. Send push notifications via FCM
    // 3. Calculate nearby technicians using geospatial query

    return res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      data: {
        id: serviceRequest.id,
        type: serviceRequest.type,
        status: serviceRequest.status,
        scheduledAt: serviceRequest.scheduledAt,
        totalAmount: serviceRequest.totalAmount,
        address: serviceRequest.address,
      },
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create service request',
    });
  }
});

export default router;
