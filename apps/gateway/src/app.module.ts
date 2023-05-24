import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthPrismaModule } from '@app/common';
import { MeetupModule } from './modules/meetup/meetup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    AuthPrismaModule,
    MeetupModule,
  ],
})
export class AppModule {}
