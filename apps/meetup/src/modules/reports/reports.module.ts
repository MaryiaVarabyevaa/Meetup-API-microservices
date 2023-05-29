import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MeetupModule } from '../meetup/meetup.module';
import {RmqModule, YandexCloudModule} from '@app/common';

@Module({
  imports: [MeetupModule, RmqModule, YandexCloudModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
