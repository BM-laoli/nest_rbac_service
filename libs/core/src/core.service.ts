import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
  private baseInfo;

  constructor() {
    this.baseInfo = {
      name: 'CoreService',
    };
  }

  coreInfo() {
    return this.baseInfo;
  }
}
