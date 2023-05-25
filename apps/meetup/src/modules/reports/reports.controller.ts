import { Controller } from '@nestjs/common';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {ReportsService} from "./reports.service";
import {RmqService} from "@app/common";

@Controller('reports')
export class ReportsController {

    constructor(
        private readonly reportService: ReportsService,
        private readonly rmqService: RmqService,
    ) {}

    @MessagePattern({ cmd: 'generateReport' })
    async handleGenerateReport(
        @Payload() data: any,
        @Ctx() context: RmqContext,
    ) {
        const link = await this.reportService.generateReport('csv');
        this.rmqService.ack(context);
        return link;
    }
}
