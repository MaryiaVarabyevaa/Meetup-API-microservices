import {ConflictException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {MeetupPrismaClient} from "@app/common";
import {CreateMeetup, IdObject, UpdateMeetup} from "./types";
import {ErrorMessages} from "./constants";
import {TagService} from "../tag/tag.service";
import {TagOnMeetupService} from "../tag-on-meetup/tag-on-meetup.service";
import {Meetup} from "@prisma/client/meetup";

@Injectable()
export class MeetupService {

    constructor(
        @Inject('MEETUP_PRISMA') private readonly meetupPrismaClient: MeetupPrismaClient,
        private readonly tagService: TagService,
        private readonly tagOnMeetupService: TagOnMeetupService
    ) {}

    async findAllMeetups() {
        const meetups = await this.meetupPrismaClient.meetup.findMany({
            include: {
                tags: {
                    select: {
                        tag: {
                            select: {
                                name: true,
                            }
                        },
                    },
                }
            }
        });

        return meetups.map((meetup) => ({
            ...meetup,
            tags: meetup.tags.map((tagOnMeetup) => tagOnMeetup.tag.name),
        }));
    }

    async addMeetup(meetup: CreateMeetup) {
        const { time, date, place, tags, ...rest } = meetup;

        const isExistedMeetup = await this.meetupPrismaClient.meetup.findFirst({
            where: { place, date, time },
        });

        if (isExistedMeetup) {
            throw new ConflictException(ErrorMessages.CONFLICT_ERROR);
        }

        const newMeetup = await this.meetupPrismaClient.meetup.create({
            data: {
                time,
                date,
                place,
                ...rest
            }
        });

        const newTags = await this.tagService.addTag(tags);
        await Promise.all(
            newTags.map(async (tag) => {
                await this.tagOnMeetupService.addTagOnMeetup(newMeetup.id, tag.id);
            })
        );

        return { ...newMeetup, tags };
    }

    async updateMeetup(meetup: UpdateMeetup): Promise<Meetup> {
        const { id, topic, description, time, date, place, tags } = meetup;
        const isExistedMeetup = await this.meetupPrismaClient.meetup.findFirst({ where: { id } });

        if (!isExistedMeetup) {
            throw new NotFoundException(ErrorMessages.NOT_FOUNT_ERROR);
        }

        const updatedMeetup = await this.meetupPrismaClient.meetup.update({
            where: { id },
            data: { topic, description, time, date, place },
        });

        await this.tagOnMeetupService.deleteTagOnMeetup(id);

        if (tags) {
            for (const tagName of tags) {
                const tag = await this.tagService.findOrUpdateTag(tagName);
                await this.tagOnMeetupService.addTagOnMeetup(id, tag.id);
            }
        }
        return updatedMeetup;
    }

    async findById({ id }: IdObject) {
        const meetup = await this.meetupPrismaClient.meetup.findUnique({
            where: { id },
            include: {
                tags: {
                    select: {
                        tag: {
                            select: {
                                name: true,
                            }
                        },
                    },
                }
            }
        });

        if (!meetup) {
            throw new NotFoundException(ErrorMessages.NOT_FOUNT_ERROR);
        }
        return { ...meetup, tags: meetup.tags.map((tagOnMeetup) => tagOnMeetup.tag.name) };
    }

    async deleteMeetup({ id }: IdObject ): Promise<Meetup> {
        const isExistedMeetup = await this.meetupPrismaClient.meetup.findFirst({ where: { id } });
        if (!isExistedMeetup) {
            throw new NotFoundException(ErrorMessages.NOT_FOUNT_ERROR);
        }

        await this.tagOnMeetupService.deleteTagOnMeetup(id);
        const deletedMeetup = await this.meetupPrismaClient.meetup.delete({ where: { id } });
        return deletedMeetup;
    }
}
