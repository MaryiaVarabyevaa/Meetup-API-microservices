import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(new ValidationPipe())

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
