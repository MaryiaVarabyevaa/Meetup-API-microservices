import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MeetupModule } from './modules/meetup/meetup.module';
import { TagModule } from './modules/tag/tag.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/meetup/.env',
    }),
    MeetupModule,
    TagModule,
    ReportsModule,
  ],
})
export class AppModule {}
