import { NestFactory } from '@nestjs/core';
import { ResourceServiceModule } from './resource-service.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from '@app/core/filter/anyException.filter';
import { HttpExceptionFilter } from '@app/core/filter/httpException.filter';
import { HttpReqTransformInterceptor } from '@app/core/interceptor/httpReq.interceptor';
import { ValidationPipe as OriginValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    ResourceServiceModule,
  );
  app.setGlobalPrefix('/api/resource');
  const configService = app.get(ConfigService);

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
  await app.listen(configService.get('PROT'));
}
bootstrap();
