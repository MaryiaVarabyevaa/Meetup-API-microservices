import { Module } from '@nestjs/common';
import { MeetupPrismaClient } from '../prisma-clients';

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