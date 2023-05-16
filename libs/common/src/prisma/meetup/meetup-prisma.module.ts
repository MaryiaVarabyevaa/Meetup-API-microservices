import { Module } from '@nestjs/common';
import { PrismaClient as MeetupPrismaClient } from '@prisma/client/meetup';

@Module({
    providers: [
        {
            provide: 'MEETUP_PRISMA',
            useValue: new MeetupPrismaClient(),
        },
    ],
    exports: ['MEETUP_PRISMA'],
})
export class MeetupPrismaModule {}