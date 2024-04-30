import { Test, TestingModule } from '@nestjs/testing';
import { ResourceServiceController } from './resource-service.controller';
import { ResourceServiceService } from './resource-service.service';

describe('ResourceServiceController', () => {
  let resourceServiceController: ResourceServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ResourceServiceController],
      providers: [ResourceServiceService],
    }).compile();

    resourceServiceController = app.get<ResourceServiceController>(ResourceServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(resourceServiceController.getHello()).toBe('Hello World!');
    });
  });
});
