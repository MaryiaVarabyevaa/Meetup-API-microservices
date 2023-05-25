import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import {MeetupModule} from "../meetup/meetup.module";
import {YandexCloudService} from "./services";
import {RmqModule} from "@app/common";

@Module({
  imports: [MeetupModule, RmqModule],
  providers: [ReportsService, YandexCloudService],
  controllers: [ReportsController]
})
export class ReportsModule {}
