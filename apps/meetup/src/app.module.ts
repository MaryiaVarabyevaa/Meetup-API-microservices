import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MeetupModule } from './modules/meetup/meetup.module';
import { GeocodingModule } from '../../gateway/src/modules/geocoding/geocoding.module';
import { TagModule } from './modules/tag/tag.module';
import { TagOnMeetupModule } from './modules/tag-on-meetup/tag-on-meetup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/meetup/.env',
    }),
    MeetupModule,
    GeocodingModule,
    TagModule,
    TagOnMeetupModule,
  ],
})
export class AppModule {}
