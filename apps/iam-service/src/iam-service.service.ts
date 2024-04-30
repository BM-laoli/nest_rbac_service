import { Injectable } from '@nestjs/common';

@Injectable()
export class IamServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
