import { Module } from '@nestjs/common';
import { ResourceServiceController } from './resource-service.controller';
import { ResourceServiceService } from './resource-service.service';

@Module({
  imports: [],
  controllers: [ResourceServiceController],
  providers: [ResourceServiceService],
})
export class ResourceServiceModule {}
