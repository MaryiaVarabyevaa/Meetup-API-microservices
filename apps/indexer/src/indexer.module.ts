import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndexerService } from './indexer.service';
import { RmqModule } from '@app/common';
import { MeetupIndexerModule } from './modules/meetup-indexer/meetup-indexer.module';

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
  providers: [IndexerService],
})
export class IndexerModule {}
