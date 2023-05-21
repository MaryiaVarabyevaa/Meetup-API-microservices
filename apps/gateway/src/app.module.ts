import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AuthPrismaModule, RmqModule} from '@app/common';
import {MeetupModule} from "./modules/meetup/meetup.module";
import {MEETUP_SERVICE} from "./constants";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    AuthPrismaModule,
    MeetupModule
  ]
})
export class AppModule {}
