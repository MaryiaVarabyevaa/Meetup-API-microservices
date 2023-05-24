import { Inject, Injectable } from '@nestjs/common';
import { MEETUP_SERVICE } from '../../constants';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMeetupDto } from './dtos';
import { UpdateMeetupDto } from './dtos/update-meetup.dto';
import { INDEXER_MEETUP } from '../../constants/services';
import { Pattern } from './constants';
import {GeocodingService} from "../geocoding/geocoding.service";

@Injectable()
export class MeetupService {
  constructor(
    @Inject(MEETUP_SERVICE) private meetupClient: ClientProxy,
    @Inject(INDEXER_MEETUP) private indexerClient: ClientProxy,
    private readonly geocodingService: GeocodingService
  ) {}

  async findAllMeetups(params) {

    let options = params;
    if (options.location) {
      const { latitude: lat, longitude: lon } = await this.geocodingService.getCoordinates(options.location);
      options = { ...options, location: { lat, lon } }
    }

    return this.sendMessageToIndexerClient(Pattern.FIND_ALL_MEETUPS, options);
  }

  async addMeetup(createMeetupDto: CreateMeetupDto) {

    const { country, city, street, houseNumber } = createMeetupDto;
    const { latitude, longitude } = await this.geocodingService.getCoordinates(
        country,
        city,
        street,
        houseNumber,
    );
    return this.sendMessageToMeetupClient(
      Pattern.CREATE_MEETUP,
        {
          ...createMeetupDto,
          latitude,
          longitude
        },
    );
  }

  async updateMeetup(updateMeetupDto: UpdateMeetupDto) {

    const { country, city, street, houseNumber } = updateMeetupDto;
    const { latitude, longitude } = await this.geocodingService.getCoordinates(
        country,
        city,
        street,
        houseNumber,
    );

    return this.sendMessageToMeetupClient(
      Pattern.UPDATE_MEETUP,
        {
          ...updateMeetupDto,
          latitude,
          longitude
        }
    );
  }

  async deleteMeetup(id: number) {
    return this.sendMessageToMeetupClient(Pattern.DELETE_MEETUP, { id });
  }

  async findMeetupById(id: number) {
    return this.sendMessageToIndexerClient(Pattern.FIND_BY_ID_MEETUP, { id });
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
