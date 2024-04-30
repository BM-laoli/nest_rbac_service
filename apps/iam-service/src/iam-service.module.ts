import { Module } from '@nestjs/common';
import { IamServiceController } from './iam-service.controller';
import { IamServiceService } from './iam-service.service';
import { CoreModule } from '@app/core';

@Module({
  imports: [CoreModule],
  controllers: [IamServiceController],
  providers: [IamServiceService],
})
export class IamServiceModule {}
