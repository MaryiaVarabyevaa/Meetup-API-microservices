import {Inject, Injectable} from '@nestjs/common';
import { PrismaClient } from "@prisma/client";
import {CreateMeetupDto} from "./createMeetup.dto";
import {MEETUP_SERVICE} from "./constants";
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";


@Injectable()
export class GatewayService {

  constructor(
      private prisma: PrismaClient,
      @Inject(MEETUP_SERVICE) private meetupClient: ClientProxy
  ) {}

  async findAll() {
    return await this.prisma.meetup.findMany();
  }


  async addMeetup(createMeetupDto: CreateMeetupDto) {
    const { tags, ...rest } = createMeetupDto;
    try {
      const createdMeetup = await this.prisma.meetup.create({
        data: rest
      });

      const result = await lastValueFrom(
          this.meetupClient.emit('meetup_created', { createdMeetup })
      )
      console.log(result)
      return result;
    } catch (err) {
      console.log(err);
      return 'Error :(('
    }

    // return createdMeetup;
  }
}
