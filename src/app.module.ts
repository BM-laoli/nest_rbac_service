import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
