import {Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards,} from '@nestjs/common';
import {MeetupService} from './meetup.service';
import {CreateMeetupDto} from './dtos';
import {UpdateMeetupDto} from './dtos/update-meetup.dto';
import {RolesGuard} from '@app/common';
import { Response } from "express";

@Controller('meetup')
// @UseGuards(JwtAuthGuard)
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get()
  findAllMeetups(@Query() params: any) {
    return this.meetupService.findAllMeetups(params);
  }

  @Post()
  // @Roles('ORGANIZER')
  @UseGuards(RolesGuard)
  addMeetup(@Body() createMeetupDto: CreateMeetupDto) {
    return this.meetupService.addMeetup(createMeetupDto);
  }

  @Put()
  // @Roles('ORGANIZER')
  @UseGuards(RolesGuard)
  updateMeetup(@Body() updateMeetupDto: UpdateMeetupDto) {
    return this.meetupService.updateMeetup(updateMeetupDto);
  }

  @Delete(':id')
  // @Roles('ORGANIZER')
  @UseGuards(RolesGuard)
  deleteMeetup(@Param('id') id: number) {
    return this.meetupService.deleteMeetup(id);
  }

  @Get(':id')
  findMeetupById(@Param('id') id: number) {
    return this.meetupService.findMeetupById(id);
  }

  @Get('report/:type')
  generateReport(@Param('type') type: string, @Res({ passthrough: true }) res: Response) {
    return this.meetupService.generateReport(type)
  }
}
