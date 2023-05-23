import { Inject, Injectable } from '@nestjs/common';
import { MeetupPrismaClient } from '@app/common';
import { Tag } from '@prisma/client/meetup';

@Injectable()
export class TagService {
  constructor(
    @Inject('MEETUP_PRISMA')
    private readonly meetupPrismaClient: MeetupPrismaClient,
  ) {}

  async findTag(tagName: string): Promise<Tag> {
    const tag = await this.meetupPrismaClient.tag.findUnique({
      where: { name: tagName },
    });
    return tag;
  }

  async addTag(tags: string[]) {
    const newTags = await Promise.all(
      tags.map(async (tagName: string) => {
        const existingTag = await this.findTag(tagName);
        if (existingTag) {
          return existingTag;
        }
        const tag = await this.meetupPrismaClient.tag.create({
          data: { name: tagName },
        });
        return tag;
      }),
    );
    return newTags;
  }

  async findOrUpdateTag(tagName: string) {
    const tag = await this.meetupPrismaClient.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
    return tag;
  }
}
