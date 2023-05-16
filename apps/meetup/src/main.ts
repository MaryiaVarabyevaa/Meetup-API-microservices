import { NestFactory } from '@nestjs/core';
import { MeetupModule } from './meetup.module';
import {RmqService} from "@app/common";

async function bootstrap() {
  const app = await NestFactory.create(MeetupModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('MEETUP'));
  await app.startAllMicroservices();
}
bootstrap();
