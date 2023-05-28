import { Module } from '@nestjs/common';
import { YandexCloudService } from './yandex-cloud.service';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './libs/common/src/.env',
    }),
  ],
  providers: [YandexCloudService],
  exports: [YandexCloudService]
})
export class YandexCloudModule {}
