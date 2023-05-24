import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndexerService } from './indexer.service';
import { IndexerController } from './indexer.controller';
import { RmqModule } from '@app/common';

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
  ],
  providers: [IndexerService],
  controllers: [IndexerController],
})
export class IndexerModule {}
