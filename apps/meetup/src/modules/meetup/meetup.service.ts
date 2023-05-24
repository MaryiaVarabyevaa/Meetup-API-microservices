import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MeetupPrismaClient } from '@app/common';
import { CreateMeetup, IdObject, UpdateMeetup } from './types';
import { ErrorMessages } from './constants';
import { TagService } from '../tag/tag.service';
import { TagOnMeetupService } from '../tag-on-meetup/tag-on-meetup.service';
import { Meetup } from '@prisma/client/meetup';
import { INDEXER_MEETUP } from '../../../../gateway/src/constants/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MeetupService {
  constructor(
    @Inject('MEETUP_PRISMA')
    private readonly meetupPrismaClient: MeetupPrismaClient,
    private readonly tagService: TagService,
    private readonly tagOnMeetupService: TagOnMeetupService,
    @Inject(INDEXER_MEETUP) private indexerClient: ClientProxy,
  ) {}

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

    await this.sendMessage('createMeetup', res);

    return res;
  }

  async updateMeetup(meetup: UpdateMeetup) {
    const { id, topic, description, time, date, place, tags } = meetup;
    const isExistedMeetup = await this.meetupPrismaClient.meetup.findFirst({
      where: { id },
    });

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

    const res = { ...updatedMeetup, tags };

    await this.sendMessage('updateMeetup', res);

    return res;
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
              },
            },
          },
        },
      },
    });

    if (!meetup) {
      throw new NotFoundException(ErrorMessages.NOT_FOUNT_ERROR);
    }
    return {
      ...meetup,
      tags: meetup.tags.map((tagOnMeetup) => tagOnMeetup.tag.name),
    };
  }

  async deleteMeetup({ id }: IdObject): Promise<Meetup> {
    const isExistedMeetup = await this.meetupPrismaClient.meetup.findFirst({
      where: { id },
    });
    if (!isExistedMeetup) {
      throw new NotFoundException(ErrorMessages.NOT_FOUNT_ERROR);
    }

    await this.tagOnMeetupService.deleteTagOnMeetup(id);
    const deletedMeetup = await this.meetupPrismaClient.meetup.delete({
      where: { id },
    });

    await this.sendMessage('deleteMeetup', { id });

    return deletedMeetup;
  }

  // async generateReportPDF() {
  //   const meetups = await this.findAllMeetups();
  //   const dir = this.checkDirHelper.checkDir(path.join(__dirname, '../../reports'));
  //   const docName = 'meetups.pdf';
  //
  //   await new Promise((resolve, reject) => {
  //     const doc = new PDFDocument();
  //     const writeStream = fs.createWriteStream(path.join(dir, docName));
  //     doc.pipe(writeStream);
  //
  //     doc.fontSize(20).text('Meetups', { align: 'center' }).moveDown();
  //     meetups.forEach((meetup) => {
  //       doc.fontSize(14).text(`Topic: ${meetup.topic}`);
  //       doc.fontSize(12).text(`Description: ${meetup.description}`);
  //       doc.fontSize(12).text(`Time: ${meetup.time}`);
  //       doc.fontSize(12).text(`Date: ${meetup.date}`);
  //       doc.fontSize(12).text(`Place: ${meetup.place}`);
  //       doc.fontSize(12).text(`Tags: ${meetup.tags}`);
  //       doc.moveDown();
  //     });
  //
  //     doc
  //         .on('error', (err) => {
  //           reject(err);
  //         })
  //         .end();
  //
  //     writeStream
  //         .on('finish', () => {
  //           resolve('');
  //         })
  //         .on('error', (err) => {
  //           reject(err);
  //         });
  //   });
  //
  //   return docName;
  // }
  //
  // async generateReportCSV() {
  //   const meetups = await this.findAllMeetups();
  //
  //   const dir = this.checkDirHelper.checkDir(path.join(__dirname, '../../reports'));
  //   const docName = 'meetups.csv';
  //
  //   await new Promise<void>((resolve, reject) => {
  //     const csvStream = csv.format({ headers: true });
  //     const writeStream = fs.createWriteStream(path.join(dir, docName));
  //     csvStream.pipe(writeStream);
  //
  //     meetups.forEach((meetup) => {
  //       const row = {
  //         id: meetup.id,
  //         topic: meetup.topic,
  //         description: meetup.description,
  //         time: meetup.time,
  //         date: meetup.date,
  //         place: meetup.place,
  //         tags: meetup.tags
  //       };
  //       csvStream.write(row);
  //     });
  //
  //     csvStream
  //         .on('error', (err) => {
  //           reject(err);
  //         })
  //         .end();
  //
  //     writeStream
  //         .on('finish', () => {
  //           resolve();
  //         })
  //         .on('error', (err) => {
  //           reject(err);
  //         });
  //   });
  //
  //   return docName;
  // }

  private async sendMessage(msg: string, data: any) {
    const pattern = { cmd: msg };
    await this.indexerClient.send(pattern, { data }).toPromise();
  }
}
