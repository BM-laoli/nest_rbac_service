import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourceServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
