import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateUser, requireRole } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Validation schemas
const updateJobStatusSchema = z.object({
  status: z.enum(['ASSIGNED', 'TECHNICIAN_EN_ROUTE', 'TECHNICIAN_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  photos: z.array(z.string().url()).optional(),
  notes: z.string().max(500).optional(),
});

// GET /api/jobs/nearby - Technician sees nearby jobs
router.get('/nearby', authenticateUser, requireRole(['TECHNICIAN']), async (req: AuthRequest, res: Response) => {
  try {
    const technicianId = req.user!.id;
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusKm = parseFloat(radius as string);

    // Get technician's info
    const technician = await prisma.technician.findUnique({
      where: { userId: technicianId },
      include: { franchise: true },
    });

    if (!technician) {
      return res.status(404).json({ error: 'Technician profile not found' });
    }

    // Find nearby pending service requests
    // Using simple distance calculation (Haversine formula would be better)
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        status: 'PENDING',
        technicianId: null,
        latitude: { not: null },
        longitude: { not: null },
        // Filter by franchise if technician belongs to one
        ...(technician.franchiseId ? { franchiseId: technician.franchiseId } : {}),
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
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    // Filter by distance (simplified - in production use PostGIS)
    const nearbyJobs = serviceRequests.filter((job) => {
      if (!job.latitude || !job.longitude) return false;
      
      const distance = calculateDistance(
        latitude,
        longitude,
        job.latitude,
        job.longitude
      );
      
      return distance <= radiusKm;
    });

    return res.json({
      success: true,
      data: nearbyJobs,
      count: nearbyJobs.length,
    });
  } catch (error) {
    console.error('Error fetching nearby jobs:', error);
    return res.status(500).json({ error: 'Failed to fetch nearby jobs' });
  }
});

// PATCH /api/jobs/:id/status - Technician updates job status
router.patch('/:id/status', authenticateUser, requireRole(['TECHNICIAN']), async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.id;
    const technicianId = req.user!.id;

    const validationResult = updateJobStatusSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const { status, photos, notes } = validationResult.data;

    // Get the service request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: jobId },
    });

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check if technician is assigned to this job
    if (serviceRequest.technicianId !== technicianId) {
      // Allow assignment if status is PENDING
      if (serviceRequest.status === 'PENDING' && status === 'ASSIGNED') {
        // Assign the job
        const updated = await prisma.serviceRequest.update({
          where: { id: jobId },
          data: {
            technicianId: technicianId,
            status: 'ASSIGNED',
          },
        });
        
        return res.json({
          success: true,
          message: 'Job assigned successfully',
          data: updated,
        });
      }
      
      return res.status(403).json({ error: 'You are not assigned to this job' });
    }

    // Update job status
    const updateData: any = { status };
    
    if (photos) {
      updateData.photos = photos;
    }

    const updated = await prisma.serviceRequest.update({
      where: { id: jobId },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    // If job is completed, create earnings record for technician
    if (status === 'COMPLETED' && serviceRequest.technicianAmount) {
      await prisma.earnings.create({
        data: {
          technicianId: technicianId,
          amount: serviceRequest.technicianAmount,
          jobId: jobId,
          type: 'service',
          status: 'pending',
        },
      });
    }

    return res.json({
      success: true,
      message: 'Job status updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    return res.status(500).json({ error: 'Failed to update job status' });
  }
});

// GET /api/jobs/my - Technician sees their assigned jobs
router.get('/my', authenticateUser, requireRole(['TECHNICIAN']), async (req: AuthRequest, res: Response) => {
  try {
    const technicianId = req.user!.id;
    const { status } = req.query;

    const where: any = {
      technicianId: technicianId,
    };

    if (status) {
      where.status = status;
    }

    const jobs = await prisma.serviceRequest.findMany({
      where,
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
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Error fetching my jobs:', error);
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export default router;
