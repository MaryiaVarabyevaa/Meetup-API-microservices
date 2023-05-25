import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MeetupModule} from './modules/meetup/meetup.module';
import {TagModule} from './modules/tag/tag.module';
import {TagOnMeetupModule} from './modules/tag-on-meetup/tag-on-meetup.module';
import {ReportsModule} from "./modules/reports/reports.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/meetup/.env',
    }),
    MeetupModule,
    TagModule,
    TagOnMeetupModule,
    ReportsModule

  ],
})
export class AppModule {}
