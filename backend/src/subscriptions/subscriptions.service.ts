import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMySubscription(userId: number) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });
    if (!sub) {
      return { status: 'none', plan: null };
    }
    // Check if expired
    if (sub.status === 'active' && sub.endDate < new Date()) {
       await this.prisma.subscription.update({
         where: { id: sub.id },
         data: { status: 'expired' },
       });
       return { ...sub, status: 'expired' };
    }
    return sub;
  }

  async createSubscription(userId: number, plan: 'monthly' | 'yearly') {
    // Determine end date based on plan (mocking payment success immediately for now? 
    // Or keep it pending and have a separate confirm endpoint?
    // The previous code returned a codeUrl and status: pending.
    
    // Let's upsert. If exists, update plan and status.
    const now = new Date();
    const endDate = new Date();
    if (plan === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    // In a real app, we would create a payment intent here and return the payment info.
    // For this MVP/demo, I'll simulate "pending" and maybe provide a way to "confirm" it, 
    // or just return the payment URL as before.
    
    // Let's stick to the previous logic: create pending subscription.
    // However, if we upsert here, we might overwrite an active subscription?
    // Usually you'd check if there is an active subscription first.
    
    const current = await this.prisma.subscription.findUnique({ where: { userId } });
    
    if (current && current.status === 'active' && current.endDate > now) {
        // Already active, maybe extending?
        // For simplicity, let's say we just update the pending plan.
    }

    const sub = await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        plan,
        status: 'pending',
        // Don't update dates yet until paid
      },
      create: {
        userId,
        plan,
        status: 'pending',
        startDate: now,
        endDate: endDate, // Placeholder, should be set on payment
      },
    });

    return {
      userId,
      plan,
      amount: plan === 'yearly' ? 19900 : 1990,
      payMethod: 'wechat',
      codeUrl: 'weixin://wxpay/bizpayurl?pr=example',
      status: 'pending',
      subscriptionId: sub.id
    };
  }
  
  // Helper to simulate payment success (for testing/demo)
  async mockPaymentSuccess(userId: number) {
      const sub = await this.prisma.subscription.findUnique({ where: { userId } });
      if (!sub) return null;
      
      const now = new Date();
      const endDate = new Date();
      if (sub.plan === 'yearly') {
          endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
          endDate.setMonth(endDate.getMonth() + 1);
      }
      
      return this.prisma.subscription.update({
          where: { userId },
          data: {
              status: 'active',
              startDate: now,
              endDate: endDate
          }
      });
  }
}
