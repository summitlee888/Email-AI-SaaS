import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionsService } from './subscriptions.service';

interface RequestWithUser extends Request {
  user?: { userId: number; email: string };
}

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMySubscription(@Req() req: RequestWithUser) {
    const userId = req.user?.userId;
    if (!userId) {
      return { status: 'none', plan: null };
    }
    return this.subscriptionsService.getMySubscription(userId);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createSubscription(
    @Req() req: RequestWithUser,
    @Body() body: { plan: string },
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return { message: '未登录', status: 'none' };
    }

    const plan = body.plan === 'yearly' ? 'yearly' : 'monthly';
    return this.subscriptionsService.createSubscription(userId, plan);
  }

  // Mock endpoint to simulate payment success
  @Post('mock-success')
  @UseGuards(AuthGuard('jwt'))
  async mockPaymentSuccess(@Req() req: RequestWithUser) {
      const userId = req.user?.userId;
      if (!userId) return { success: false };
      await this.subscriptionsService.mockPaymentSuccess(userId);
      return { success: true };
  }
}
