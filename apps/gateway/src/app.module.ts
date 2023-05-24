import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthPrismaModule } from '@app/common';
import { MeetupModule } from './modules/meetup/meetup.module';
import {GeocodingModule} from "./modules/geocoding/geocoding.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    AuthPrismaModule,
    MeetupModule,
    GeocodingModule
  ],
})
export class AppModule {}
