import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards,} from '@nestjs/common';
import {MeetupService} from './meetup.service';
import {CreateMeetupDto, IdParamDto, TypeParamDto, UpdateMeetupDto} from './dtos';
import {JwtAuthGuard, RolesGuard} from '@app/common';
import {Response} from 'express';
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles} from "./decorators";
import {Meetup} from "@prisma/client/meetup";


@ApiTags('meetup')
@Controller('meetup')
@UseGuards(JwtAuthGuard)
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async findAllMeetups(@Query() params: any): Promise<Meetup[]> {
    return await this.meetupService.findAllMeetups(params);
  }

  @Post()
  @ApiBody({ type: CreateMeetupDto })
  @Roles('ORGANIZER')
  @UseGuards(RolesGuard)
  async addMeetup(@Body() createMeetupDto: CreateMeetupDto): Promise<Meetup> {
    return await this.meetupService.addMeetup(createMeetupDto);
  }

  @Put()
  @ApiBody({ type: UpdateMeetupDto })
  @Roles('ORGANIZER')
  @UseGuards(RolesGuard)
  async updateMeetup(@Body() updateMeetupDto: UpdateMeetupDto): Promise<Meetup> {
    return await this.meetupService.updateMeetup(updateMeetupDto);
  }

  @Delete(':id')
  @Roles('ORGANIZER')
  @UseGuards(RolesGuard)
  async deleteMeetup(@Param('id') id: IdParamDto): Promise<Meetup> {
    return await this.meetupService.deleteMeetup(id);
  }

  @Get(':id')
  async findMeetupById(
      @Param('id') id: IdParamDto
  ): Promise<Meetup> {
    return await this.meetupService.findMeetupById(id);
  }

  @Get('report/:type')
  async generateReport(
    @Param('type') type: TypeParamDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    return await this.meetupService.generateReport(type);
  }
}
