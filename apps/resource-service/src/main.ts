import { NestFactory } from '@nestjs/core';
import { ResourceServiceModule } from './resource-service.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ResourceServiceModule);
  app.setGlobalPrefix('/api/resource');
  const config = app.get(ConfigService);

  await app.listen(config.get('PROT'));
}
bootstrap();
