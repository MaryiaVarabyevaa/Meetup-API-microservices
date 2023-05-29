import {Controller} from '@nestjs/common';
import {Ctx, MessagePattern, RmqContext,} from '@nestjs/microservices';
import {ReportsService} from './reports.service';
import {RmqService} from '@app/common';
import {Pattern} from "./constants";
import {GetType} from "./decorators";
import {Format} from "./types";

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportService: ReportsService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: Pattern.GENERATE_REPORT })
  async handleGenerateReport(@GetType() type: Format, @Ctx() context: RmqContext) {
    const link = await this.reportService.generateReport(type);
    this.rmqService.ack(context);
    return link;
  }
}
