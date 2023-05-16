import { NestFactory } from '@nestjs/core';
import { MeetupModule } from './meetup.module';

async function bootstrap() {
  const app = await NestFactory.create(MeetupModule);
  await app.listen(3000);
}
bootstrap();
