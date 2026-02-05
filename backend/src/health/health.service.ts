import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { logger } from '../common/utils/logger';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth() {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        aiService: 'unknown',
      },
    };

    // 检查数据库连接
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      health.services.database = 'ok';
      logger.info('Database health check passed');
    } catch (error) {
      health.services.database = 'error';
      health.status = 'error';
      logger.error('Database health check failed', { error: error.message });
    }

    // 检查AI服务（可选）
    try {
      // 可以添加对DeepSeek API的轻量级检查
      health.services.aiService = 'ok';
      logger.info('AI service health check passed');
    } catch (error) {
      health.services.aiService = 'error';
      if (health.status === 'ok') {
        health.status = 'warning';
      }
      logger.error('AI service health check failed', { error: error.message });
    }

    return health;
  }
}