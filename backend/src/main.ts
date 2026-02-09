import 'reflect-metadata'; // Must be at the very top
import 'dotenv/config'; // Don't load globally to avoid production crash if file missing

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { logger } from './common/utils/logger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// 缓存 Server 实例，避免 Serverless 冷启动时重复创建
let cachedServer: any;

async function createNestServer(expressInstance: express.Express) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  logger.info('App created with Express Adapter');

  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle('Email AI Backend API')
    .setDescription('AI驱动的邮件生成和分析服务API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  logger.info('Swagger documentation initialized at /api-docs');

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // 请求日志拦截器
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // 请求体验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS配置
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  return app;
}

import { join } from 'path';

// --- Vercel Serverless Handler ---
export default async function handler(req: any, res: any) {
  try {
    if (!cachedServer) {
      // DEBUG: Log Environment Variables (Safe)
      console.log('Environment Check:');
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);
      console.log('JWT_SECRET defined:', !!process.env.JWT_SECRET);
      
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is missing!');
      }

      // DEBUG: Log file system state to debug Vercel bundling issues
      try {
        console.log('Current working directory:', process.cwd());
        const fs = require('fs');
        console.log('Files in cwd:', fs.readdirSync(process.cwd()));
        
        // Try to locate prisma schema in common locations
        const potentialPaths = [
          join(__dirname, '../prisma/schema.prisma'),
          join(__dirname, '../../prisma/schema.prisma'),
          join(process.cwd(), 'prisma/schema.prisma'),
          join(process.cwd(), 'backend/prisma/schema.prisma'),
        ];
        
        console.log('Checking for schema.prisma in:');
        potentialPaths.forEach(p => {
            const exists = fs.existsSync(p);
            console.log(`- ${p}: ${exists ? 'FOUND' : 'NOT FOUND'}`);
            if (exists) {
                // Read it to force bundling (and verify access)
                fs.readFileSync(p);
                // Also set an env var if needed by Prisma (sometimes helps)
                // process.env.PRISMA_SCHEMA_PATH = p; 
            }
        });
        
      } catch (e) {
        console.error('Error logging file system:', e);
      }

      const server = express();
      const app = await createNestServer(server);
      await app.init();
      cachedServer = server;
    }
    // 将请求交给 Express 实例处理
    return cachedServer(req, res);
  } catch (error: any) {
    console.error('Bootstrap Error:', error);
    // 返回 JSON 格式的错误信息，方便在前端或浏览器中查看
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: 'Server Bootstrap Failed',
      error: error.message || 'Unknown error',
      stack: error.stack,
    }));
  }
}

// --- 本地开发启动逻辑 ---
// 如果不是运行在 Vercel 环境中，则直接启动监听
if (!process.env.VERCEL) {
  (async () => {
    try {
      const server = express();
      const app = await createNestServer(server);
      const port = process.env.PORT ?? 4000;
      
      logger.info(`Listening on port ${port}...`);
      await app.listen(port);
      logger.info(`Application is running on: ${await app.getUrl()}`);
    } catch (error) {
      logger.error('Error starting app:', error);
    }
  })();
}
