import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { AllExceptionsFilter } from './filter/anyException.filter';
import { HttpExceptionFilter } from './filter/httpException.filter';
import { HttpReqTransformInterceptor } from './interceptor/httpReq.interceptor';
import { ValidationPipe as OriginValidationPipe } from '@nestjs/common';
import { ValidationPipe } from './pip/validation.pipe';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  // 全局使用 pip
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );

  app.useGlobalPipes(
    new OriginValidationPipe({
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
