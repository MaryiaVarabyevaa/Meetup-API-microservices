import { Module } from '@nestjs/common';
import { MeetupIndexerService } from './meetup-indexer.service';
import { MeetupIndexerController } from './meetup-indexer.controller';
import { RmqModule } from '@app/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RmqModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('ES_PATH'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MeetupIndexerService],
  controllers: [MeetupIndexerController],
})
export class MeetupIndexerModule {}
