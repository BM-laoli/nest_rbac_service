import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { AllExceptionsFilter } from './core/filter/anyException.filter';
import { HttpExceptionFilter } from './core/filter/httpException.filter';
import { ValidationPipe as OriginValidationPipe } from '@nestjs/common';
import { ValidationPipe } from './core/pip/validation.pipe';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import rateLimit from 'express-rate-limit';
import { HttpReqTransformInterceptor } from './core/interceptor/httpReq.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 安全 防御 (限流)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // Log
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 错误异常捕获 和 过滤处理
  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(WINSTON_MODULE_NEST_PROVIDER)),
  );
  app.useGlobalFilters(
    new HttpExceptionFilter(app.get(WINSTON_MODULE_NEST_PROVIDER)),
  );

  // 全局统一返回体
  app.useGlobalInterceptors(new HttpReqTransformInterceptor());
  // validation
  app.useGlobalPipes(
    new OriginValidationPipe({
      transform: true,
    }),
  );

  // Swager
  const config = new DocumentBuilder()
    .setTitle('RBAC Service Nestjs API ')
    .setDescription('This is RBAS Service Nestjs API description')
    .setVersion('1.0')
    .addTag('最佳实践')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(3000);
}
bootstrap();
