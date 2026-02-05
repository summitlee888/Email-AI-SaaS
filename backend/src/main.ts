import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { logger } from './common/utils/logger';

async function bootstrap() {
  logger.info('Starting bootstrap...');
  try {
    const app = await NestFactory.create(AppModule);
    logger.info('App created');

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

    // CORS配置
    app.enableCors({
      origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
      credentials: true,
    });

    const port = process.env.PORT ?? 4000;
    logger.info(`Listening on port ${port}...`);
    await app.listen(port);
    logger.info(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Error starting app:', error);
  }
}
bootstrap();
