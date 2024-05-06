import { NestFactory } from '@nestjs/core';
import { ResourceServiceModule } from './resource-service.module';
// import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(ResourceServiceModule);
  app.setGlobalPrefix('/api/resource');
  // console.log(config('resource-service'));
  await app.listen(3000);
}
bootstrap();
