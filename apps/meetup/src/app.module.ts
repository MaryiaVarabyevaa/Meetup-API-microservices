import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MeetupModule } from './modules/meetup/meetup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/meetup/.env',
    }),
    MeetupModule,
  ],
})
export class AppModule {}
