import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// POST /api/payment/create-order - Create Razorpay order
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, serviceRequestId } = req.body;

    if (!amount || !serviceRequestId) {
      return res.status(400).json({
        success: false,
        error: 'Amount and serviceRequestId are required',
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_${serviceRequestId}_${Date.now()}`,
      notes: {
        serviceRequestId,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create pending payment transaction record
    const payment = await prisma.paymentTransaction.create({
      data: {
        serviceRequestId,
        amount,
        status: 'PENDING',
        razorpayOrderId: order.id,
        paymentMethod: 'ONLINE',
      },
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment order',
    });
  }
});

// POST /api/payment/verify - Verify Razorpay payment
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      serviceRequestId,
    } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
      });
    }

    // Get service request to calculate commission splits
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: { franchise: true },
    });

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found',
      });
    }

    // Calculate commission splits
    const totalAmount = serviceRequest.totalAmount;
    const commissionRate = serviceRequest.franchise?.commissionRate || 15;
    const franchiseShare = (totalAmount * commissionRate) / 100;
    const adminShare = totalAmount * 0.05; // 5% admin fee
    const technicianShare = totalAmount - franchiseShare - adminShare;

    // Update payment transaction
    const payment = await prisma.paymentTransaction.update({
      where: { razorpayOrderId },
      data: {
        status: 'COMPLETED',
        razorpayPaymentId,
        razorpaySignature,
        franchiseShare,
        adminShare,
        technicianShare,
      },
    });

    // Update service request payment status
    await prisma.serviceRequest.update({
      where: { id: serviceRequestId },
      data: {
        paymentId: payment.id,
      },
    });

    // Create earnings record for technician
    if (serviceRequest.technicianId) {
      await prisma.earnings.create({
        data: {
          technicianId: serviceRequest.technicianId,
          amount: technicianShare,
          jobId: serviceRequestId,
          type: 'SERVICE',
          status: 'PENDING',
        },
      });
    }

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount,
      },
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify payment',
    });
  }
});

// GET /api/payment/:id - Get payment details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        serviceRequest: {
          include: {
            customer: {
              select: { name: true, phone: true },
            },
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch payment',
    });
  }
});

export default router;
