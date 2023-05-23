import {NestFactory} from '@nestjs/core';
import {RmqService} from "@app/common";
import {IndexerModule} from "./indexer.module";

async function bootstrap() {
  const app = await NestFactory.create(IndexerModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('INDEXER'));
  await app.startAllMicroservices();
}
bootstrap();
