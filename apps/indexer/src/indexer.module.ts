import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import { MeetupIndexerModule } from './meetup-indexer/meetup-indexer.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {IndexerService} from "./indexer.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/indexer/.env',
    }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('ES_PATH'),
      }),
      inject: [ConfigService],
    }),
    RmqModule,
    MeetupIndexerModule,
  ],
  providers: [IndexerService]
})
export class IndexerModule {}
