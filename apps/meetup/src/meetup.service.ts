import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class MeetupService {

  private readonly logger = new Logger(MeetupService.name);

  getHello(): string {
    return 'Hello World!';
  }

  createMeetup(data: any) {
    this.logger.log('Meetup... ', data);
    return 'DICK'
  }
}
