import {ConflictException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {CreateMeetupDto, IdParamDto, TypeParamDto} from './dtos';
import {UpdateMeetupDto} from './dtos/update-meetup.dto';
import {ErrorMessage, Pattern} from './constants';
import {GeocodingService} from '../geocoding/geocoding.service';
import {Services} from '../../common/constants';
import {Meetup} from "@prisma/client/meetup";

@Injectable()
export class MeetupService {
  constructor(
    @Inject(Services.MEETUP) private meetupClient: ClientProxy,
    @Inject(Services.INDEXER) private indexerClient: ClientProxy,
    private readonly geocodingService: GeocodingService,
  ) {}

  async findAllMeetups(params): Promise<Meetup[]> {
    let options = params;
    if (options.location) {
      const { latitude: lat, longitude: lon } =
        await this.geocodingService.getCoordinates(options.location);
      options = { ...options, location: { lat, lon } };
    }

    return this.sendMessageToIndexerClient(Pattern.FIND_ALL_MEETUPS, options);
  }

  async addMeetup(createMeetupDto: CreateMeetupDto): Promise<Meetup> {
    const { country, city, street, houseNumber } = createMeetupDto;
    const { latitude, longitude } = await this.geocodingService.getCoordinates(
      country,
      city,
      street,
      houseNumber,
    );

    const res = await this.sendMessageToMeetupClient(Pattern.CREATE_MEETUP, {
      ...createMeetupDto,
      latitude,
      longitude,
    });

    if (!res) {
      throw new ConflictException(ErrorMessage.CONFLICT);
    }

    return res;
  }

  async updateMeetup(updateMeetupDto: UpdateMeetupDto): Promise<Meetup> {
    const { country, city, street, houseNumber } = updateMeetupDto;
    const { latitude, longitude } = await this.geocodingService.getCoordinates(
      country,
      city,
      street,
      houseNumber,
    );

    const res = await this.sendMessageToMeetupClient(Pattern.UPDATE_MEETUP, {
      ...updateMeetupDto,
      latitude,
      longitude,
    });

    if (!res) {
      throw new NotFoundException(ErrorMessage.NOT_FOUNT);
    }

    return res;
  }

  async deleteMeetup(id: IdParamDto): Promise<Meetup> {
    const res = await this.sendMessageToMeetupClient(Pattern.DELETE_MEETUP, { id });

    if (!res) {
      throw new NotFoundException(ErrorMessage.NOT_FOUNT);
    }

    return res;
  }

  async findMeetupById(id: IdParamDto): Promise<Meetup> {
    return this.sendMessageToIndexerClient(Pattern.FIND_BY_ID_MEETUP, { id });
  }

  async generateReport(type: TypeParamDto): Promise<string> {
    return this.sendMessageToMeetupClient(Pattern.GENERATE_REPORT, { type });
  }

  private async sendMessageToMeetupClient(msg: string, data: any) {
    const pattern = { cmd: msg };
    return await this.meetupClient.send(pattern, { data }).toPromise();
  }

  private async sendMessageToIndexerClient(msg: string, data: any) {
    const pattern = { cmd: msg };
    return await this.indexerClient.send(pattern, { data }).toPromise();
  }
}
