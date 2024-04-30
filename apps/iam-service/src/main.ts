import { NestFactory } from '@nestjs/core';
import { IamServiceModule } from './iam-service.module';

async function bootstrap() {
  const app = await NestFactory.create(IamServiceModule);
  app.setGlobalPrefix('/api/iam');
  await app.listen(3000);
}
bootstrap();
