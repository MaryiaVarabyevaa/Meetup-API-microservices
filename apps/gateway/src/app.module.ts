import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthPrismaModule } from '@app/common';
import { MeetupModule } from './modules/meetup/meetup.module';
import { GeocodingModule } from './modules/geocoding/geocoding.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    AuthPrismaModule,
    MeetupModule,
    GeocodingModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
