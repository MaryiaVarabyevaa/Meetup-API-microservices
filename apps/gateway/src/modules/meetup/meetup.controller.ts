import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {MeetupService} from "./meetup.service";
import {CreateMeetupDto} from "./dtos";
import {UpdateMeetupDto} from "./dtos/update-meetup.dto";

@Controller('meetup')
export class MeetupController {

    constructor(
        private readonly meetupService: MeetupService
    ) {}

    @Get()
    findAllMeetups() {
        return this.meetupService.findAllMeetups();
    }

    @Post()
    addMeetup(@Body() createMeetupDto: CreateMeetupDto) {
        return this.meetupService.addMeetup(createMeetupDto);
    }

    @Put()
    updateMeetup(@Body() updateMeetupDto: UpdateMeetupDto) {
        return this.meetupService.updateMeetup(updateMeetupDto);
    }

    @Delete(':id')
    deleteMeetup(@Param('id') id: number) {
        return this.meetupService.deleteMeetup(id);
    }

    @Get(':id')
    findMeetupById(@Param('id') id: number) {
        return this.meetupService.findMeetupById(id);
    }

}
