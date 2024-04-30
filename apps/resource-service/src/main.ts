import { NestFactory } from '@nestjs/core';
import { ResourceServiceModule } from './resource-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ResourceServiceModule);
  app.setGlobalPrefix('/api/resource');
  await app.listen(3000);
}
bootstrap();
