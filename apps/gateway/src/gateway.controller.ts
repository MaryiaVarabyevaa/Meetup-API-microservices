import {Body, Controller, Get, Post} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import {CreateMeetupDto} from "./createMeetup.dto";

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  findAll(): any {
    return this.gatewayService.findAll();
  }

  @Post()
  async addMeetup(@Body() createMeetupDto: CreateMeetupDto) {
    return this.gatewayService.addMeetup(createMeetupDto);
  }

}
