import { Inject, Injectable } from '@nestjs/common';
import { MeetupPrismaClient } from '@app/common';
import { CreateMeetup, IdObject, UpdateMeetup } from './types';
import { INDEXER_SERVICE, MEETUP_PRISMA, Pattern } from './constants';
import { TagService } from '../tag/tag.service';
import { TagOnMeetupService } from '../tag/services';
import { Meetup } from '@prisma/client/meetup';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MeetupService {
  constructor(
    @Inject(MEETUP_PRISMA)
    private readonly meetupPrismaClient: MeetupPrismaClient,
    @Inject(INDEXER_SERVICE) private indexerClient: ClientProxy,
    private readonly tagService: TagService,
    private readonly tagOnMeetupService: TagOnMeetupService,
  ) {}

  async addMeetup(meetup: CreateMeetup): Promise<Meetup> {
    const { time, date, country, city, street, houseNumber, tags, ...rest } =
      meetup;

    const isExistedMeetup = await this.meetupPrismaClient.meetup.findFirst({
      where: { country, city, street, houseNumber, date, time },
    });

    if (isExistedMeetup) {
      return null;
    }

    const newMeetup = await this.meetupPrismaClient.meetup.create({
      data: {
        time,
        date,
        country,
        city,
        street,
        houseNumber,
        ...rest,
      },
    });

    const newTags = await this.tagService.addTag(tags);
    await Promise.all(
      newTags.map(async (tag) => {
        await this.tagOnMeetupService.addTagOnMeetup(newMeetup.id, tag.id);
      }),
    );

    const res = { ...newMeetup, tags };
    await this.sendMessage(Pattern.CREATE_MEETUP, { ...res });
    return res;
  }

  async updateMeetup(meetup: UpdateMeetup): Promise<Meetup> {
    const {
      id,
      topic,
      description,
      time,
      date,
      country,
      city,
      street,
      houseNumber,
      tags,
    } = meetup;
    const isExistedMeetup = await this.meetupPrismaClient.meetup.findFirst({
      where: { id },
    });

    if (!isExistedMeetup) {
      return null;
    }

    const updatedMeetup = await this.meetupPrismaClient.meetup.update({
      where: { id },
      data: {
        topic,
        description,
        time,
        date,
        country,
        city,
        street,
        houseNumber,
      },
    });

    await this.tagOnMeetupService.deleteTagOnMeetup(id);

    if (tags) {
      for (const tagName of tags) {
        const tag = await this.tagService.findOrUpdateTag(tagName);
        await this.tagOnMeetupService.addTagOnMeetup(id, tag.id);
      }
    }

    const res = { ...updatedMeetup, tags };

    await this.sendMessage(Pattern.UPDATE_MEETUP, res);

    return res;
  }

  async deleteMeetup({ id }: IdObject): Promise<Meetup> {
    const isExistedMeetup = await this.meetupPrismaClient.meetup.findFirst({
      where: { id },
    });

    if (!isExistedMeetup) {
      return null;
    }

    await this.tagOnMeetupService.deleteTagOnMeetup(id);
    const deletedMeetup = await this.meetupPrismaClient.meetup.delete({
      where: { id },
    });

    await this.sendMessage(Pattern.DELETE_MEETUP, { id });

    return deletedMeetup;
  }

  async findAllMeetups(): Promise<Meetup[]> {
    const meetups = await this.meetupPrismaClient.meetup.findMany({
      include: {
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return meetups.map((meetup) => ({
      ...meetup,
      tags: meetup.tags.map((tagOnMeetup) => tagOnMeetup.tag.name),
    }));
  }

  private async sendMessage(msg: string, data: any) {
    const pattern = { cmd: msg };
    await this.indexerClient.send(pattern, { data }).toPromise();
  }
}
