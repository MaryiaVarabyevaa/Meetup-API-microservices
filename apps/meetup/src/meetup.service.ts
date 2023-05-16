import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetupService {
  getHello(): string {
    return 'Hello World!';
  }
}
