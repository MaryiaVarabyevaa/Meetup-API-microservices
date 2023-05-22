import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MEETUP_SERVICE } from '../../constants';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMeetupDto } from './dtos';
import { UpdateMeetupDto } from './dtos/update-meetup.dto';

@Injectable()
export class MeetupService {
  constructor(@Inject(MEETUP_SERVICE) private meetupClient: ClientProxy) {}

  async findAllMeetups() {
    const pattern = { cmd: 'findAllMeetup' };
    return this.meetupClient.send(pattern, {}).toPromise();
  }

  async addMeetup(createMeetupDto: CreateMeetupDto) {
    const pattern = { cmd: 'createMeetup' };
    return this.meetupClient.send(pattern, { data: createMeetupDto });
  }

  async updateMeetup(updateMeetupDtp: UpdateMeetupDto) {
    const pattern = { cmd: 'updateMeetup' };
    return this.meetupClient.send(pattern, { data: updateMeetupDtp });
  }

  async deleteMeetup(id: number) {
    const pattern = { cmd: 'deleteMeetup' };
    return this.meetupClient.send(pattern, { data: { id } });
  }

  async findMeetupById(id: number) {
    const pattern = { cmd: 'findByIdMeetup' };
    return this.meetupClient.send(pattern, { data: { id } });
  }

  // async generateReport(type: string) {
  //   const pattern = { cmd: 'generateReport' };
  //   return this.meetupClient.send(pattern, { data: { type } });
  // }
}
