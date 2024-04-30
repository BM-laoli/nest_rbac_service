import { Test, TestingModule } from '@nestjs/testing';
import { IamServiceController } from './iam-service.controller';
import { IamServiceService } from './iam-service.service';

describe('IamServiceController', () => {
  let iamServiceController: IamServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IamServiceController],
      providers: [IamServiceService],
    }).compile();

    iamServiceController = app.get<IamServiceController>(IamServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(iamServiceController.getHello()).toBe('Hello World!');
    });
  });
});
