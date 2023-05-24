import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { IndexerModule } from './indexer.module';
import { IndexerService } from './indexer.service';

async function bootstrap() {
  const app = await NestFactory.create(IndexerModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('INDEXER'));

  const indexerService = app.get<IndexerService>(IndexerService);
  await indexerService.ensureIndexExists();

  await app.startAllMicroservices();
}
bootstrap();
