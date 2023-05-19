import {Inject, Injectable} from '@nestjs/common';
import {MeetupPrismaClient} from "@app/common";
import {TagOnMeetup} from "@prisma/client/meetup";

@Injectable()
export class TagOnMeetupService {

    constructor(
        @Inject('MEETUP_PRISMA') private readonly meetupPrismaClient: MeetupPrismaClient
    ) {}

    async addTagOnMeetup(meetupId: number, tagId: number): Promise<TagOnMeetup> {
        const tag = await this.meetupPrismaClient.tagOnMeetup.create({
            data: { meetupId, tagId }
        });
        return tag;
    }

    async deleteTagOnMeetup(meetupId: number) {
        const deletedTag = await this.meetupPrismaClient.tagOnMeetup.deleteMany({ where: { meetupId } });
        return deletedTag;
    }
}
