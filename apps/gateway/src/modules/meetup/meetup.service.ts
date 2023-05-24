import { Inject, Injectable } from '@nestjs/common';
import { MEETUP_SERVICE } from '../../constants';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMeetupDto } from './dtos';
import { UpdateMeetupDto } from './dtos/update-meetup.dto';
import { INDEXER_MEETUP } from '../../constants/services';
import { Pattern } from './constants';

@Injectable()
export class MeetupService {
  constructor(
    @Inject(MEETUP_SERVICE) private meetupClient: ClientProxy,
    @Inject(INDEXER_MEETUP) private indexerClient: ClientProxy,
  ) {}

  async findAllMeetups() {
    return this.sendMessageToIndexerClient(Pattern.FIND_ALL_MEETUPS, {});
  }

  async addMeetup(createMeetupDto: CreateMeetupDto) {
    return this.sendMessageToMeetupClient(Pattern.CREATE_MEETUP, createMeetupDto);
  }

  async updateMeetup(updateMeetupDto: UpdateMeetupDto) {
    return this.sendMessageToMeetupClient(Pattern.UPDATE_MEETUP, updateMeetupDto);
  }

  async deleteMeetup(id: number) {
    return this.sendMessageToMeetupClient(Pattern.DELETE_MEETUP,  { id });
  }

  async findMeetupById(id: number) {
    return this.sendMessageToIndexerClient(Pattern.FIND_BY_ID_MEETUP,  { id });
  }

  private async sendMessageToMeetupClient(msg: string, data: any) {
    const pattern = { cmd: msg };
    return await this.meetupClient.send(pattern, { data }).toPromise();
  }

  private async sendMessageToIndexerClient(msg: string, data: any) {
    const pattern = { cmd: msg };
    return await this.indexerClient.send(pattern, { data }).toPromise();
  }

  // async generateReport(type: string) {
  //   const pattern = { cmd: 'generateReport' };
  //   return this.meetupClient.send(pattern, { data: { type } });
  // }
}
