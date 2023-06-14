import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { AllExceptionsFilter } from './filter/anyException.filter';
import { HttpExceptionFilter } from './filter/httpException.filter';
import { HttpReqTransformInterceptor } from './interceptor/httpReq.interceptor';
import { ValidationPipe as OriginValidationPipe } from '@nestjs/common';
import { ValidationPipe } from './pip/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 错误异常捕获 和 过滤处理
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

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
